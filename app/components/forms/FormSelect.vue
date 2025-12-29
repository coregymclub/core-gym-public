<script setup lang="ts">
interface Option {
  value: string
  label: string
  disabled?: boolean
}

interface Props {
  modelValue: string
  options: Option[]
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  placeholder: 'Välj...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': []
}>()

const inputId = computed(() => `select-${Math.random().toString(36).slice(2, 9)}`)
</script>

<template>
  <div class="form-field">
    <label
      v-if="label"
      :for="inputId"
      class="block text-label text-on-surface mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-brand ml-0.5">*</span>
    </label>
    <div class="relative">
      <select
        :id="inputId"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        class="form-select"
        :class="{
          'form-select--error': error,
          'form-select--disabled': disabled,
          'form-select--placeholder': !modelValue
        }"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        @blur="emit('blur')"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
        <svg class="h-4 w-4 text-on-surface-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    <p v-if="error" class="mt-1.5 text-label text-brand">{{ error }}</p>
  </div>
</template>

<style scoped>
.form-select {
  @apply w-full px-4 py-3 pr-10 bg-surface border border-outline rounded-xl
         text-on-surface appearance-none cursor-pointer
         focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand
         transition-all duration-200;
}

.form-select--placeholder {
  @apply text-on-surface-dim;
}

.form-select--error {
  @apply border-brand focus:ring-brand/30;
}

.form-select--disabled {
  @apply bg-surface-dim text-on-surface-dim cursor-not-allowed;
}
</style>
