export const runtime = "edge";

import { AwsV4Signer } from "aws4fetch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (
    !process.env.R2_ACCOUNT_ID ||
    !process.env.R2_ACCESS_KEY_ID ||
    !process.env.R2_SECRET_ACCESS_KEY ||
    !process.env.R2_BUCKET_NAME
  ) {
    return NextResponse.json({ error: "Missing R2 env vars" }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;

    if (!file || !folder) {
      return NextResponse.json({ error: "Missing file or folder" }, { status: 400 });
    }

    const safeName = file.name.replace(/\s+/g, "-");
    const key = `${folder}/${Date.now()}_${safeName}`;
    const endpoint = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const url = `${endpoint}/${process.env.R2_BUCKET_NAME}/${key}`;

    const signer = new AwsV4Signer({
      url,
      method: "PUT",
      region: "auto",
      service: "s3",
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      headers: new Headers({ "Content-Type": file.type }),
      body: file,
    });

    const signed = await signer.sign();
    const r2Res = await fetch(signed.url, {
      method: "PUT",
      headers: signed.headers,
      body: file,
    });

    if (!r2Res.ok) {
      const text = await r2Res.text();
      return NextResponse.json({ error: `R2 upload failed: ${text}` }, { status: 500 });
    }

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    return NextResponse.json({ publicUrl });
  } catch (err) {
    console.error("R2 upload error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
