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

  appendHeader(
    event,
    "Cache-Control",
    "max-age=2678400, s-maxage=32140800, stale-if-error=400",
  ); // 1 year
  appendHeader(
    event,
    "CDN-Cache-Control",
    "max-age=2678400, stale-if-error=200",
  ); // 1 month

  return $fetch(uri);
});
