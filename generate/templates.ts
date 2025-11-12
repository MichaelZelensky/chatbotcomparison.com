import { PageRecord, Provider, PlanValues } from './types.ts';

export const getComparePrompt = (page: PageRecord, providers: Provider[], planValues: PlanValues): { system: string; user: string } => {
  const refs = page.dataRefs as { providers: [string, string] };
  const a = refs.providers[0];
  const b = refs.providers[1];
  const aData = planValues[a] || {};
  const bData = planValues[b] || {};
  const aMeta = providers.find(x => x.slug === a);
  const bMeta = providers.find(x => x.slug === b);
  const system = 'You generate Nuxt .vue pages. Output valid Vue SFC only.';
  const user = JSON.stringify({
    kind: 'compare',
    slug: page.slug,
    title: page.title,
    a: { slug: a, name: aMeta?.name, homepage: aMeta?.homepage, plans: aData },
    b: { slug: b, name: bMeta?.name, homepage: bMeta?.homepage, plans: bData }
  });
  return { system, user };
};

export const getFeaturePrompt = (page: PageRecord, planValues: PlanValues): { system: string; user: string } => {
  const refs = page.dataRefs as { featureKey: string };
  const matrix = Object.entries(planValues).map(([provider, plans]) => ({ provider, plans }));
  const system = 'You generate Nuxt .vue pages. Output valid Vue SFC only.';
  const user = JSON.stringify({
    kind: 'feature',
    slug: page.slug,
    title: page.title,
    featureKey: refs.featureKey,
    matrix
  });
  return { system, user };
};

export const getCompareScaffold = (title: string, body: string): string =>
`<template>
  <section class="prose max-w-none">
    <h1>${title}</h1>
    <div class="card mt-4"><div class="small">This page is AI-generated</div></div>
    <div class="mt-6">
      ${body}
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({ title: '${title}' });
</script>
`;

export const getFeatureScaffold = (title: string, body: string): string =>
`<template>
  <section class="prose max-w-none">
    <h1>${title}</h1>
    <div class="card mt-4"><div class="small">This page is AI-generated</div></div>
    <div class="mt-6">
      ${body}
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({ title: '${title}' });
</script>
`;

export const getIndexListScaffold = (title: string, items: { href: string; label: string }[]): string =>
`<template>
  <section class="prose max-w-none">
    <h1>${title}</h1>
    <ul class="mt-4">
      ${items.map(x => `<li><NuxtLink to="${x.href}">${x.label}</NuxtLink></li>`).join('\n      ')}
    </ul>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({ title: '${title}' });
</script>
`;
