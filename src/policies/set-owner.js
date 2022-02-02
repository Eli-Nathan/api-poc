module.exports = async (ctx, config, { strapi }) => {
  if (ctx.state.user) {
    if (ctx.is("multipart")) {
      ctx.request.body.data.owner = ctx.state.user.id;
    } else {
      ctx.request.body.owner = ctx.state.user.id;
    }

    return true;
  }

  return false; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
