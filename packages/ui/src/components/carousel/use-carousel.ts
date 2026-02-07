'use client';

import { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

type EmblaApi = ReturnType<typeof useEmblaCarousel>[1];
type EmblaOptions = Parameters<typeof useEmblaCarousel>[0];

type UseCarouselReturn = {
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
  emblaApi: EmblaApi;
  selectedIndex: number;
  scrollSnaps: number[];
  onPrev: VoidFunction;
  onNext: VoidFunction;
  onSelect: (index: number) => void;
};

export function useCarousel(options?: EmblaOptions): UseCarouselReturn {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const onPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const onNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  // Set up event listeners when emblaApi becomes available
  if (emblaApi) {
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
    emblaApi.on('init', () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }

  return {
    emblaRef,
    emblaApi,
    selectedIndex,
    scrollSnaps,
    onPrev,
    onNext,
    onSelect,
  };
}
