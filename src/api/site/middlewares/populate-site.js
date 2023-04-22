const populateList = [
  "type",
  "type.remote_icon",
  "type.remote_marker",
  "type",
  "comments",
  "comments.owner",
  "comments.site",
  "owners",
  "facilities",
  "sub_types",
];

const enrichCtx = (ctx) => {
  if (!ctx.query) {
    ctx.query = {};
  }
  const currentPopulateList = ctx.query.populate || [];
  ctx.query.populate = [...currentPopulateList, ...populateList];
  return ctx;
};

module.exports = (config, { strapi }) => {
  return async (context, next) => {
    const newCtx = enrichCtx(context);
    context = newCtx;
    await next();
  };
};
