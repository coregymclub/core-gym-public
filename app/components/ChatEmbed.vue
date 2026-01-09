<script setup lang="ts">
// Inbäddad chat för kontaktsidan
// Samma API som ChatWidget men integrerad i sidans flöde

const CHAT_API = 'https://chat.coregym.club'

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
const messagesContainer = ref<HTMLElement | null>(null)
const hasSentMessage = ref(false)

onMounted(() => {
  if (import.meta.server) return
  const stored = localStorage.getItem('cgc_visitor_id')
  if (stored) {
    visitorId.value = stored
    loadConversation()
  }
})

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

async function loadConversation() {
  if (!visitorId.value) return
  try {
    const res = await fetch(`${CHAT_API}/api/messages?visitorId=${visitorId.value}`)
    const data = await res.json()
    if (data.messages) {
      messages.value = data.messages
      status.value = data.status || 'active'
      if (data.messages.length > 0) hasSentMessage.value = true
    }
  } catch (e) {
    console.error('Failed to load conversation:', e)
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || isLoading.value) return

  if (!visitorId.value) {
    await startConversation()
  }

  isLoading.value = true
  hasSentMessage.value = true
  const text = newMessage.value.trim()
  newMessage.value = ''

  try {
    const res = await fetch(`${CHAT_API}/api/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId: visitorId.value, text })
    })
    const data = await res.json()

    if (data.success && data.message) {
      messages.value.push(data.message)
      status.value = data.status || 'waiting'
      scrollToBottom()
      startPolling()
    }
  } catch (e) {
    console.error('Failed to send message:', e)
    newMessage.value = text
  } finally {
    isLoading.value = false
  }
}

let pollInterval: ReturnType<typeof setInterval> | null = null

function startPolling() {
  if (pollInterval) return
  pollInterval = setInterval(pollForMessages, 3000)
}

async function pollForMessages() {
  if (!visitorId.value) return
  try {
    const res = await fetch(`${CHAT_API}/api/messages?visitorId=${visitorId.value}`)
    const data = await res.json()
    if (data.messages && data.messages.length > messages.value.length) {
      messages.value = data.messages
      scrollToBottom()
    }
    status.value = data.status || status.value
  } catch (e) {}
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
}

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>

<template>
  <div class="bg-surface rounded-3xl border border-outline overflow-hidden">
    <!-- Header -->
    <div class="bg-on-surface text-white px-6 py-4 flex items-center gap-4">
      <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <div>
        <h3 class="font-semibold">Chatta med oss</h3>
        <p class="text-sm text-white/60">
          {{ status === 'waiting' ? 'Vi svarar snart...' : 'Vi svarar oftast inom några minuter' }}
        </p>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span class="text-xs text-white/60">Online</span>
      </div>
    </div>

    <!-- Messages area -->
    <div
      ref="messagesContainer"
      class="h-80 overflow-y-auto p-6 space-y-4 bg-surface-dim"
    >
      <!-- Welcome state -->
      <div v-if="!hasSentMessage && messages.length === 0" class="text-center py-8">
        <div class="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p class="text-on-surface font-medium mb-1">Snabbare än mejl</p>
        <p class="text-on-surface-dim text-sm">Skriv din fråga så svarar vi direkt.</p>
      </div>

      <!-- Message bubbles -->
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="flex"
        :class="msg.from === 'visitor' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-[80%] px-4 py-3 rounded-2xl"
          :class="msg.from === 'visitor'
            ? 'bg-on-surface text-white rounded-br-md'
            : 'bg-surface text-on-surface rounded-bl-md shadow-sm border border-outline'"
        >
          <p v-if="msg.from === 'staff' && msg.staffName" class="text-xs text-on-surface-dim mb-1 font-medium">
            {{ msg.staffName }}
          </p>
          <p class="text-sm whitespace-pre-wrap">{{ msg.text }}</p>
          <p class="text-xs mt-1" :class="msg.from === 'visitor' ? 'text-white/50' : 'text-on-surface-muted'">
            {{ formatTime(msg.timestamp) }}
          </p>
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="status === 'waiting' && messages.length > 0" class="flex justify-start">
        <div class="bg-surface px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-outline">
          <div class="flex gap-1.5">
            <span class="w-2 h-2 bg-on-surface-muted rounded-full animate-bounce" style="animation-delay: 0ms" />
            <span class="w-2 h-2 bg-on-surface-muted rounded-full animate-bounce" style="animation-delay: 150ms" />
            <span class="w-2 h-2 bg-on-surface-muted rounded-full animate-bounce" style="animation-delay: 300ms" />
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="p-4 bg-surface border-t border-outline">
      <form @submit.prevent="sendMessage" class="flex gap-3">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Skriv ditt meddelande..."
          class="flex-1 px-4 py-3 bg-surface-dim border border-outline rounded-xl text-sm focus:outline-none focus:border-brand transition-colors"
          :disabled="isLoading"
        />
        <button
          type="submit"
          :disabled="!newMessage.trim() || isLoading"
          class="btn btn-primary px-6"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>
