<script setup lang="ts">
interface Props {
  modelValue: boolean
  label: string
  required?: boolean
  disabled?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const inputId = computed(() => `checkbox-${Math.random().toString(36).slice(2, 9)}`)
</script>

<template>
  <div class="form-checkbox">
    <label
      :for="inputId"
      class="flex items-start gap-3 cursor-pointer group"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    >
      <div class="relative flex-shrink-0 mt-0.5">
        <input
          :id="inputId"
          type="checkbox"
          :checked="modelValue"
          :required="required"
          :disabled="disabled"
          class="peer sr-only"
          @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        />
        <div
          class="w-5 h-5 border-2 rounded-md transition-all duration-200
                 peer-checked:bg-on-surface peer-checked:border-on-surface
                 peer-focus:ring-2 peer-focus:ring-on-surface/20"
          :class="[
            error ? 'border-brand' : 'border-outline-focus group-hover:border-on-surface-dim'
          ]"
        >
          <svg
            class="w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity"
            :class="{ 'opacity-100': modelValue }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <span class="text-sm text-on-surface leading-relaxed">
        <slot>{{ label }}</slot>
        <span v-if="required" class="text-brand ml-0.5">*</span>
      </span>
    </label>
    <p v-if="error" class="mt-1.5 ml-8 text-sm text-brand">{{ error }}</p>
  </div>
</template>

<style scoped>
.form-checkbox input:checked + div {
  @apply bg-core-red border-core-red;
}

.form-checkbox input:checked + div svg {
  @apply opacity-100;
}
</style>
