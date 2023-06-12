const populateList = ["relevance"];

const enrichCtx = (ctx) => {
  if (!ctx.query) {
    ctx.query = {};
  }
  const currentPopulateList = ctx.query.populate || [];
  ctx.query.populate = [...currentPopulateList, ...populateList];
  if (!ctx.query.pagination) {
    ctx.query.pagination = {};
  }
  ctx.query.pagination = {
    ...ctx.query.pagination,
    pageSize: ctx.query.pagination?.pageSize || 100,
  };
  return ctx;
};

module.exports = (config, { strapi }) => {
  return async (context, next) => {
    const newCtx = enrichCtx(context);
    context = newCtx;
    await next();
  };
};
