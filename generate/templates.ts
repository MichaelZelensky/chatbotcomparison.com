import type { PageRecord, Provider, PlanValues } from './types.ts';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeJsString = (value: string): string =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, '\\\'')
    .replace(/\r?\n/g, ' ');

export type CompareGeneratedPayload = {
  summary: string;
  body: string[];
  conclusion: string;
};

export type FeatureGeneratedPayload = {
  body: string[];
};

export const getComparePrompt = (
  page: PageRecord,
  providers: Provider[],
  planValues: PlanValues
): { system: string; user: string } => {
  const refs = page.dataRefs as { providers: [string, string] };
  const a = refs.providers[0];
  const b = refs.providers[1];
  const aData = planValues[a] || {};
  const bData = planValues[b] || {};
  const aMeta = providers.find(provider => provider.slug === a);
  const bMeta = providers.find(provider => provider.slug === b);

  const system =
    'You write SEO-focused comparison copy for a Nuxt 3 page. ' +
    'Return ONLY a compact JSON object with this exact shape: ' +
    '{ "summary": string, "body": string[], "conclusion": string }. ' +
    '"summary": one short paragraph that clearly states this is an "X vs Y comparison". ' +
    '"body": 2-4 paragraphs as an array of plain-text strings, describing differences, pricing, features, and use cases. ' +
    '"conclusion": one paragraph that clearly recommends when to choose each provider. ' +
    'Use only plain text (no HTML, no Markdown). ' +
    'Mention both providers by name several times and stay grounded in the supplied data.';

  const user = JSON.stringify({
    kind: 'compare',
    slug: page.slug,
    title: page.title,
    a: {
      slug: a,
      name: aMeta?.name,
      homepage: aMeta?.homepage,
      plans: aData
    },
    b: {
      slug: b,
      name: bMeta?.name,
      homepage: bMeta?.homepage,
      plans: bData
    }
  });

  return { system, user };
};

export const getFeaturePrompt = (
  page: PageRecord,
  planValues: PlanValues
): { system: string; user: string } => {
  const refs = page.dataRefs as { featureKey: string };
  const matrix = Object.entries(planValues).map(([provider, plans]) => ({
    provider,
    plans
  }));

  const system =
    'You write SEO-focused feature descriptions for a Nuxt 3 page. ' +
    'Return ONLY a compact JSON object with this exact shape: { "body": string[] }. ' +
    '"body": 2-4 paragraphs as an array of plain-text strings, explaining what the feature is, why it matters, and how it affects real-world usage. ' +
    'Use only plain text (no HTML, no Markdown).';

  const user = JSON.stringify({
    kind: 'feature',
    slug: page.slug,
    title: page.title,
    featureKey: refs.featureKey,
    matrix
  });

  return { system, user };
};

export const getCompareScaffold = (
  title: string,
  generated: CompareGeneratedPayload
): string => {
  const pageTitle = `${title} comparison`;
  const summaryHtml = escapeHtml(generated.summary);
  const conclusionHtml = escapeHtml(generated.conclusion);
  const bodyParagraphs = generated.body || [];

  const bodyHtml = bodyParagraphs
    .map(
      paragraph =>
        `      <p class="body-paragraph">\n        ${escapeHtml(paragraph)}\n      </p>`
    )
    .join('\n\n');

  const descriptionJs = escapeJsString(generated.summary);
  const keywordsSource =
    `${pageTitle.toLowerCase()}, chatbot comparison, live chat, ai chatbot, customer support automation`;
  const keywordsJs = escapeJsString(keywordsSource);

  return `<template>
  <div class="comparison-page">
    <h1>${pageTitle}</h1>

    <p class="summary">
      ${summaryHtml}
    </p>

    <div class="body">
${bodyHtml}
    </div>

    <h2>Conclusion</h2>
    <p class="conclusion">
      ${conclusionHtml}
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'content' });
useHead({
  title: '${escapeJsString(pageTitle)}',
  meta: [
    {
      name: 'description',
      content: '${descriptionJs}'
    },
    {
      name: 'keywords',
      content: '${keywordsJs}'
    }
  ]
})
</script>
`;
};

export const getFeatureScaffold = (
  title: string,
  generated: FeatureGeneratedPayload
): string => {
  const pageTitle = `${title} feature overview`;
  const bodyParagraphs = generated.body || [];

  const bodyHtml = bodyParagraphs
    .map(
      paragraph =>
        `      <p class="body-paragraph">\n        ${escapeHtml(paragraph)}\n      </p>`
    )
    .join('\n\n');

  const firstParagraph = bodyParagraphs[0] ?? `Overview of ${title}`;
  const descriptionJs = escapeJsString(firstParagraph);
  const keywordsSource =
    `${title.toLowerCase()} feature, chatbot features, automation, customer support`;
  const keywordsJs = escapeJsString(keywordsSource);

  return `<template>
  <div class="feature-page">
    <h1>${pageTitle}</h1>

    <div class="body">
${bodyHtml}
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'content' });
useHead({
  title: '${escapeJsString(pageTitle)}',
  meta: [
    {
      name: 'description',
      content: '${descriptionJs}'
    },
    {
      name: 'keywords',
      content: '${keywordsJs}'
    }
  ]
})
</script>
`;
};

export const getIndexListScaffold = (
  title: string,
  items: { href: string; label: string }[]
): string =>
  `<template>
  <section>
    <h1>${title}</h1>
    <ul class="mt-4">
      ${items
        .map(
          item => `<li><NuxtLink to="${item.href}">${item.label}</NuxtLink></li>`
        )
        .join('\n      ')}
    </ul>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'content' });
useSeoMeta({ title: '${title}' });
</script>
`;
