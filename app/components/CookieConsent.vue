<script setup lang="ts">
// Minimal, elegant cookie consent

interface ConsentState {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

const isVisible = ref(false)
const showSettings = ref(false)
const consent = ref<ConsentState>({
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: ''
})

const STORAGE_KEY = 'cgc_cookie_consent'

onMounted(() => {
  if (import.meta.server) return

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as ConsentState
      consent.value = parsed
      applyConsent()
    } catch (_e) {
      isVisible.value = true
    }
  } else {
    setTimeout(() => {
      isVisible.value = true
    }, 2000)
  }
})

function acceptAll() {
  consent.value = {
    necessary: true,
    analytics: true,
    marketing: true,
    timestamp: new Date().toISOString()
  }
  saveAndApply()
}

function acceptNecessary() {
  consent.value = {
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: new Date().toISOString()
  }
  saveAndApply()
}

function savePreferences() {
  consent.value.timestamp = new Date().toISOString()
  saveAndApply()
}

function saveAndApply() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent.value))
  applyConsent()
  isVisible.value = false
  showSettings.value = false
}

function applyConsent() {
  if (import.meta.server) return
  if (consent.value.analytics) loadGoogleAnalytics()
  if (consent.value.marketing) loadFacebookPixel()
}

function loadGoogleAnalytics() {
  // TODO: Add real Google Analytics ID when available
  // const GA_ID = 'G-XXXXXXXXXX'
  // if (typeof window === 'undefined' || (window as any).gtag) return
  // ...
}

function loadFacebookPixel() {
  // TODO: Add real Facebook Pixel ID when available
  // const FB_PIXEL_ID = 'XXXXXXXXXX'
  // Disabled to prevent console errors with placeholder ID
}
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="isVisible" class="cookie-toast">
        <!-- Compact view -->
        <div v-if="!showSettings" class="toast-content">
          <p class="toast-text">
            Vi använder cookies.
            <button @click="showSettings = true" class="toast-link">Anpassa</button>
          </p>
          <div class="toast-actions">
            <button @click="acceptNecessary" class="toast-btn-secondary">
              Endast nödvändiga
            </button>
            <button @click="acceptAll" class="toast-btn-primary">
              OK
            </button>
          </div>
        </div>

        <!-- Settings view -->
        <div v-else class="settings-content">
          <div class="settings-header">
            <span class="settings-title">Cookie-inställningar</span>
            <button @click="showSettings = false" class="settings-close">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="settings-options">
            <label class="setting-row">
              <div>
                <span class="setting-name">Nödvändiga</span>
                <span class="setting-badge">Alltid på</span>
              </div>
              <div class="toggle toggle-on" />
            </label>

            <label class="setting-row">
              <span class="setting-name">Analys</span>
              <button
                @click="consent.analytics = !consent.analytics"
                class="toggle"
                :class="consent.analytics ? 'toggle-on' : 'toggle-off'"
              />
            </label>

            <label class="setting-row">
              <span class="setting-name">Marknadsföring</span>
              <button
                @click="consent.marketing = !consent.marketing"
                class="toggle"
                :class="consent.marketing ? 'toggle-on' : 'toggle-off'"
              />
            </label>
          </div>

          <div class="settings-footer">
            <button @click="acceptNecessary" class="toast-btn-secondary">Avvisa</button>
            <button @click="savePreferences" class="toast-btn-primary">Spara</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cookie-toast {
  position: fixed;
  bottom: 100px; /* Above mobile logo menu */
  left: 50%;
  transform: translateX(-50%);
  z-index: 250; /* Above mobile menu (200) */
  width: calc(100% - 32px);
  max-width: 480px;

  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.08),
    0 12px 48px rgba(0, 0, 0, 0.04);
}

.toast-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
}

.toast-text {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.toast-link {
  color: #333;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 500;
  margin-left: 4px;
}

.toast-link:hover {
  color: #000;
}

.toast-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.toast-btn-primary {
  padding: 8px 20px;
  background: #0c0c0c;
  color: white;
  font-size: 13px;
  font-weight: 600;
  border-radius: 100px;
  transition: all 0.2s;
}

.toast-btn-primary:hover {
  background: #333;
}

.toast-btn-secondary {
  padding: 8px 14px;
  background: transparent;
  color: #666;
  font-size: 13px;
  font-weight: 500;
  border-radius: 100px;
  transition: all 0.2s;
}

.toast-btn-secondary:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

/* Settings view */
.settings-content {
  padding: 16px;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.settings-title {
  font-size: 14px;
  font-weight: 600;
  color: #0c0c0c;
}

.settings-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #999;
  transition: all 0.2s;
}

.settings-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.settings-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 10px;
}

.setting-name {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.setting-badge {
  font-size: 10px;
  font-weight: 500;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
}

.toggle {
  width: 36px;
  height: 20px;
  border-radius: 100px;
  position: relative;
  transition: all 0.2s;
  cursor: pointer;
}

.toggle::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  top: 2px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.toggle-on {
  background: #22c55e;
}

.toggle-on::after {
  left: 18px;
}

.toggle-off {
  background: #d1d5db;
}

.toggle-off::after {
  left: 2px;
}

.settings-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

/* Animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px) scale(0.95);
}

/* Mobile adjustments */
@media (max-width: 480px) {
  .cookie-toast {
    bottom: 16px;
    width: calc(100% - 24px);
  }

  .toast-content {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .toast-text {
    text-align: center;
  }

  .toast-actions {
    justify-content: center;
  }
}
</style>
