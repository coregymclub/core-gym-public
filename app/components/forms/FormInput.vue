<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'time'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': []
}>()

const inputId = computed(() => `input-${Math.random().toString(36).slice(2, 9)}`)
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
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :autocomplete="autocomplete"
      class="form-input"
      :class="{ 'form-input--error': error, 'form-input--disabled': disabled }"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur')"
    />
    <p v-if="error" class="mt-1.5 text-label text-brand">{{ error }}</p>
  </div>
</template>

<style scoped>
.form-input {
  @apply w-full px-5 py-4 bg-surface-dim border-0 rounded-2xl
         text-on-surface placeholder:text-on-surface-dim
         focus:outline-none focus:ring-2 focus:ring-brand/30 focus:bg-surface
         transition-all duration-200;
}

.form-input--error {
  @apply ring-2 ring-brand/30;
}

.form-input--disabled {
  @apply bg-surface-container text-on-surface-dim cursor-not-allowed opacity-60;
}
</style>
