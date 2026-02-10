import { supabaseAdmin } from "./admin";

// Uploads an image to Supabase S3 and returns publicUrl
export async function UploadPublicImage(
  image: Buffer | File | ArrayBuffer,
  storagePath: string,
  contentType: string = "image/png",
) {
  const { data, error } = await supabaseAdmin.storage
    .from("public-assets")
    .upload(storagePath, image, {
      contentType: contentType,
      upsert: true,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("public-assets").getPublicUrl(data.path);

  return publicUrl;
}
