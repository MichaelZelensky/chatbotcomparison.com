<template>
  <section>
    <h1 class="title">Chatbot Comparison</h1>

    <div v-if="planColumns.length && featureGroups.length" class="table-wrap">
      <table class="compare" aria-describedby="tableDescription">
        <caption id="tableDescription" class="sr-only">Feature comparison of chatbot providers and plans</caption>

        <thead>
          <tr>
            <th scope="col">Feature</th>
            <th v-for="col in planColumns" :key="col.key" scope="col">
              <div class="col-heading">
                <div class="text-xs opacity-70">{{ col.providerName }}</div>
                <div>{{ col.planName }}</div>
              </div>
            </th>
          </tr>
        </thead>

        <tbody v-for="grp in featureGroups" :key="grp.id">
          <!-- Group header now has scores aligned in the same row -->
          <tr class="group-row">
            <th scope="row" class="p-0">
              <button
                class="group-toggle"
                :aria-expanded="expandedByGroupId[grp.id] ? 'true' : 'false'"
                @click="toggleExpanded(grp.id)"
              >
                <svg class="chev" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 12 4-4-4-4"/>
                </svg>
                <span class="group-title">{{ grp.label }}</span>
              </button>
            </th>

            <!-- Per-column scores (aligned with headers) -->
            <td
              v-for="col in planColumns"
              :key="`${grp.id}-${col.key}-score`"
              class="score-cell"
              :title="`${scoreForGroupAndColumn(grp, col)}/${rowsOf(grp).length}`"
            >
              <span class="score-chip">
                {{ scoreForGroupAndColumn(grp, col) }} / {{ rowsOf(grp).length }}
              </span>
            </td>
          </tr>

          <!-- Group rows -->
          <template v-if="expandedByGroupId[grp.id]">
            <tr v-for="row in rowsOf(grp)" :key="`${grp.id}-${row.key}`">
              <th scope="row" class="row-heading">{{ row.label }}</th>
              <td v-for="col in planColumns" :key="`${col.key}-${row.key}`">
                <template v-if="row.type === 'boolean'">
                  <span class="bool" :class="booleanCell(col, row) ? 'yes' : 'no'">
                    <svg v-if="booleanCell(col, row)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M20.285 6.709a1 1 0 0 1 0 1.414l-9.192 9.192a1 1 0 0 1-1.414 0L3.715 10.55a1 1 0 1 1 1.414-1.414l5.243 5.243 8.485-8.485a1 1 0 0 1 1.428 0Z"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M18.3 5.7a1 1 0 0 1 0 1.4L13.4 12l4.9 4.9a1 1 0 1 1-1.4 1.4L12 13.4l-4.9 4.9a1 1 0 0 1-1.4-1.4L10.6 12 5.7 7.1A1 1 0 0 1 7.1 5.7L12 10.6l4.9-4.9a1 1 0 0 1 1.4 0Z"/>
                    </svg>
                    <span class="sr-only">{{ booleanCell(col, row) ? 'Yes' : 'No' }}</span>
                  </span>
                </template>
                <template v-else>
                  {{ textCell(col, row) ?? '—' }}
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <p v-else class="muted">No data to display. {{ planColumns.length }} {{ featureGroups.length }}</p>
  </section>
</template>

<script setup lang="ts">
import providersJsonModule from '~/data/providers.json'
import featureGroupsJsonModule from '~/data/feature-groups.json'
import planValuesJsonModule from '~/data/plan-values.json'

type FeatureType = 'text' | 'number' | 'boolean'
type FeatureRow = { key: string; label: string; type: FeatureType }
type FeatureGroup = { id: string; label: string; rows?: FeatureRow[] }
type PlanMeta = { name: string; slug: string }
type ProviderMeta = { name: string; slug: string; homepage?: string; plans: PlanMeta[] }
type PlanColumn = { key: string; providerSlug: string; planSlug: string; providerName: string; planName: string }

const unwrapJsonModule = <T>(mod: unknown): T =>
  (mod && typeof mod === 'object' && 'default' in (mod as any))
    ? ((mod as any).default as T)
    : (mod as T)

const providersJson = unwrapJsonModule<ProviderMeta[]>(providersJsonModule)
const featureGroupsJson = unwrapJsonModule<FeatureGroup[]>(featureGroupsJsonModule)
const planValuesJson = unwrapJsonModule<Record<string, Record<string, Record<string, unknown>>>>(planValuesJsonModule)

