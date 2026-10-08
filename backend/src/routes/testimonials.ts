import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('testimonials').select('*').eq('is_active', true).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
});

// Cache reviews in memory to prevent exceeding Google API quotas (Cache for 24h)
let cachedGoogleReviews: any = null;
let lastGoogleFetch = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000;

router.get('/google', async (_req, res) => {
  try {
    if (cachedGoogleReviews && (Date.now() - lastGoogleFetch < CACHE_TTL)) {
      res.json({ data: cachedGoogleReviews });
      return;
    }

    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!placeId || !apiKey) {
      res.status(500).json({ error: 'Google Places API configuration missing. Add GOOGLE_PLACE_ID and GOOGLE_API_KEY to backend .env' });
      return;
    }

    // Use the New Places API
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=reviews,rating,userRatingCount`, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Google API responded with ${response.status}: ${await response.text()}`);
    }

    const data = await response.json() as any;

    if (data.error) {
      console.error('Google API Error:', data.error.message);
      res.status(403).json({ error: 'API Key is restricted or Places API is not enabled.' });
      return;
    }
    
    if (data) {
      cachedGoogleReviews = {
        reviews: data.reviews || [],
        rating: data.rating || 0,
        userRatingCount: data.userRatingCount || 0
      };
      lastGoogleFetch = Date.now();
      res.json({ data: cachedGoogleReviews });
    } else {
      res.json({ data: { reviews: [], rating: 0, userRatingCount: 0 } });
    }
  } catch (err: any) {
    console.error("Google Places API error:", err.message);
    res.status(500).json({ error: 'Failed to fetch Google reviews' });
  }
});

export default router;
