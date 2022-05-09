const axios = require("axios");

module.exports = (plugin) => {
  plugin.policies["isAuthed"] = async (ctx, config, { strapi }) => {
    if (ctx.state.user) {
      // request is already authenticated in a different way
      return true;
    }

    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      try {
        const token = ctx.request.header.authorization.replace("Bearer ", "");
        const userData = await authAdmin.getAuth().verifyIdToken(token);

        const nomadUser = await strapi.db
          .query(`api::auth-user.auth-user`)
          .findOne({
            where: {
              user_id: userData.sub,
            },
            populate: {
              role: true,
            },
          });

        if (nomadUser) {
          ctx.state.user = nomadUser;
          ctx.state.user.sub = userData.sub;
          return true;
        }

        if (userData) {
          ctx.state.user = userData;
          return true;
        }
        return false;
      } catch (error) {
        return ctx.unauthorized(error);
      }
    }

    // Execute the action.
    return false;
  };
  return plugin;
};
