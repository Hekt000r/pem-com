import { supabase } from "./server"

export async function uploadCV(file: File): Promise<string> {
  if (!file) return "";

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const fileName = `cv-${Date.now()}.pdf`;

  const { data, error } = await supabase.storage
    .from('pemcom') // replace with your actual bucket name
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) return "";

  // return the path to the uploaded file
  return data?.path ?? "";
}