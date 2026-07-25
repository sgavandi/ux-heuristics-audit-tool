<script setup>
/**
 * BaseInput — labelled text input.
 *
 *  - 12 px border radius per the plan and the design brief's input styling.
 *  - Every input has a visible, associated <label> (or an `sr-only`
 *    label if `hideLabel` is true, keeping accessibility intact).
 *  - Focus state uses a 2 px accent ring that meets WCAG 2.2 AA
 *    contrast against the surrounding white card.
 *  - Helper vs error text is exposed via `aria-describedby` /
 *    `aria-invalid`.
 */
import { computed, useId } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, required: true },
  type: {
    type: String,
    default: 'text',
    validator: (v) =>
      ['text', 'email', 'password', 'search', 'tel', 'url', 'number'].includes(v),
  },
  placeholder: { type: String, default: '' },
  helper: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  autocomplete: { type: String, default: 'off' },
  hideLabel: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const uid = useId()
const inputId = computed(() => `input-${uid}`)
const helperId = computed(() => `helper-${uid}`)
const errorId = computed(() => `error-${uid}`)

const describedBy = computed(() => {
  if (props.error) return errorId.value
  if (props.helper) return helperId.value
  return undefined
})

const onInput = (e) => emit('update:modelValue', e.target.value)
</script>

<template>
  <div
    class="field"
    :class="{ 'field--error': !!error, 'field--disabled': disabled }"
  >
    <label
      :for="inputId"
      class="field__label"
      :class="{ 'sr-only': hideLabel }"
    >
      {{ label }}<span v-if="required" aria-hidden="true" class="field__req">*</span>
    </label>
    <input
      :id="inputId"
      class="field__input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :aria-invalid="!!error || undefined"
      :aria-describedby="describedBy"
      @input="onInput"
    />
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

.field__input {
  font-family: inherit;
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  background: var(--color-surface-card);
  border: 1.5px solid var(--color-border-subtle);
  border-radius: var(--radius-input);
  padding: 12px var(--space-3);
  min-height: 48px;
  outline: none;

  transition:
    border-color var(--transition-default),
    box-shadow var(--transition-default);
}

.field__input::placeholder {
  color: var(--color-text-tertiary);
}

.field__input:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--color-accent-end) 40%, var(--color-border-subtle));
}

.field__input:focus-visible {
  border-color: var(--color-accent-end);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent-end) 22%, transparent);
}

.field--error .field__input {
  border-color: var(--color-critical);
}

.field--error .field__input:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-critical) 22%, transparent);
}

.field--disabled .field__input {
  opacity: 0.6;
  cursor: not-allowed;
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