const asArray = <T>(value: unknown, fallback: T[] = [] as T[]) =>
  Array.isArray(value) ? (value as T[]) : fallback

const toStartCase = (text: string) =>
  text.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').trim().replace(/\s+/g, ' ').replace(/^./, c => c.toUpperCase())

const featureGroups = computed<FeatureGroup[]>(
  () => asArray<FeatureGroup>(featureGroupsJson)
    .filter(g => typeof g?.id === 'string' && g.id.trim().length > 0)
    .map(g => ({ id: g.id.trim(), label: g.label?.trim?.() || toStartCase(g.id), rows: asArray<FeatureRow>(g.rows) }))
)

const planColumns = computed<PlanColumn[]>(
  () => asArray<ProviderMeta>(providersJson)
    .flatMap(provider => asArray<PlanMeta>(provider.plans).map(plan => ({
      key: `${provider.slug}-${plan.slug}`,
      providerSlug: provider.slug,
      planSlug: plan.slug,
      providerName: provider.name,
      planName: plan.name
    })))
)

const expandedByGroupId = reactive<Record<string, boolean>>({})
watchEffect(() => { featureGroups.value.forEach(g => { if (!(g.id in expandedByGroupId)) expandedByGroupId[g.id] = false }) })

const rowsOf = (group: FeatureGroup) => asArray<FeatureRow>(group?.rows)

const rawCellValue = (col: PlanColumn, row: FeatureRow): unknown =>
  planValuesJson?.[col.providerSlug]?.[col.planSlug]?.[row.key]

const booleanCell = (col: PlanColumn, row: FeatureRow): boolean => !!rawCellValue(col, row)

const textCell = (col: PlanColumn, row: FeatureRow): string | number | null => {
  const v = rawCellValue(col, row)
  return v === undefined || v === null || v === '' ? null : (v as any)
}

const scoreForGroupAndColumn = (group: FeatureGroup, col: PlanColumn): number =>
  rowsOf(group).reduce((sum, row) => {
    const v = rawCellValue(col, row)
    return row.type === 'boolean'
      ? (v === true ? sum + 1 : sum)
      : (v !== undefined && v !== null && v !== '' ? sum + 1 : sum)
  }, 0)

const toggleExpanded = (groupId: string) => { expandedByGroupId[groupId] = !expandedByGroupId[groupId] }

useHead({
  script: [{
    type: 'application/ld+json',
    // @ts-expect-error innerHTML is allowed by useHead
    innerHTML: JSON.stringify({ '@context':'https://schema.org', '@type':'WebSite', name:'Chatbot Comparison', url:'https://chatbotcomparison.com' })
  }]
})
</script>

<style scoped lang="scss">
.sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
.muted { color: var(--muted, #475569); }
.col-heading { @apply font-semibold text-slate-900 dark:text-slate-100; }
.row-heading { @apply font-medium text-slate-900 dark:text-slate-100; }
.table-wrap { max-width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; contain:content; }
.compare { width:max-content; min-width:100%; border-collapse:separate; border-spacing:0; }
.compare th, .compare td { @apply p-2; border:1px solid var(--border,#e2e8f0); vertical-align:top; word-break:break-word; overflow-wrap:anywhere; }
.compare thead th:first-child { position:sticky; top:0; left:0; z-index:4; background:var(--card,#f8fafc); }
.compare thead th, .compare thead td { position:sticky; top:0; z-index:3; background:var(--card,#f8fafc); @apply font-semibold; }
.compare tbody th[scope='row'] { position:sticky; left:0; z-index:2; background:var(--card,#f8fafc); box-shadow: inset -8px 0 8px -8px rgba(0,0,0,.08); }

.bool { @apply inline-flex items-center justify-center w-6 h-6 rounded border; border-color: var(--border, #e2e8f0); svg { display:block; } }
.bool.yes { @apply bg-cyan-50 fill-cyan-600; border-color:#bae6fd; }
.bool.no  { @apply bg-rose-50 fill-rose-600; border-color:#fecdd3; }

.group-row th { background: var(--card,#f8fafc); }
.group-toggle { @apply w-full flex items-center gap-2 p-2 text-left select-none; }
.group-title { @apply font-semibold; }
.chev { @apply transition-transform; }
.group-toggle[aria-expanded="true"] .chev { transform: rotate(90deg); }

.score-cell { @apply text-center bg-white dark:bg-zinc-900; }
.score-chip { @apply inline-block text-xs px-2 py-1 rounded border; border-color: var(--border,#e2e8f0); background: var(--bg, #fff); }
</style>
