import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type') || 'video'; // 'video' or 'image'
  const ext = searchParams.get('ext') || (type === 'video' ? 'mp4' : 'jpg');

  if (!id) {
    return new Response('Media ID is required', { status: 400 });
  }

  // Generate the raw asset URL (avoids strict transformation errors and exposes only this API endpoint to the client)
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'efi3yigo';
  const url = `https://res.cloudinary.com/${cloudName}/${type}/upload/${id}.${ext}`;

  // Use 308 Permanent Redirect to tell the browser to cache this redirect heavily
  return NextResponse.redirect(url, {
    status: 308,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
