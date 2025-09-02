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
          <!-- Group header with aligned scores -->
          <tr class="group-row">
            <th scope="row" class="p-0">
              <button
                class="group-toggle"
                :aria-expanded="expandedByGroupId[grp.id] ? 'true' : 'false'"
                @click="toggleExpanded(grp.id)"
              >
                <svg class="chev" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 12 4-4-4-4" />
                </svg>
                <span class="group-title">{{ grp.label }}</span>
              </button>
            </th>
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
              <th scope="row" class="row-heading">
                <div class="row-title">
                  <span class="row-label">{{ row.label }}</span>

                  <!-- Descriptional hint -->
                  <span v-if="row.description" class="hint-wrap">
                    <button
                      class="hint-btn"
                      :aria-describedby="`${grp.id}-${row.key}-desc`"
                      aria-label="Feature description"
                      type="button"
                      @mouseenter="(e) => onHintEnter(e, grp.id, row.key)"
                      @mouseleave="onHintLeave"
                      @focus="(e) => onHintEnter(e, grp.id, row.key)"
                      @blur="onHintLeave"
                    >
                      ⓘ
                    </button>

                    <Teleport to="body">
                      <span
                        :id="`${grp.id}-${row.key}-desc`"
                        class="hint-bubble"
                        role="tooltip"
                        v-show="isHintActive(grp.id, row.key)"
                        :style="hintStyleFor(grp.id, row.key)"
                        @mouseenter="keepHintOpen(grp.id, row.key)"
                        @mouseleave="closeHint"
                      >
                        {{ row.description }}
                      </span>
                    </Teleport>

                  </span>
                </div>
              </th>

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
                  {{ displayTextCell(col, row) }}
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <p v-else class="muted">No data to display.</p>
  </section>
</template>

<script setup lang="ts">
import providersJsonModule from '~/data/providers.json'
import featureGroupsJsonModule from '~/data/feature-groups.json' // make sure filename matches (see data file below)
import planValuesJsonModule from '~/data/plan-values.json'

type FeatureType = 'text' | 'number' | 'boolean'
type FeatureRow = { key: string; label: string; type: FeatureType; description?: string }
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

const featureGroups = computed<FeatureGroup[]>(() =>
  asArray<FeatureGroup>(featureGroupsJson)
    .filter(g => typeof g?.id === 'string' && g.id.trim().length > 0)
    .map(g => ({ id: g.id.trim(), label: g.label?.trim?.() || toStartCase(g.id), rows: asArray<FeatureRow>(g.rows) }))
)

