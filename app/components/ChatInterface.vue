<script setup lang="ts">
// Reusable Chat Interface
// Used in ChatWidget (desktop) and MobileLogoMenu (mobile)

const CHAT_API = 'https://chat.coregym.club'

const props = defineProps<{
  initialMessage?: string
  hideHeader?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// State
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

// Refs
const messagesContainer = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)

// Initialize
onMounted(() => {
  const stored = localStorage.getItem('cgc_visitor_id')
  if (stored) {
    visitorId.value = stored
    loadConversation()
  } else if (props.initialMessage) {
    // If no visitor ID but we have an initial message/intent, start directly
    startConversation()
  }
  
  // Start polling
  startPolling()
})

// Handle input focus for mobile
function handleInputFocus() {
  // Delay scroll to allow keyboard to appear
  setTimeout(() => {
    scrollToBottom()
    // Ensure viewport stays stable on iOS
    if (inputRef.value) {
      inputRef.value.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, 300)
}

// Cleanup
onUnmounted(() => {
  stopPolling()
})

// Start polling
let pollInterval: ReturnType<typeof setInterval> | null = null

function startPolling() {
  if (pollInterval) return
  pollInterval = setInterval(pollForMessages, 3000)
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

// Starta konversation
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

// Ladda konversation
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
      scrollToBottom()
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

// Poll
async function pollForMessages() {
  if (!visitorId.value) return

  try {
    const lastMsg = messages.value[messages.value.length - 1]
    const lastTimestamp = lastMsg ? lastMsg.timestamp : ''

    const res = await fetch(`${CHAT_API}/api/messages?visitorId=${visitorId.value}&since=${lastTimestamp}`)
    const data = await res.json()

    if (data.messages && data.messages.length > 0) {
      let newMessagesFound = false
      for (const msg of data.messages) {
        if (!messages.value.find(m => m.id === msg.id)) {
          messages.value.push(msg)
          newMessagesFound = true
        }
      }
      if (newMessagesFound) scrollToBottom()
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
</script>

<template>
  <div class="chat-container flex flex-col h-full">
    <!-- Header (Optional - for standalone use) -->
    <div v-if="!hideHeader" class="chat-header flex items-center justify-between flex-shrink-0">
      <h3 class="font-display font-bold text-lg tracking-tight text-on-surface">CHAT</h3>
      
      <button 
        @click="emit('close')"
        class="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-black/5 text-on-surface-dim hover:text-on-surface transition-all active:scale-95"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Messages Area with hand-drawn bubble background -->
    <div
      ref="messagesContainer"
      class="messages-area flex-1 overflow-y-auto"
    >
      <!-- Welcome/Empty state with background bubble -->
      <div v-if="messages.length === 0" class="empty-state">
        <img 
          src="/images/chat-bubbles/stor-grå-bubbla-bakgrund.webp" 
          alt="" 
          class="bubble-bg"
        />
      </div>

      <!-- Messages -->
      <div v-else class="messages-list">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="message-wrapper"
          :class="msg.from === 'visitor' ? 'is-visitor' : 'is-staff'"
        >
          <div class="message-bubble">
            <p v-if="msg.from === 'staff' && msg.staffName" class="staff-name">
              {{ msg.staffName }}
            </p>
            <p class="message-text">{{ msg.text }}</p>
          </div>
          <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
        </div>

        <!-- Typing indicator -->
        <div v-if="status === 'waiting'" class="message-wrapper is-staff">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area - M3 Expressive style -->
    <div class="input-area flex-shrink-0">
      <form @submit.prevent="sendMessage" class="input-form">
        <div class="input-wrapper">
          <textarea
            ref="inputRef"
            v-model="newMessage"
            placeholder="Skriv ett meddelande..."
            class="message-input"
            rows="1"
            enterkeyhint="send"
            autocomplete="off"
            autocorrect="on"
            autocapitalize="sentences"
            :disabled="isLoading"
            @keydown.enter.exact.prevent="sendMessage"
            @focus="handleInputFocus"
          />
        </div>
        <button
          type="submit"
          :disabled="!newMessage.trim() || isLoading"
          class="send-button"
          :class="{ 'is-active': newMessage.trim() }"
        >
          <!-- Simple upward arrow -->
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* M3 Expressive Chat Container */
.chat-container {
  background: linear-gradient(180deg, #f8f9fa 0%, #f0f2f5 100%);
  /* Prevent iOS keyboard issues */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* Header */
.chat-header {
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

/* Messages Area */
.messages-area {
  padding: 1rem;
  position: relative;
}

/* Empty state with bubble background */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 2rem;
}

.bubble-bg {
  width: 100%;
  max-width: 300px;
  height: auto;
}

/* Messages List */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1rem;
}

/* Message wrapper */
.message-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 85%;
}

.message-wrapper.is-visitor {
  align-self: flex-end;
  align-items: flex-end;
}

.message-wrapper.is-staff {
  align-self: flex-start;
  align-items: flex-start;
}

/* Message bubble - M3 soft shapes */
.message-bubble {
  padding: 0.875rem 1.125rem;
  border-radius: 1.25rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.is-visitor .message-bubble {
  background: linear-gradient(135deg, var(--color-brand) 0%, #c41e3a 100%);
  color: white;
  border-bottom-right-radius: 0.375rem;
}

.is-staff .message-bubble {
  background: white;
  color: var(--color-on-surface);
  border-bottom-left-radius: 0.375rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.staff-name {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.message-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.message-time {
  font-size: 0.625rem;
  color: var(--color-on-surface-dim);
  opacity: 0.5;
  margin-top: 0.25rem;
  padding: 0 0.25rem;
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  gap: 0.375rem;
  padding: 1rem 1.25rem;
  background: white;
  border-radius: 1.25rem;
  border-bottom-left-radius: 0.375rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.typing-indicator span {
  width: 0.5rem;
  height: 0.5rem;
  background: var(--color-on-surface-dim);
  opacity: 0.3;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.3;
  }
  30% {
    transform: translateY(-0.375rem);
    opacity: 0.6;
  }
}

/* Input Area - M3 Expressive */
.input-area {
  padding: 0.75rem 1rem;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  /* Prevent layout shift on focus */
  position: relative;
  z-index: 10;
}

.input-form {
  display: flex;
  align-items: flex-end;
  gap: 0.625rem;
}

.input-wrapper {
  flex: 1;
  position: relative;
}

.message-input {
  width: 100%;
  padding: 0.875rem 1.125rem;
  background: #f5f6f8;
  border: none;
  border-radius: 1.5rem;
  font-size: 16px; /* Prevents iOS zoom */
  line-height: 1.4;
  resize: none;
  max-height: 7rem;
  min-height: 48px;
  transition: background 0.2s ease, box-shadow 0.2s ease;
  color: var(--color-on-surface);
  /* Better touch behavior */
  -webkit-appearance: none;
  appearance: none;
  touch-action: manipulation;
}

.message-input::placeholder {
  color: var(--color-on-surface-dim);
  opacity: 0.6;
}

.message-input:focus {
  outline: none;
  background: #f0f1f3;
  box-shadow: 0 0 0 2px rgba(209, 52, 71, 0.1);
}

/* Send button - simple and clean */
.send-button {
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e8e9eb;
  color: #9ca3af;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-button.is-active {
  background: var(--color-brand);
  color: white;
  box-shadow: 0 4px 12px rgba(209, 52, 71, 0.25);
}

.send-button.is-active:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(209, 52, 71, 0.3);
}

.send-button.is-active:active {
  transform: scale(0.95);
}
</style>
