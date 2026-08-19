/**
 * Image upload utility with auto-delete and WebP conversion
 * Uses Supabase Storage + Sharp for image processing
 */
import sharp from 'sharp';
import { adminSupabase } from './supabase.js';
import { nanoid } from 'nanoid';

const BUCKET = process.env.STORAGE_BUCKET ?? 'mezcla';

type ImageFolder = 'products' | 'categories' | 'gallery' | 'og';

interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload an image to Supabase Storage with WebP conversion.
 * Automatically deletes the old image if oldUrl is provided.
 *
 * @param buffer - Raw image buffer
 * @param folder - Storage folder (products, categories, gallery, og)
 * @param oldUrl - Old image public URL to delete (optional)
 * @param maxWidth - Max width in pixels (default 1920)
 */
export async function uploadImage(
  buffer: Buffer,
  folder: ImageFolder,
  oldUrl?: string | null,
  maxWidth: number = 1920
): Promise<UploadResult> {
  // Delete old image if URL provided
  if (oldUrl) {
    await deleteImageByUrl(oldUrl);
  }

  // Convert to WebP with Sharp
  const webpBuffer = await sharp(buffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 85, effort: 4 })
    .toBuffer();

  const path = `${folder}/${Date.now()}-${nanoid(8)}.webp`;

  const { error } = await adminSupabase.storage
    .from(BUCKET)
    .upload(path, webpBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000', // 1 year — images are immutable (content-addressed)
    });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = adminSupabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/**
 * Delete an image from Supabase Storage given its public URL
 */
export async function deleteImageByUrl(publicUrl: string): Promise<void> {
  try {
    // Extract path from URL: https://xxx.supabase.co/storage/v1/object/public/mezcla/products/xxx.webp
    const urlObj = new URL(publicUrl);
    const pathParts = urlObj.pathname.split(`/object/public/${BUCKET}/`);
    if (pathParts.length !== 2) return; // Not a Supabase storage URL

    const storagePath = pathParts[1];
    await adminSupabase.storage.from(BUCKET).remove([storagePath]);
  } catch {
    // Log but don't throw — old image deletion failure should not block new upload
    console.warn(`Failed to delete old image: ${publicUrl}`);
  }
}

/**
 * Delete multiple images by their storage paths
 */
export async function deleteImages(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const { error } = await adminSupabase.storage.from(BUCKET).remove(paths);
  if (error) throw new Error(`Image deletion failed: ${error.message}`);
}
