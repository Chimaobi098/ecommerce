'use client'

import Image from 'next/image'

interface ProductImageProps {
  image: string
  alt: string
}

export function ProductImage({ image, alt }: ProductImageProps) {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden">
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  )
}