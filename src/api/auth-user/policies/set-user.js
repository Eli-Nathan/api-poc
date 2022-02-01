module.exports = async (ctx, config, { strapi }) => {
  if (ctx.state.user) {
    if (!ctx.request.body) {
      ctx.request.body = {};
    }
    if (!ctx.request.body.data) {
      ctx.request.body.data = {};
    }
    ctx.request.body.data.user_id = ctx.state.user.sub;
    ctx.request.body.data.email = ctx.state.user.email;
    ctx.request.body.data.avatar = ctx.state.user.picture;
    ctx.request.body.data.name =
      ctx.state.user.name ||
      `${ctx.state.user.givenName} ${ctx.state.user.familyName}`;
    return true;
  }

  return false; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
