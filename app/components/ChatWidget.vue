<script setup lang="ts">
// Besökschatt-widget för Core Gym
// Ansluter till visitor-chat worker

const CHAT_API = 'https://visitor-chat.gustav-brydner.workers.dev'

// State
const isOpen = ref(false)
const isVisible = ref(false) // Delay visibility
const isLoading = ref(false)
const visitorId = ref<string | null>(null)
const messages = ref<Array<{
  id: string
  text: string
  from: 'visitor' | 'staff'
  staffName?: string
  timestamp: string
}>>([])
const newMessage = ref('')
const status = ref<'active' | 'waiting' | 'closed'>('active')
const hasUnread = ref(false)
const wasManuallyDismissed = ref(false) // Track if user dismissed

// Refs
const messagesContainer = ref<HTMLElement | null>(null)

// Route for conditional display
const route = useRoute()
const shouldHide = computed(() => {
  // Hide on provträning, contact forms, etc.
  const hiddenPaths = ['/provtrana', '/kontakt', '/osmo']
  return hiddenPaths.some(p => route.path.startsWith(p))
})

// Ladda visitor ID och visa med delay
onMounted(() => {
  if (import.meta.server) return

  const stored = localStorage.getItem('cgc_visitor_id')
  if (stored) {
    visitorId.value = stored
    checkForUnread()
  }

  // Check if manually dismissed this session
  const dismissed = sessionStorage.getItem('cgc_chat_dismissed')
  if (dismissed === 'true') {
    wasManuallyDismissed.value = true
  }

  // Show chat tab after delay (5 seconds)
  setTimeout(() => {
    isVisible.value = true
  }, 5000)
})

// Kolla efter olästa meddelanden i bakgrunden
async function checkForUnread() {
  if (!visitorId.value) return

  try {
    const res = await fetch(`${CHAT_API}/api/messages?visitorId=${visitorId.value}`)
    const data = await res.json()

    if (data.messages) {
      const staffMessages = data.messages.filter((m: any) => m.from === 'staff')
      const lastSeen = localStorage.getItem('cgc_last_seen') || '0'
      const unreadCount = staffMessages.filter((m: any) => new Date(m.timestamp) > new Date(lastSeen)).length

      if (unreadCount > 0) {
        hasUnread.value = true
        // If unread, show immediately and override dismiss
        isVisible.value = true
        wasManuallyDismissed.value = false
      }
    }
  } catch (e) {
    console.error('Failed to check for unread:', e)
  }
}

// Starta eller återuppta konversation
async function startConversation() {
  try {
    const res = await fetch(`${CHAT_API}/api/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId: visitorId.value })
    })
    const data = await res.json()

    visitorId.value = data.visitorId
    localStorage.setItem('cgc_visitor_id', data.visitorId)
    messages.value = data.messages || []
    status.value = data.status || 'active'
  } catch (e) {
    console.error('Failed to start conversation:', e)
  }
}

// Ladda befintlig konversation
async function loadConversation() {
  if (!visitorId.value) return

  try {
    const res = await fetch(`${CHAT_API}/api/messages?visitorId=${visitorId.value}`)
    const data = await res.json()

    if (data.messages) {
      messages.value = data.messages
      status.value = data.status || 'active'
      localStorage.setItem('cgc_last_seen', new Date().toISOString())
      hasUnread.value = false
    }
  } catch (e) {
    console.error('Failed to load conversation:', e)
  }
}

// Skicka meddelande
async function sendMessage() {
  if (!newMessage.value.trim() || isLoading.value) return

  if (!visitorId.value) {
    await startConversation()
  }

  isLoading.value = true
  const text = newMessage.value.trim()
  newMessage.value = ''

  try {
    const res = await fetch(`${CHAT_API}/api/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: visitorId.value,
        text
      })
    })
    const data = await res.json()

    if (data.success && data.message) {
      messages.value.push(data.message)
      status.value = data.status || 'waiting'
      scrollToBottom()
    }
  } catch (e) {
    console.error('Failed to send message:', e)
    newMessage.value = text
  } finally {
    isLoading.value = false
  }
}

// Close chat and remember
function closeChat() {
  isOpen.value = false
  wasManuallyDismissed.value = true
  sessionStorage.setItem('cgc_chat_dismissed', 'true')
}

// Poll för nya meddelanden
let pollInterval: ReturnType<typeof setInterval> | null = null

