<script setup>
/**
 * Dev-only Components showcase. Route is only registered when
 * `import.meta.env.DEV` is true, so this never ships in production.
 *
 * Exists solely to exercise every variant + state of the base
 * components so Phase 5 review can verify them in isolation.
 */
import { ref } from 'vue'
import {
  PhArrowRight,
  PhCheckCircle,
  PhWarningCircle,
  PhXCircle,
  PhPencilSimple,
  PhTrash,
} from '@phosphor-icons/vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'

// Reactive state for input demos
const productName = ref('')
const email = ref('user@example.com')
const platform = ref('web')

const platformOptions = [
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'web', label: 'Web' },
  { value: 'desktop', label: 'Desktop' },
]
</script>

<template>
  <section class="showcase" aria-labelledby="showcase-title">
    <header class="showcase__header">
      <p class="showcase__eyebrow">Phase 5 · dev only</p>
      <h1 id="showcase-title" class="showcase__title">Core Components</h1>
    </header>

    <!-- Cards ------------------------------------------------------- -->
    <section aria-labelledby="cards-title" class="group">
      <h2 id="cards-title" class="group__title">Cards</h2>

      <BaseCard padding="md">
        <p class="demo-title">Primary card</p>
        <p class="demo-desc">
          Pure-white surface, 24 px radius, soft ambient shadow.
        </p>
      </BaseCard>

      <BaseCard padding="md">
        <p class="demo-title">Primary card with nested card</p>
        <p class="demo-desc">Nested cards use 16 px radius and a subtle border.</p>
        <BaseCard nested padding="sm" style="margin-top: var(--space-3);">
          <p class="demo-desc">Nested card content.</p>
        </BaseCard>
      </BaseCard>

      <BaseCard padding="md" interactive tag="button" type="button">
        <p class="demo-title">Interactive card (hover me)</p>
        <p class="demo-desc">
          Cards with <code>interactive</code> lift on hover and use the
          accent focus outline on <kbd>Tab</kbd>.
        </p>
      </BaseCard>
    </section>

    <!-- Buttons ----------------------------------------------------- -->
    <section aria-labelledby="buttons-title" class="group">
      <h2 id="buttons-title" class="group__title">Buttons</h2>

      <BaseCard padding="md" class="stack">
        <p class="demo-title">Variants</p>
        <div class="row">
          <BaseButton variant="primary">Primary</BaseButton>
          <BaseButton variant="secondary">Secondary</BaseButton>
          <BaseButton variant="ghost">Ghost</BaseButton>
        </div>

        <p class="demo-title">Sizes</p>
        <div class="row">
          <BaseButton size="sm">Small</BaseButton>
          <BaseButton size="md">Medium</BaseButton>
          <BaseButton size="lg">Large</BaseButton>
        </div>

        <p class="demo-title">States</p>
        <div class="row">
          <BaseButton disabled>Disabled</BaseButton>
          <BaseButton loading>Saving…</BaseButton>
          <BaseButton variant="secondary" disabled>Disabled</BaseButton>
        </div>

        <p class="demo-title">With icons</p>
        <div class="row">
          <BaseButton>
            <template #leading><PhPencilSimple :size="16" weight="bold" /></template>
            Edit audit
          </BaseButton>
          <BaseButton variant="secondary">
            Continue
            <template #trailing><PhArrowRight :size="16" weight="bold" /></template>
          </BaseButton>
          <BaseButton variant="ghost" icon-only aria-label="Delete">
            <PhTrash :size="18" weight="bold" />
          </BaseButton>
        </div>

        <p class="demo-title">Block width</p>
        <BaseButton block variant="primary">Start new audit</BaseButton>
      </BaseCard>
    </section>

    <!-- Form inputs ------------------------------------------------- -->
    <section aria-labelledby="inputs-title" class="group">
      <h2 id="inputs-title" class="group__title">Form inputs</h2>

      <BaseCard padding="md" class="stack">
        <BaseInput
          v-model="productName"
          label="Product name"
          placeholder="e.g. Acme Banking · Mobile"
          helper="The public name of the product under audit."
          required
        />

        <BaseInput
          v-model="email"
          label="Contact email"
          type="email"
          autocomplete="email"
        />

        <BaseInput
          label="Team"
          model-value=""
          helper="This field is disabled in the demo."
          disabled
        />

        <BaseInput
          label="Slug"
          model-value="acme-banking!"
          error="Slugs may only contain letters, numbers and dashes."
        />

        <BaseSelect
          v-model="platform"
          label="Platform"
          :options="platformOptions"
          helper="Choose the platform under evaluation."
          required
        />

        <BaseSelect
          label="Framework"
          model-value=""
          placeholder="Select a framework"
          :options="[
            { value: 'nielsen-10', label: 'Nielsen’s 10 heuristics' },
            { value: 'shneiderman', label: 'Shneiderman’s 8 rules' },
          ]"
          error="A framework is required."
        />
      </BaseCard>
    </section>

    <!-- Icons ------------------------------------------------------- -->
    <section aria-labelledby="icons-title" class="group">
      <h2 id="icons-title" class="group__title">Icons</h2>

      <BaseCard padding="md" class="stack">
        <p class="demo-title">Phosphor outlined at consistent sizes</p>
        <div class="row row--icons">
          <span class="icon-demo">
            <PhCheckCircle :size="20" weight="regular" />
            <span>20 · regular</span>
          </span>
          <span class="icon-demo">
            <PhWarningCircle :size="24" weight="regular" />
            <span>24 · regular</span>
          </span>
          <span class="icon-demo">
            <PhXCircle :size="32" weight="regular" />
            <span>32 · regular</span>
          </span>
        </div>

        <p class="demo-title">Filled reserved for active / selected states</p>
        <div class="row row--icons">
          <span class="icon-demo">
            <PhCheckCircle :size="24" weight="fill" style="color: var(--color-pass);" />
            <span>Pass · fill</span>
          </span>
          <span class="icon-demo">
            <PhWarningCircle :size="24" weight="fill" style="color: var(--color-warning);" />
            <span>Warning · fill</span>
          </span>
          <span class="icon-demo">
            <PhXCircle :size="24" weight="fill" style="color: var(--color-critical);" />
            <span>Critical · fill</span>
          </span>
        </div>
      </BaseCard>
    </section>
  </section>
</template>

<style scoped>
.showcase {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.showcase__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.showcase__eyebrow {
  font-size: var(--font-size-meta);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.showcase__title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: var(--line-height-snug);
}

.group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.group__title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
}

.row--icons {
  gap: var(--space-4);
}

.icon-demo {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-meta);
  color: var(--color-text-secondary);
}

.demo-title {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.demo-desc {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
}

code, kbd {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85em;
  background: var(--color-border-subtle);
  padding: 1px 6px;
  border-radius: var(--radius-xs);
}
</style>
