"use client";

import { useState } from "react";

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const gallery = images.length > 0 ? images : [""];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square bg-sand rounded-2xl overflow-hidden">
        {gallery[activeIndex] ? (
          <img
            src={gallery[activeIndex]}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-bark/30 font-body">
            No image
          </div>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2">
          {gallery.map((src, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                index === activeIndex ? "border-canopy" : "border-transparent"
              }`}
            >
              <img
                src={src}
                alt={`${alt} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}