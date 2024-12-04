import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/Carousel";
import Image from "next/image";

interface AnunciosCarouselProps {
  images: string[];
}

const AnunciosCarousel: React.FC<AnunciosCarouselProps> = ({ images }) => {
  return (
    <div className="w-full bg-[#eeaf85] py-2">
      <div className="mx-auto max-w-screen-xl px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {images.map((image, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-2 md:basis-1/4 lg:basis-1/6"
              >
                <div className="bg-[#e88d50] rounded-lg h-[100px] relative overflow-hidden">
                  <Image
                    src={image}
                    alt={`Anuncio ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </div>
  );
};

export default AnunciosCarousel;
