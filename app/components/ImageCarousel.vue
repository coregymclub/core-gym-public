<script setup lang="ts">
import emblaCarouselVue from 'embla-carousel-vue'

interface Slide {
  src: string
  alt: string
  caption: string
}

const props = defineProps<{
  slides: Slide[]
}>()

const [emblaRef, emblaApi] = emblaCarouselVue({
  loop: true,
  dragFree: false,
  containScroll: 'trimSnaps'
})

const selectedIndex = ref(0)

function scrollTo(index: number) {
  emblaApi.value?.scrollTo(index)
}

function onSelect() {
  if (!emblaApi.value) return
  selectedIndex.value = emblaApi.value.selectedScrollSnap()
}

onMounted(() => {
  if (!emblaApi.value) return
  emblaApi.value.on('select', onSelect)
  onSelect()
})
</script>

<template>
  <div class="embla">
    <!-- Viewport -->
    <div ref="emblaRef" class="embla__viewport">
      <div class="embla__container">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="embla__slide"
        >
          <div class="aspect-[5/6] md:aspect-[5/4] rounded-3xl overflow-hidden relative group">
            <img
              :src="slide.src"
              :alt="slide.alt"
              class="w-full h-full object-cover image-treatment"
            />
            <!-- Caption overlay -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-16 md:p-10 md:pt-20">
              <p class="text-white text-base md:text-xl font-medium">
                {{ slide.caption }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dots -->
    <div class="flex justify-center gap-2 mt-6">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        @click="scrollTo(index)"
        class="w-2 h-2 rounded-full transition-all duration-300"
        :class="index === selectedIndex ? 'bg-on-surface w-6' : 'bg-on-surface/30 hover:bg-on-surface/50'"
        :aria-label="`Gå till bild ${index + 1}`"
      />
    </div>
  </div>
</template>

<style scoped>
.embla {
  --slide-spacing: 0;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
}

@media (min-width: 768px) {
  .embla {
    margin-left: 0;
    margin-right: 0;
  }
}

.embla__viewport {
  overflow: hidden;
  border-radius: 1.5rem;
}

.embla__container {
  display: flex;
  touch-action: pan-y pinch-zoom;
  margin-left: calc(var(--slide-spacing) * -1);
}

.embla__slide {
  flex: 0 0 100%;
  min-width: 0;
  padding-left: var(--slide-spacing);
}

/* Modern image treatment - slight desaturation + contrast for editorial look */
.image-treatment {
  filter: saturate(0.9) contrast(1.05) brightness(0.98);
  transition: filter 0.4s ease;
}

.group:hover .image-treatment {
  filter: saturate(1) contrast(1.02) brightness(1);
}
</style>
