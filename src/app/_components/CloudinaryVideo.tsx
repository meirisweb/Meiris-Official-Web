"use client";

interface CloudinaryVideoProps {
  src: string;
}

export default function CloudinaryVideo({ src }: CloudinaryVideoProps) {
  // Use the internal API route to hide the direct Cloudinary URL from the DOM
  const videoUrl = `/api/media?id=${src}`;

  return (
    <video
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      src={videoUrl}
      autoPlay
      loop
      muted
      playsInline
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
