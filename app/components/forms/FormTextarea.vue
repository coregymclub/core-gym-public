<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  rows?: number
  maxlength?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  required: false,
  disabled: false,
  rows: 4,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': []
}>()

const inputId = computed(() => `textarea-${Math.random().toString(36).slice(2, 9)}`)

const charCount = computed(() => props.modelValue?.length || 0)
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
    <textarea
      :id="inputId"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxlength"
      class="form-textarea"
      :class="{ 'form-textarea--error': error, 'form-textarea--disabled': disabled }"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @blur="emit('blur')"
    />
    <div class="flex justify-between mt-1.5">
      <p v-if="error" class="text-label text-brand">{{ error }}</p>
      <span v-else />
      <span
        v-if="maxlength"
        class="text-label text-on-surface-dim"
      >
        {{ charCount }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.form-textarea {
  @apply w-full px-5 py-4 bg-surface-dim border-0 rounded-2xl
         text-on-surface placeholder:text-on-surface-dim resize-none
         focus:outline-none focus:ring-2 focus:ring-brand/30 focus:bg-surface
         transition-all duration-200;
}

.form-textarea--error {
  @apply ring-2 ring-brand/30;
}

.form-textarea--disabled {
  @apply bg-surface-container text-on-surface-dim cursor-not-allowed opacity-60;
}
</style>
