<script setup lang="ts">
// Besökschatt-widget för Core Gym (Desktop Only)
// På mobil hanteras chatten via mobilmenyn (MobileLogoMenu.vue)

// State for visibility logic (kept here to control the FAB)
const isOpen = ref(false)
const isVisible = ref(false) // Delay visibility
const hasUnread = ref(false)
const wasManuallyDismissed = ref(false)

// Route for conditional display and context
const route = useRoute()

// Dölj helt på dessa sidor (har egen chat eller irrelevant)
const shouldHide = computed(() => {
  const hiddenPaths = ['/kontakt', '/osmo', '/integritetspolicy', '/villkor', '/logga-in']
  return hiddenPaths.some(p => route.path.startsWith(p))
})

// Sidtyp för att bestämma visningsstrategi
const pageType = computed(() => {
  const path = route.path
  if (path === '/bli-medlem' || path.startsWith('/pt')) return 'high-intent'
  if (path.startsWith('/tungelsta') || path.startsWith('/vasterhaninge') ||
      path.startsWith('/vegastaden') || path === '/schema' || path === '/om-oss') return 'informational'
  if (path.startsWith('/yoga') || path.startsWith('/mammatraning') ||
      path.startsWith('/barndans') || path.startsWith('/ungdomstraning')) return 'activity'
  return 'default'
})

// Scroll tracking
const scrollProgress = ref(0)
const hasScrolledEnough = ref(false)

onMounted(() => {
  if (import.meta.server) return

  const handleScroll = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    scrollProgress.value = docHeight > 0 ? scrollTop / docHeight : 0

    if (scrollProgress.value > 0.2) {
      hasScrolledEnough.value = true
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})

// Dynamisk delay
const showDelay = computed(() => {
  switch (pageType.value) {
    case 'high-intent': return 2000
    case 'informational': return 0
    case 'activity': return 0
    default: return 4000
  }
})

const requiresScroll = computed(() => {
  return pageType.value === 'informational' || pageType.value === 'activity'
})

// CTA text
const ctaText = computed(() => {
  const path = route.path
  if (path === '/bli-medlem') return 'Hjälp mig välja'
  if (path.startsWith('/pt')) return 'Boka konsultation'
  if (path === '/schema') return 'Fråga om pass'
  if (path.startsWith('/tungelsta') || path.startsWith('/vasterhaninge') || path.startsWith('/vegastaden')) return 'Ställ en fråga'
  return 'Frågor?'
})

// Visibility logic
onMounted(() => {
  if (import.meta.server) return

  const dismissed = sessionStorage.getItem('cgc_chat_dismissed')
  if (dismissed === 'true') {
    wasManuallyDismissed.value = true
  }

  if (requiresScroll.value) {
    const checkScroll = setInterval(() => {
      if (hasScrolledEnough.value) {
        isVisible.value = true
        clearInterval(checkScroll)
      }
    }, 100)
    setTimeout(() => {
      clearInterval(checkScroll)
      isVisible.value = true
    }, 10000)
  } else {
    setTimeout(() => {
      isVisible.value = true
    }, showDelay.value)
  }
})

function closeChat() {
  isOpen.value = false
  wasManuallyDismissed.value = true
  sessionStorage.setItem('cgc_chat_dismissed', 'true')
}

// NOTE: We don't poll for unread messages here in the wrapper anymore to keep it simple,
// but ChatInterface handles polling when mounted. 
// Ideally we would share state, but this is acceptable for now.
</script>

<template>
  <!-- Chat Widget - Desktop Only (hidden on touch devices/small screens) -->
  <!-- Using lg:block to show only on large screens, hidden by default -->
  <div
    v-if="!shouldHide"
    class="hidden lg:block fixed bottom-[24px] right-[24px] z-50 font-sans"
  >
    <!-- Floating liquid glass button -->
    <Transition name="slide-in">
      <button
        v-if="isVisible && !isOpen && !wasManuallyDismissed"
        @click="isOpen = true"
        class="chat-fab group relative flex items-center gap-3 px-6 py-4 rounded-full"
      >
        <!-- Icon -->
        <span class="w-9 h-9 rounded-full bg-on-surface/10 flex items-center justify-center group-hover:bg-on-surface/15 transition-colors">
          <svg class="w-5 h-5 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </span>

        <!-- Text -->
        <span class="font-medium text-sm text-on-surface">{{ ctaText }}</span>
      </button>
    </Transition>

    <!-- Chat Panel -->
    <Transition name="slide-panel">
      <div
        v-if="isOpen"
        class="chat-panel absolute bottom-0 right-0 w-96 h-[500px] max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
      >
        <!-- Reusable Interface -->
        <ChatInterface @close="closeChat" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ===== LIQUID GLASS CHAT FAB ===== */
.chat-fab {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.3) 100%
  );
  backdrop-filter: blur(40px) saturate(200%) brightness(1.1);
  -webkit-backdrop-filter: blur(40px) saturate(200%) brightness(1.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.06),
    inset 0 1px 1px rgba(255, 255, 255, 0.7),
    inset 0 -1px 1px rgba(0, 0, 0, 0.04);

  cursor: pointer;
  will-change: transform, opacity;
  transition:
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease,
    background 0.3s ease;
}

.chat-fab:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    0 14px 44px rgba(0, 0, 0, 0.16),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 1px rgba(255, 255, 255, 0.8);
}

.chat-fab:active {
  transform: translateY(2px) scale(0.95);
  transition: transform 0.08s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== CHAT PANEL CONTAINER ===== */
.chat-panel {
  background: white; /* ChatInterface has its own background, but this is a safe fallback */
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.15),
    0 10px 30px rgba(0, 0, 0, 0.1);
}

/* ===== ANIMATIONS ===== */
.slide-in-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-in-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}
.slide-in-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.8);
}
.slide-in-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.slide-panel-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-panel-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}
.slide-panel-enter-from {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}
.slide-panel-leave-to {
  transform: translateY(10px) scale(0.98);
  opacity: 0;
}
</style>