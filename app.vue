<template>
  <Html class="bg-charcoal text-white">
    <Head>
      <!-- https://dev.to/masakudamatsu/favicon-nightmare-how-to-maintain-sanity-3al7 -->
      <Link rel="icon" href="/favicon.ico" sizes="48x48" />
      <Link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
      <Link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <Link rel="manifest" href="/site.webmanifest" />
      <Link rel="mask-icon" href="/safari-pinned-tab.svg" color="#4f46e5" />
      <Meta name="msapplication-TileColor" content="#4f46e5" />
      <Meta name="theme-color" content="#ffffff" />
    </Head>
    <Body>
      <NuxtPage class="min-h-[calc(100dvh)]" />
      <Toasts />
    </Body>
  </Html>
</template>

<style>
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  display: none;
}
</style>
