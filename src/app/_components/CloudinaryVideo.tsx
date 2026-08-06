"use client";

import { getCldVideoUrl } from "next-cloudinary";

interface CloudinaryVideoProps {
  src: string;
}

export default function CloudinaryVideo({ src }: CloudinaryVideoProps) {
  const videoUrl = getCldVideoUrl({
    src,
    format: "auto",
  });

  return (
    <video
      className="absolute inset-0 w-full h-full object-cover"
      src={videoUrl}
      autoPlay
      loop
      muted
      playsInline
    />
  );
}
