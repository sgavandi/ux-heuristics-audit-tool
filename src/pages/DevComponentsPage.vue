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
import ScoreRing from '@/components/ScoreRing.vue'
import CategoryBar from '@/components/CategoryBar.vue'
import SeverityBadge from '@/components/SeverityBadge.vue'
import SeverityDistribution from '@/components/SeverityDistribution.vue'
import { audits, frameworks } from '@/services/mockData'
import {
  scoreForRatings,
  severityCounts,
  categoryBreakdown,
} from '@/utils/scoring'

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

// -------- Charts demo data (real mock audits + framework) --------
const framework = frameworks[0]
const inProgressAudit = audits.find((a) => a.status === 'in-progress')
const completeAudit = audits.find((a) => a.status === 'complete')
const draftAudit = audits.find((a) => a.status === 'draft')

const inProgressScore = scoreForRatings(inProgressAudit.ratings)
const completeScore = scoreForRatings(completeAudit.ratings)

const completeCounts = severityCounts(completeAudit.ratings)
const inProgressCounts = severityCounts(inProgressAudit.ratings)

const completeBreakdown = categoryBreakdown(completeAudit, framework)
const inProgressBreakdown = categoryBreakdown(inProgressAudit, framework)

// Animate a ring value on mount to visualise the transition.
const animatedScore = ref(0)
setTimeout(() => { animatedScore.value = completeScore }, 150)
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

    <!-- Charts / data viz ------------------------------------------- -->
    <section aria-labelledby="charts-title" class="group">
      <h2 id="charts-title" class="group__title">Charts &amp; data viz</h2>

      <!-- Score rings -->
      <BaseCard padding="md" class="stack">
        <p class="demo-title">Score rings</p>

        <div class="row row--charts">
          <ScoreRing
            :value="animatedScore"
            :size="160"
            label="Overall"
            :sublabel="`${completeAudit.productName} · complete`"
          />
          <ScoreRing
            :value="inProgressScore"
            :size="140"
            label="In progress"
            :sublabel="`${inProgressCounts.total} of ${framework.heuristics.length} rated`"
          />
          <ScoreRing :value="0" :size="120" label="Not started" sublabel="Draft" />
        </div>
        <p class="demo-desc">
          Text summary: “{{ completeAudit.productName }}” scored
          {{ completeScore }} percent overall.
          “{{ inProgressAudit.productName }}” is at
          {{ inProgressScore }} percent with
          {{ inProgressCounts.total }} of {{ framework.heuristics.length }}
          heuristics rated. “{{ draftAudit.productName }}” has not
          started.
        </p>
      </BaseCard>

      <!-- Category bars -->
      <BaseCard padding="md" class="stack">
        <p class="demo-title">Category breakdown · {{ completeAudit.productName }}</p>
        <CategoryBar
          v-for="cat in completeBreakdown"
          :key="cat.category"
          :label="cat.category"
          :value="cat.score"
          :rated-count="cat.ratedCount"
          :meta="`${cat.ratedCount} of ${cat.total} rated`"
        />
      </BaseCard>

      <BaseCard padding="md" class="stack">
        <p class="demo-title">Category breakdown · {{ inProgressAudit.productName }}</p>
        <p class="demo-desc">
          Demonstrates partially-rated and untouched categories.
        </p>
        <CategoryBar
          v-for="cat in inProgressBreakdown"
          :key="cat.category"
          :label="cat.category"
          :value="cat.score"
          :rated-count="cat.ratedCount"
          :meta="cat.ratedCount === 0
            ? '—'
            : `${cat.ratedCount} of ${cat.total} rated`"
        />
      </BaseCard>

      <!-- Severity badges + distribution -->
      <BaseCard padding="md" class="stack">
        <p class="demo-title">Severity indicators</p>
        <div class="row">
          <SeverityBadge severity="pass" />
          <SeverityBadge severity="warning" />
          <SeverityBadge severity="critical" />
          <SeverityBadge severity="pass" size="sm" />
          <SeverityBadge severity="warning" size="sm" />
          <SeverityBadge severity="critical" size="sm" />
        </div>

        <p class="demo-title">Severity distribution · complete audit</p>
        <SeverityDistribution
          :pass="completeCounts.pass"
          :warning="completeCounts.warning"
          :critical="completeCounts.critical"
        />

        <p class="demo-title">Severity distribution · in-progress audit</p>
        <SeverityDistribution
          :pass="inProgressCounts.pass"
          :warning="inProgressCounts.warning"
          :critical="inProgressCounts.critical"
        />

        <p class="demo-title">Severity distribution · empty state</p>
        <SeverityDistribution :pass="0" :warning="0" :critical="0" />
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

.row--charts {
  gap: var(--space-4);
  justify-content: flex-start;
  align-items: flex-end;
  flex-wrap: wrap;
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
