export type MetaResponse = {
  ogLogo: string | null;
  twitterSite: string | null;
  ogDescription: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  ogTitle: string | null;
  ogImage?: {
    url: string | null;
    width: number | null;
    height: number | null;
    type: string | null;
  };
  twitterImage?: {
    url: string | null;
    width: number | null;
    height: number | null;
    alt: string | null;
  };
  ogUrl: string | null;
  requestUrl: string | null;
  success: boolean;
  domain: string;
  fullUrl: string | null;
  image: string | null;
};

export default defineEventHandler(async (event) => {
  const { uri } = getQuery(event);

  const res = await $fetch(
    `https://www.opengraph.xyz/api/metadata/${encodeURIComponent(uri)}`,
    {
      referrer: `https://www.opengraph.xyz/url/${encodeURIComponent(uri)}`,
    },
  );

  if (!(res as any)?.metadata) {
    sendError(
      event,
      createError({
        fatal: true,
        message: "Bad response from opengraph",
        statusCode: 500,
      }),
    );
  }

  return (res as any).metadata as MetaResponse;
});
