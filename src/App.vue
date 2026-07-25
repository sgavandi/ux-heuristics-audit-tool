<script setup>
import { PhShieldCheck, PhCheckCircle, PhWarningCircle, PhXCircle } from '@phosphor-icons/vue'
</script>

<template>
  <v-app>
    <v-main>
      <div class="page">
        <header class="page__header">
          <PhShieldCheck :size="40" weight="duotone" color="var(--color-accent-end)" />
          <h1 class="score">87</h1>
          <p class="meta">Overall audit score</p>
        </header>

        <section class="card" aria-label="Design token showcase">
          <h2 class="card__title">Design tokens wired up</h2>
          <p class="card__desc">
            Ambient gradient, white surface, Inter typography, accent gradient
            and severity colors all reference project tokens.
          </p>

          <div class="card card--nested" aria-label="Severity legend">
            <div class="legend">
              <span class="legend__item">
                <PhCheckCircle :size="20" weight="duotone" color="var(--color-pass)" />
                <span>Pass</span>
              </span>
              <span class="legend__item">
                <PhWarningCircle :size="20" weight="duotone" color="var(--color-warning)" />
                <span>Warning</span>
              </span>
              <span class="legend__item">
                <PhXCircle :size="20" weight="duotone" color="var(--color-critical)" />
                <span>Critical</span>
              </span>
            </div>
          </div>

          <div class="progress" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100">
            <div class="progress__fill" style="width: 72%;"></div>
          </div>
          <p class="micro">72% heuristics reviewed</p>

          <v-btn color="primary" block>Start new audit</v-btn>
        </section>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.page {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-5) var(--space-4) calc(var(--space-8) + var(--safe-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.page__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  text-align: center;
}

.score {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.meta {
  font-size: var(--font-size-meta);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.card {
  background: var(--color-surface-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  transition: box-shadow var(--transition-default);
}

.card--nested {
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-card-nested);
  box-shadow: var(--shadow-nested);
  padding: var(--space-3);
  gap: 0;
}

.card__title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.card__desc {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
}

.legend {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.legend__item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.progress {
  height: 8px;
  background: var(--color-border-subtle);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress__fill {
  height: 100%;
  background: var(--gradient-accent);
  border-radius: inherit;
  transition: width var(--transition-default);
}

.micro {
  font-size: var(--font-size-meta);
  color: var(--color-text-tertiary);
}
</style>