const planColumns = computed<PlanColumn[]>(() =>
  asArray<ProviderMeta>(providersJson)
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

const booleanCell = (col: PlanColumn, row: FeatureRow): boolean => {
  const v = rawCellValue(col, row)
  return v === true || v === 'true'
}

const displayTextCell = (col: PlanColumn, row: FeatureRow): string | number | '—' => {
  const v = rawCellValue(col, row)
  if (v === undefined || v === null) return '—'
  if (typeof v === 'string' && v.trim() === '') return '—'
  return v as any
}

const scoreForGroupAndColumn = (group: FeatureGroup, col: PlanColumn): number =>
  rowsOf(group).reduce((sum, row) => {
    const v = rawCellValue(col, row)
    if (row.type === 'boolean') return (v === true || v === 'true') ? sum + 1 : sum
    return (v !== undefined && v !== null && !(typeof v === 'string' && v.trim() === '')) ? sum + 1 : sum
  }, 0)

const toggleExpanded = (groupId: string) => { expandedByGroupId[groupId] = !expandedByGroupId[groupId] }

/** ---- Hint bubble logic: render to body and position from trigger ---- */
const activeHint = reactive<{ gid: string|null; rkey: string|null; rect?: DOMRect }>({
  gid: null, rkey: null
})

const isHintActive = (gid: string, rkey: string) => activeHint.gid === gid && activeHint.rkey === rkey
const keepHintOpen = (gid: string, rkey: string) => { /* hover bubble keeps it open */ }
const closeHint = () => { activeHint.gid = null; activeHint.rkey = null; activeHint.rect = undefined }

const onHintEnter = (e: MouseEvent, gid: string, rkey: string) => {
  const btn = e.currentTarget as HTMLElement
  activeHint.rect = btn.getBoundingClientRect()
  activeHint.gid = gid
  activeHint.rkey = rkey
}
const onHintLeave = () => {
  // small grace to allow pointer to enter bubble
  setTimeout(() => {
    const el = document.elementFromPoint(window._lastMouseX ?? -1, window._lastMouseY ?? -1)
    if (!el || !(el as HTMLElement).closest('.hint-bubble')) closeHint()
  }, 80)
}

/* track mouse for the grace check (optional but helps) */
window.addEventListener('mousemove', (ev) => {
  ;(window as any)._lastMouseX = ev.clientX
  ;(window as any)._lastMouseY = ev.clientY
})

const hintStyleFor = (gid: string, rkey: string) => {
  if (!isHintActive(gid, rkey) || !activeHint.rect) return {}
  const r = activeHint.rect
  const top = r.bottom + 8 // below the button; change to r.top - 8 for above
  const left = r.left
  const maxWidth = Math.min(420, window.innerWidth - left - 16)
  return {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    maxWidth: `${maxWidth}px`
  } as Record<string, string>
}
</script>

<style scoped lang="scss">
.sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
.muted { color: var(--muted, #475569); }
.col-heading { @apply font-semibold text-slate-900 dark:text-slate-100; }

/* Only horizontal scroll inside the table wrapper; no vertical scroll here */
.table-wrap {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: visible; /* critical: no inner vertical scroll */
  -webkit-overflow-scrolling: touch;
}

/* Let content overflow for tooltips etc. and keep sticky header/first column */
.compare {
  width: max-content;
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: visible;
}
.compare th, .compare td {
  @apply p-2;
  border: 1px solid var(--border,#e2e8f0);
  vertical-align: top;
  word-break: break-word;
  overflow-wrap: anywhere;
  overflow: visible; /* critical for tooltips not being clipped by cells */
}

/* Sticky header + sticky first column */
.compare thead th:first-child { position: sticky; top: 0; left: 0; z-index: 4; background: var(--card,#f8fafc); }
.compare thead th, .compare thead td { position: sticky; top: 0; z-index: 3; background: var(--card,#f8fafc); @apply font-semibold; }
.compare tbody th[scope='row'] { position: sticky; left: 0; z-index: 2; background: var(--card,#f8fafc); box-shadow: inset -8px 0 8px -8px rgba(0,0,0,.08); }

/* Group header row */
.group-row th { background: var(--card,#f8fafc); }
.group-toggle { @apply w-full flex items-center gap-2 p-2 text-left select-none; }
.group-title { @apply font-semibold; }
.chev { @apply transition-transform; }
.group-toggle[aria-expanded="true"] .chev { transform: rotate(90deg); }

.row-heading { @apply font-medium text-slate-900 dark:text-slate-100; }
.row-title { @apply flex items-center gap-2; }
.row-label { @apply leading-5; }

/* Hints (trigger lives in-cell; bubble is teleported to body and positioned by JS) */
.hint-wrap { position: relative; display: inline-flex; align-items: center; }
.hint-btn {
  @apply inline-flex items-center justify-center text-xs leading-none rounded-full border;
  width: 18px; height: 18px;
  border-color: var(--border,#e2e8f0);
  background: var(--bg,#fff);
  color: var(--muted,#475569);
}
.hint-btn:focus { outline: 2px solid rgba(14,165,233,.35); outline-offset: 2px; }
/* bubble is appended to body; styled globally here */
.hint-bubble {
  max-width: 26rem;
  padding: .5rem .625rem;
  border-radius: .5rem;
  border: 1px solid var(--border,#e2e8f0);
  background: var(--bg,#fff);
  color: var(--fg,#0f172a);
  box-shadow: 0 10px 20px rgba(0,0,0,.12);
  z-index: 9999; /* ensure above sticky cells */
}

/* Simple hover handlers for trigger (to compute position) */
.hint-wrap .hint-btn {
  pointer-events: auto;
}
.hint-wrap .hint-btn:hover,
.hint-wrap .hint-btn:focus {
  /* No visual change needed; events handled in script */
}

/* Boolean chips */
.bool { @apply inline-flex items-center justify-center w-6 h-6 rounded border; border-color: var(--border, #e2e8f0); svg { display:block; } }
.bool.yes { @apply bg-cyan-50 fill-cyan-600; border-color:#bae6fd; }
.bool.no  { @apply bg-rose-50 fill-rose-600; border-color:#fecdd3; }

.score-cell { @apply text-center bg-white dark:bg-zinc-900; }
.score-chip { @apply inline-block text-xs px-2 py-1 rounded border; border-color: var(--border,#e2e8f0); background: var(--bg, #fff); }
/* Page-level override: let the document own vertical scroll */
:root body main,
:root body .container {
  overflow-y: visible !important;
}
</style>
