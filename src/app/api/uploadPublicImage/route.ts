import { supabaseAdmin } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const formData = await req.formData()
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({error: "No file"}, {status: 400})
    
    const {data, error} = await supabaseAdmin.storage.from("public-assets").upload(`public/${Date.now()}_${file.name}`, file)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const {data: {publicUrl}} = supabaseAdmin.storage.from("public-assets").getPublicUrl(data.path)

    return NextResponse.json({url: publicUrl})
}