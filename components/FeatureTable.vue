<template>
  <section>
    <div class="flex items-center justify-between mb-2">
      <h1 class="title">Chatbot Comparison</h1>
    </div>

    <div class="mb-3 flex items-center gap-3">
      <ProviderFilterDropdown
        v-if="providerOptions.length"
        :options="providerOptions"
        v-model="selectedProviderSlugs"
        label="Filter providers"
      />
      <label class="text-sm">Sort:</label>
      <select v-model="sortMode" class="border rounded px-2 py-1 text-sm">
        <option value="default">Price ↑ + Score (default)</option>
        <option value="priceAsc">Price ↑</option>
        <option value="priceDesc">Price ↓</option>
        <option value="scoreAsc">Score ↑</option>
        <option value="scoreDesc">Score ↓</option>
      </select>

      <template v-if="isScoreSort">
        <label class="text-sm">Score group:</label>
        <select v-model="scoreGroupId" class="border rounded px-2 py-1 text-sm">
          <option :value="null">All groups</option>
          <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.label }}</option>
        </select>
      </template>
    </div>

    <div v-if="visibleColumns.length && groups.length" class="table-wrap">
      <table class="compare" aria-describedby="tableDescription">
        <caption id="tableDescription" class="sr-only">
          Feature comparison of chatbot providers and plans
        </caption>

        <thead>
          <tr>
            <th scope="column">Feature</th>
            <th v-for="column in sortedColumns" :key="column.key" scope="column">
              <div class="column-heading">
                <div class="text-xs opacity-70">{{ column.providerName }}</div>
                <div>{{ column.planName }}</div>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr class="total-row">
            <th scope="row" class="group-heading">
              Total score
            </th>
            <td
              v-for="column in sortedColumns"
              :key="column.key + '-total'"
              class="group-cell text-center uppercase tracking-wide text-[color:var(--muted)] text-sm"
              :aria-label="`Total score: ${totalScore(column)}`"
              title="Sum of available boolean features across all groups"
            >
              {{ totalScore(column) }}
            </td>
          </tr>
        </tbody>

        <tbody v-for="(featureGroup, gIdx) in groups" :key="featureGroup.id">
          <tr class="group-row">
            <th
              scope="rowgroup"
              class="group-heading"
              :class="{ 'pt-3': gIdx > 0 }"
            >
              {{ featureGroup.label }}
            </th>

            <td
              v-for="column in sortedColumns"
              :key="column.key + '-group'"
              class="group-cell text-center uppercase tracking-wide text-[color:var(--muted)] text-sm"
              :class="{ 'pt-3': gIdx > 0 }"
              :aria-label="isPricingGroup(featureGroup.id) ? `Pricing group (no score)` : `Score for ${featureGroup.label}: ${groupScore(column, featureGroup.id)}`"
              :title="isPricingGroup(featureGroup.id) ? 'Pricing group (score not shown)' : `Features available in ${featureGroup.label}`"
            >
              <template v-if="!isPricingGroup(featureGroup.id)">
                {{ groupScore(column, featureGroup.id) }}
              </template>
            </td>
          </tr>

          <tr
            v-for="featureRow in featureGroup.rows"
            :key="featureGroup.id + '-' + featureRow.key"
          >
            <th scope="row" class="row-heading">
              <div class="feat">
                <span>{{ featureRow.label }}</span>
                <button
                  class="tip"
                  :aria-label="featureRow.description"
                  :title="featureRow.description"
                >ⓘ</button>
              </div>
            </th>

            <td
              class="text-center text-sm"
              v-for="column in sortedColumns"
              :key="column.key + '-' + featureRow.key"
            >
              <span
                :aria-label="ariaLabel(valueOf(column.providerSlug, column.planSlug, featureRow.key), featureRow.type)"
              >
                {{ formatValue(valueOf(column.providerSlug, column.planSlug, featureRow.key), featureRow.type) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="small">No data to display.</p>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

type FeatureType = 'boolean' | 'text' | 'number';
type FeatureRow = { key: string; label: string; type: FeatureType; description: string };
type FeatureGroup = { id: string; label: string; rows: FeatureRow[] };
type Plan = { name: string; slug: string };
type Provider = { name: string; slug: string; homepage: string; plans: Plan[] };

import groupsJson from '~/data/feature-groups.json';
import providersJson from '~/data/providers.json';
import planValues from '~/data/plan-values.json';

const groups = groupsJson as FeatureGroup[];
const providers = providersJson as Provider[];

const priceGroupIds = new Set<string>(['pricing']);

type Col = {
  key: string;
  providerSlug: string;
  planSlug: string;
  providerName: string;
  planName: string;
};

const allColumns: Col[] = providers.flatMap(p =>
  p.plans.map(pl => ({
    key: `${p.slug}.${pl.slug}`,
    providerSlug: p.slug,
    planSlug: pl.slug,
    providerName: p.name,
    planName: pl.name
  }))
);

const providerOptions = computed(() =>
  providers.map(p => ({ value: p.slug, label: p.name }))
);

const selectedProviderSlugs = ref<string[]>(providers.map(p => p.slug));

const visibleColumns = computed<Col[]>(() =>
  allColumns.filter(c => selectedProviderSlugs.value.includes(c.providerSlug))
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const valueOf = (prov: string, plan: string, featureKey: string) =>
  (planValues as any)?.[prov]?.[plan]?.[featureKey] ?? null;

const isPricingGroup = (groupId: string) => priceGroupIds.has(groupId);

const sortMode = ref<'default' | 'priceAsc' | 'priceDesc' | 'scoreAsc' | 'scoreDesc'>('default');
const isScoreSort = computed(() => sortMode.value === 'scoreAsc' || sortMode.value === 'scoreDesc');
const scoreGroupId = ref<string | null>(null);

const parsePrice = (raw: unknown): number => {
  if (raw == null) return Number.POSITIVE_INFINITY;
  const s = String(raw).trim();
  if (/^custom/i.test(s)) return Number.POSITIVE_INFINITY;
  const m = s.match(/(\d[\d,]*\.?\d*)/);
  if (!m) return Number.POSITIVE_INFINITY;
  const cleaned = m[1].replace(/,/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
};

const priceOf = (col: Col): number => {
  const v = valueOf(col.providerSlug, col.planSlug, 'planPrice');
  return parsePrice(v);
};

const booleanKeysForGroup = (groupId?: string | null): string[] => {
  const targets = groupId ? groups.filter(g => g.id === groupId) : groups;
  return targets.flatMap(g => g.rows.filter(r => r.type === 'boolean').map(r => r.key));
};

const scoreCache = new Map<string, number>();
const computeScore = (col: Col, groupId?: string | null): number => {
  const key = `${col.key}|${groupId ?? 'ALL'}`;
  const cached = scoreCache.get(key);
  if (cached != null) return cached;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pv = (planValues as any)?.[col.providerSlug]?.[col.planSlug] || {};
  const keys = booleanKeysForGroup(groupId ?? null);
  let s = 0;
  for (const k of keys) if (pv[k] === true) s += 1;
  scoreCache.set(key, s);
  return s;
};

const groupScore = (col: Col, groupId: string): number =>
  computeScore(col, groupId);

const totalScore = (col: Col): number =>
  computeScore(col, null);

const sortedColumns = computed<Col[]>(() => {
  const arr = [...visibleColumns.value];

  if (sortMode.value === 'default') {
    arr.sort((a, b) => {
      const pa = priceOf(a);
      const pb = priceOf(b);
      if (pa !== pb) return pa - pb;
      return totalScore(b) - totalScore(a);
    });
    return arr;
  }

  if (sortMode.value === 'priceAsc') {
    arr.sort((a, b) => priceOf(a) - priceOf(b));
  } else if (sortMode.value === 'priceDesc') {
    arr.sort((a, b) => priceOf(b) - priceOf(a));
  } else if (sortMode.value === 'scoreAsc') {
    arr.sort(
      (a, b) => computeScore(a, scoreGroupId.value) - computeScore(b, scoreGroupId.value)
    );
  } else if (sortMode.value === 'scoreDesc') {
    arr.sort(
      (a, b) => computeScore(b, scoreGroupId.value) - computeScore(a, scoreGroupId.value)
    );
  }
  return arr;
});

const getUserLocale = (): string => {
  if (process.client && typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }
  const headers = useRequestHeaders(['accept-language']);
  const al = headers['accept-language'];
  if (al) {
    const first = al.split(',')[0]?.trim();
    if (first) return first;
  }
  return 'en-US';
};

const numberFormatter = new Intl.NumberFormat(getUserLocale(), {
  maximumFractionDigits: 2
});

const toNumber = (v: unknown): number | null => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v.replace(/\s/g, ''));
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const formatValue = (val: unknown, type: FeatureType): string => {
  if (val === null || val === undefined) return '—';
  if (type === 'boolean') return val ? '✓' : '—';
  if (type === 'number') {
    const n = toNumber(val);
    return n === null ? '—' : numberFormatter.format(n);
  }
  return String(val);
};

const ariaLabel = (val: unknown, type: FeatureType): string => {
  if (val === null || val === undefined) return 'Not available';
  if (type === 'boolean') return val ? 'Yes' : 'No';
  if (type === 'number') {
    const n = toNumber(val);
    return n === null ? 'Not available' : numberFormatter.format(n);
  }
  return String(val);
};
</script>

<style scoped lang="scss">
.title { @apply text-lg font-bold mb-4; }
.column-heading { @apply leading-tight; }
.group-row > th {
  @apply text-sm uppercase tracking-wide text-[color:var(--muted)];
  border-bottom: 1px solid var(--border);
}
.row-heading { @apply font-normal text-left; }
.row-heading .feat { @apply flex items-center justify-between; }
.tip {
  @apply inline-flex items-center justify-center text-xs rounded-full border;
  width: 18px; height: 18px; line-height: 1;
  border-color: var(--border); color: var(--muted); background: transparent;
}
.tip:hover { color: var(--fg); }
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
.group-heading {
  @apply font-semibold text-left text-sm uppercase tracking-wide text-[color:var(--muted)] bg-[color:var(--card)];
  border-bottom: 1px solid var(--border);
}
.group-cell {
  @apply bg-[color:var(--card)];
  border-bottom: 1px solid var(--border);
}
.table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--card);
}
.compare {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.compare th, .compare td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}
.compare thead th {
  position: sticky;
  top: 0;
  background: var(--card);
  z-index: 1;
}
.compare th:first-child,
.compare td:first-child {
  min-width: 220px;
}
@media (min-width: 768px) {
  .compare th:first-child,
  .compare td:first-child {
    position: sticky;
    left: 0;
    background: var(--card);
    z-index: 2;
    box-shadow: 1px 0 0 0 var(--border);
  }
}
.small { color: var(--muted); font-size: 0.925rem; }
</style>
