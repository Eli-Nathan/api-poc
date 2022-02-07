module.exports = async (ctx, config, { strapi }) => {
  if (ctx.state.user) {
    if (!ctx.request.body) {
      ctx.request.body = {};
    }
    if (!ctx.request.body.data) {
      ctx.request.body.data = {};
    }
    const userDetails = ctx.state.user;
    ctx.request.body.data.user_id = userDetails.sub;
    ctx.request.body.data.email = userDetails.email;
    ctx.request.body.data.avatar = userDetails.picture;
    let name;
    if (userDetails.name) {
      name = userDetails.name;
    } else if (userDetails.givenName && userDetails.familyName) {
      name = `${userDetails.givenName} ${userDetails.familyName}`;
    }
    ctx.request.body.data.name = name;
    return true;
  }

  return false; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
