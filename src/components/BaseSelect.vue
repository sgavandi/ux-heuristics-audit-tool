<script setup>
/**
 * BaseSelect — labelled native <select>.
 *
 * Uses the native element for maximum accessibility (screen readers,
 * keyboard, mobile picker sheets) and layers our styling on top —
 * including a custom Phosphor chevron.
 *
 *   options: [{ value, label, disabled? }, ...]
 */
import { computed, useId } from 'vue'
import { PhCaretDown } from '@phosphor-icons/vue'

const props = defineProps({
  modelValue: { type: [String, Number, null], default: '' },
  label: { type: String, required: true },
  options: {
    type: Array,
    required: true,
    validator: (arr) =>
      arr.every((o) => typeof o === 'object' && 'value' in o && 'label' in o),
  },
  placeholder: { type: String, default: '' },
  helper: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  hideLabel: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const uid = useId()
const selectId = computed(() => `select-${uid}`)
const helperId = computed(() => `helper-${uid}`)
const errorId = computed(() => `error-${uid}`)

const describedBy = computed(() => {
  if (props.error) return errorId.value
  if (props.helper) return helperId.value
  return undefined
})

const onChange = (e) => emit('update:modelValue', e.target.value)
</script>

<template>
  <div
    class="field"
    :class="{ 'field--error': !!error, 'field--disabled': disabled }"
  >
    <label
      :for="selectId"
      class="field__label"
      :class="{ 'sr-only': hideLabel }"
    >
      {{ label }}<span v-if="required" aria-hidden="true" class="field__req">*</span>
    </label>
    <div class="field__control">
      <select
        :id="selectId"
        class="field__select"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!!error || undefined"
        :aria-describedby="describedBy"
        @change="onChange"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
          :disabled="opt.disabled"
        >
          {{ opt.label }}
        </option>
      </select>
      <span class="field__caret" aria-hidden="true">
        <PhCaretDown :size="16" weight="bold" />
      </span>
    </div>
    <p v-if="error" :id="errorId" class="field__msg field__msg--error" role="alert">
      {{ error }}
    </p>
    <p v-else-if="helper" :id="helperId" class="field__msg">
      {{ helper }}
    </p>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.field__label {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.field__req {
  color: var(--color-critical);
  margin-left: 2px;
}

.field__control {
  position: relative;
  display: block;
}

.field__select {
  appearance: none;
  -webkit-appearance: none;

  width: 100%;
  font-family: inherit;
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  background: var(--color-surface-card);
  border: 1.5px solid var(--color-border-subtle);
  border-radius: var(--radius-input);
  padding: 12px calc(var(--space-3) + 24px) 12px var(--space-3);
  min-height: 48px;
  outline: none;

  transition:
    border-color var(--transition-default),
    box-shadow var(--transition-default);
}

.field__select:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--color-accent-end) 40%, var(--color-border-subtle));
}

.field__select:focus-visible {
  border-color: var(--color-accent-end);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent-end) 22%, transparent);
}

.field--error .field__select {
  border-color: var(--color-critical);
}

.field--error .field__select:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-critical) 22%, transparent);
}

.field--disabled .field__select {
  opacity: 0.6;
  cursor: not-allowed;
}

.field__caret {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  pointer-events: none;
}

.field__msg {
  font-size: var(--font-size-meta);
  color: var(--color-text-secondary);
}

.field__msg--error {
  color: var(--color-critical);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