watch(isOpen, (open) => {
  if (open) {
    hasUnread.value = false
    localStorage.setItem('cgc_last_seen', new Date().toISOString())

    if (!visitorId.value) {
      startConversation()
    } else {
      loadConversation()
    }
    pollInterval = setInterval(pollForMessages, 3000)
  } else {
    if (pollInterval) {
      clearInterval(pollInterval)
      pollInterval = null
    }
  }
})

async function pollForMessages() {
  if (!visitorId.value || !isOpen.value) return

  try {
    const lastTimestamp = messages.value.length > 0
      ? messages.value[messages.value.length - 1].timestamp
      : ''

    const res = await fetch(`${CHAT_API}/api/messages?visitorId=${visitorId.value}&since=${lastTimestamp}`)
    const data = await res.json()

    if (data.messages && data.messages.length > 0) {
      for (const msg of data.messages) {
        if (!messages.value.find(m => m.id === msg.id)) {
          messages.value.push(msg)
          if (msg.from === 'staff' && !isOpen.value) {
            hasUnread.value = true
          }
        }
      }
      scrollToBottom()
    }
    status.value = data.status || status.value
  } catch (e) {
    console.error('Poll error:', e)
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
}

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})
</script>

<template>
  <!-- Chat Widget - Right side, centered vertically -->
  <div
    v-if="!shouldHide"
    class="fixed top-1/2 -translate-y-1/2 right-0 z-50 font-sans"
  >
    <!-- Side tab - shows after delay unless dismissed -->
    <Transition name="slide-in">
      <button
        v-if="isVisible && !isOpen && (!wasManuallyDismissed || hasUnread)"
        @click="isOpen = true"
        class="absolute right-0 top-1/2 -translate-y-1/2 bg-core-dark text-white py-3 px-2 rounded-l-lg shadow-lg hover:bg-core-dark/90 transition-all flex flex-col items-center gap-1.5"
      >
        <!-- Unread indicator -->
        <span
          v-if="hasUnread"
          class="absolute -top-1 -left-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"
        />

        <!-- Icon -->
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span class="text-xs font-medium writing-vertical">Frågor?</span>
      </button>
    </Transition>

    <!-- Chat Panel - slides in from right -->
    <Transition name="slide-panel">
      <div
        v-if="isOpen"
        class="w-80 sm:w-96 h-[480px] max-h-[80vh] bg-white rounded-l-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
      >
        <!-- Header -->
        <div class="bg-core-dark text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-3">
            <img
              src="https://cdn.coregymclub.se/icons/logo-round.png"
              alt="Core Gym"
              class="w-8 h-8 rounded-full"
            />
            <div>
              <h3 class="font-semibold text-sm">Core Gym Club</h3>
              <p class="text-xs text-white/70">
                {{ status === 'waiting' ? 'Väntar på svar...' : 'Vi svarar så snart vi kan' }}
              </p>
            </div>
          </div>
          <button
            @click="closeChat"
            class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        >
          <!-- Welcome message -->
          <div v-if="messages.length === 0" class="text-center py-8">
            <div class="w-12 h-12 bg-core-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-core-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p class="text-gray-600 text-sm">
              Hej! Skriv ett meddelande så svarar vi så snart vi kan.
            </p>
          </div>

          <!-- Message bubbles -->
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex"
            :class="msg.from === 'visitor' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[80%] px-4 py-2 rounded-2xl"
              :class="msg.from === 'visitor'
                ? 'bg-core-dark text-white rounded-br-sm'
                : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'"
            >
              <p v-if="msg.from === 'staff' && msg.staffName" class="text-xs text-gray-500 mb-1">
                {{ msg.staffName }}
              </p>
              <p class="text-sm whitespace-pre-wrap">{{ msg.text }}</p>
              <p class="text-xs mt-1" :class="msg.from === 'visitor' ? 'text-white/50' : 'text-gray-400'">
                {{ formatTime(msg.timestamp) }}
              </p>
            </div>
          </div>

          <!-- Waiting indicator -->
          <div v-if="status === 'waiting' && messages.length > 0" class="flex justify-start">
            <div class="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
              <div class="flex gap-1">
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms" />
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms" />
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms" />
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-3 bg-white border-t border-gray-200 flex-shrink-0">
          <form @submit.prevent="sendMessage" class="flex gap-2">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Skriv ett meddelande..."
              class="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-core-red/50"
              :disabled="isLoading"
            />
            <button
              type="submit"
              :disabled="!newMessage.trim() || isLoading"
              class="w-10 h-10 bg-core-red text-white rounded-full flex items-center justify-center hover:bg-core-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.writing-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease;
}

.slide-in-enter-from,
.slide-in-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: all 0.3s ease;
}

.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
}
</style>
