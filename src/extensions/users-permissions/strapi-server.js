const axios = require("axios");

const auth0domain = process.env.AUTH0_DOMAIN;

module.exports = (plugin) => {
  plugin.policies["isAuthed"] = async (ctx, config, { strapi }) => {
    if (ctx.state.user) {
      // request is already authenticated in a different way
      return true;
    }

    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      try {
        const data = await axios({
          method: "POST",
          url: auth0domain,
          headers: {
            Authorization: ctx.request.header.authorization,
          },
        });

        const userData = data.data;

        const nomadUser = await strapi.db
          .query(`api::auth-user.auth-user`)
          .findOne({
            where: {
              user_id: userData.sub,
            },
          });

        if (nomadUser) {
          ctx.state.user = nomadUser;
          ctx.state.user.sub = userData.sub;
          return { authenticated: true, credentials: nomadUser };
        }

        if (userData) {
          ctx.state.user = userData;
          return { authenticated: true, credentials: userData };
        }
        return { authenticated: false };
      } catch (error) {
        return ctx.unauthorized(error);
      }
    }

    // Execute the action.
    return false;
  };
  return plugin;
};
