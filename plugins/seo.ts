export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  nuxtApp.hook('app:rendered', () => {
    // Ensure we always have a canonical URL
    const route = useRoute();
    const canonical = `${config.public.siteUrl}${route.fullPath.split('?')[0]}`;
    useHead({
      link: [{ rel: 'canonical', href: canonical }]
    });
  });
});
