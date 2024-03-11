export default defineEventHandler(async (event) => {
  const { uri } = getQuery(event);

  if (!uri || typeof uri !== "string") {
    return sendError(
      event,
      createError({
        statusCode: 400,
        message: "Missing valid URI.",
      }),
    );
  }

  return $fetch<Blob>("https://api.screenshotone.com/take", {
    method: "POST",
    responseType: "blob",
    body: {
      access_key: "-H7x_njWHoZ0WA",
      url: uri,
      full_page: false,
      viewport_width: 1728,
      viewport_height: 1117,
      device_scale_factor: 1,
      format: "webp",
      image_quality: 80,
      block_ads: true,
      block_cookie_banners: true,
      block_banners_by_heuristics: false,
      block_trackers: true,
      cache: true,
      cache_ttl: 2592000,
      cache_key: new Date().getTime().toFixed(0),
      timeout: 60,
      delay: 1,
    },
  });
});
