import { defineNuxtPlugin, useRoute, useRuntimeConfig } from '#app';

export default defineNuxtPlugin(() => {
  const route = useRoute();
  const config = useRuntimeConfig();

  useHead({
    link: [
      {
        rel: 'alternate',
        hreflang: 'en',
        href: `${config.public.siteUrl}${route.path}`,
      },
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: `${config.public.siteUrl}${route.path}`,
      },
    ],
  });
});
