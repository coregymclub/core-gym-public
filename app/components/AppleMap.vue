<script setup lang="ts">
interface Gym {
  name: string
  address: string
  lat: number
  lng: number
  href: string
  comingSoon?: boolean
}

const props = defineProps<{
  gyms?: Gym[]
  center?: { lat: number; lng: number }
  zoom?: number
  singleGym?: Gym
  interactive?: boolean
}>()

const emit = defineEmits<{
  (e: 'gymSelected', gym: Gym): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
const mapInstance = ref<any>(null)
const selectedGym = ref<Gym | null>(null)

// Default gyms if not provided
const defaultGyms: Gym[] = [
  { name: 'Tungelsta', address: 'Tungelstavägen 200, Tungelsta', lat: 59.105746, lng: 18.038984, href: '/tungelsta' },
  { name: 'Västerhaninge', address: 'Centrumvägen 4, Västerhaninge', lat: 59.122003, lng: 18.105657, href: '/vasterhaninge' },
  { name: 'Vegastaden', address: 'Vega Allé 2, Vega', lat: 59.1868, lng: 18.1446, href: '/vegastaden' },
  { name: 'Ösmo', address: 'Öppnar hösten 2026', lat: 59.0347, lng: 17.9542, href: '/osmo', comingSoon: true },
]

const gymsToShow = computed(() => {
  if (props.singleGym) return [props.singleGym]
  return props.gyms || defaultGyms
})

const mapCenter = computed(() => {
  if (props.center) return props.center
  if (props.singleGym) return { lat: props.singleGym.lat, lng: props.singleGym.lng }
  return { lat: 59.11, lng: 18.06 }
})

onMounted(async () => {
  if (!window.mapkit) {
    await loadMapKit()
  }

  // Only init once
  if (!window.mapkit.initialized) {
    window.mapkit.init({
      authorizationCallback: (done: (token: string) => void) => {
        // Wildcard token for *.coregym.club (www, zeydance, etc.)
        done('eyJraWQiOiI1R1ZTODY4SjdEIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJLOTJXRFpLRjNCIiwiaWF0IjoxNzY3NzE2MzUwLCJvcmlnaW4iOiIqLmNvcmVneW0uY2x1YiJ9.T80QU-MIDp0MYtZTZ5TMk-WBSED1X15iST_3wSt96taC2FfSC1NTJw2B9qVUEC5vWtSEtlEOZ8wQl5SmcfmvlA')
      }
    })
    window.mapkit.initialized = true
  }

  const map = new window.mapkit.Map(mapContainer.value, {
    center: new window.mapkit.Coordinate(mapCenter.value.lat, mapCenter.value.lng),
    colorScheme: window.mapkit.Map.ColorSchemes.Light,
    mapType: window.mapkit.Map.MapTypes.MutedStandard,
    showsCompass: window.mapkit.FeatureVisibility.Hidden,
    showsZoomControl: false,
    showsMapTypeControl: false,
    isRotationEnabled: false,
    showsScale: window.mapkit.FeatureVisibility.Hidden,
    padding: new window.mapkit.Padding(20, 20, 20, 20),
  })

  mapInstance.value = map

  // Create custom annotations
  const annotations = gymsToShow.value.map(gym => {
    const coordinate = new window.mapkit.Coordinate(gym.lat, gym.lng)

    // Custom annotation with callout
    const annotation = new window.mapkit.MarkerAnnotation(coordinate, {
      color: gym.comingSoon ? '#666666' : '#c83c16',
      title: gym.name,
      subtitle: gym.address,
      glyphText: gym.comingSoon ? '?' : 'C',
      glyphColor: '#ffffff',
      animates: true,
      callout: {
        calloutElementForAnnotation: () => {
          const element = document.createElement('div')
          element.className = 'apple-map-callout'
          element.innerHTML = `
            <div style="
              background: white;
              border-radius: 16px;
              padding: 16px 20px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.15);
              min-width: 200px;
              font-family: system-ui, -apple-system, sans-serif;
            ">
              <div style="font-weight: 700; font-size: 18px; color: #1a1a1a; margin-bottom: 4px;">
                Core Gym Club ${gym.name}
              </div>
              <div style="color: #666; font-size: 14px; margin-bottom: 12px;">
                ${gym.address}
              </div>
              ${gym.comingSoon ? `
                <div style="
                  background: #f5f5f5;
                  color: #666;
                  padding: 10px 16px;
                  border-radius: 8px;
                  font-size: 14px;
                  font-weight: 600;
                  text-align: center;
                ">
                  Kommer snart
                </div>
              ` : `
                <a href="${gym.href}" style="
                  display: block;
                  background: #c83c16;
                  color: white;
                  padding: 10px 16px;
                  border-radius: 8px;
                  font-size: 14px;
                  font-weight: 600;
                  text-align: center;
                  text-decoration: none;
                ">
                  Läs mer →
                </a>
              `}
            </div>
          `
          return element
        }
      }
    })

    annotation.addEventListener('select', () => {
      selectedGym.value = gym
      emit('gymSelected', gym)
    })

    return annotation
  })

  map.addAnnotations(annotations)

  // Fit to show all markers with animation
  setTimeout(() => {
    if (gymsToShow.value.length > 1) {
      map.showItems(annotations, {
        padding: new window.mapkit.Padding(80, 80, 80, 80),
        animate: true
      })
    } else {
      map.setRegionAnimated(
        new window.mapkit.CoordinateRegion(
          new window.mapkit.Coordinate(mapCenter.value.lat, mapCenter.value.lng),
          new window.mapkit.CoordinateSpan(0.015, 0.015)
        ),
        true
      )
    }
  }, 100)
})

function loadMapKit(): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'
    script.crossOrigin = 'anonymous'
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

onUnmounted(() => {
  if (mapInstance.value) {
    mapInstance.value.destroy()
  }
})

declare global {
  interface Window {
    mapkit: any
  }
}
</script>

<template>
  <div ref="mapContainer" class="w-full h-full min-h-[400px] rounded-2xl overflow-hidden" />
</template>

<style>
.mk-map-view .mk-controls-container {
  opacity: 0.6;
}
</style>
