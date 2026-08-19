-- Create the default storage bucket for Mezcla (images, invoices)
insert into storage.buckets (id, name, public)
values ('mezcla', 'mezcla', true)
on conflict (id) do nothing;

-- Enable public read access for all files in the bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'mezcla' );

-- Allow the backend (Service Role) to upload and delete files
-- Note: Service Role bypasses RLS anyway, but adding these for completeness
create policy "Admin Upload Access"
  on storage.objects for insert
  with check ( bucket_id = 'mezcla' );

create policy "Admin Delete Access"
  on storage.objects for delete
  using ( bucket_id = 'mezcla' );
