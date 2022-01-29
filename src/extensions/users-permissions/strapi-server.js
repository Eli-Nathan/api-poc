const axios = require("axios");

module.exports = (plugin) => {
  plugin.policies["isAuthed"] = async (ctx, config, { strapi }) => {
    return true;
    let role;
    console.log("IN HERE 1");
    if (ctx.state.user) {
      // request is already authenticated in a different way
      return true;
    }

    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      try {
        const { id } = await plugin.services.jwt({ strapi }).getToken(ctx);
        console.log("id", id);
        if (id === undefined) {
          throw new Error(
            "Invalid token: Token did not contain required fields"
          );
        }

        // fetch authenticated user
        ctx.state.user = await plugin.services.user.fetchAuthenticatedUser(id);
      } catch (err) {
        try {
          console.log("IN HERE!!!!", err);
          const data = await axios({
            method: "POST",
            url: "http://nomadapp.eu.auth0.com/userinfo",
            headers: {
              Authorization: ctx.request.header.authorization,
            },
          });
          ctx.state.user = data.data;

          return true;
        } catch (error) {
          console.log("e", error);
          return handleErrors(
            ctx,
            new Error(
              "Invalid token: Token did not match with Strapi and Auth0"
            ),
            "unauthorized"
          );
        }
        return handleErrors(ctx, err, "unauthorized");
      }

      if (!ctx.state.user) {
        return handleErrors(ctx, "User Not Found", "unauthorized");
      }

      role = ctx.state.user.role;

      if (role.type === "root") {
        return true;
      }

      const store = await strapi.store({
        environment: "",
        type: "plugin",
        name: "users-permissions",
      });

      if (
        _.get(await store.get({ key: "advanced" }), "email_confirmation") &&
        !ctx.state.user.confirmed
      ) {
        return handleErrors(
          ctx,
          "Your account email is not confirmed.",
          "unauthorized"
        );
      }

      if (ctx.state.user.blocked) {
        return handleErrors(
          ctx,
          "Your account has been blocked by the administrator.",
          "unauthorized"
        );
      }
    }

    // Retrieve `public` role.
    if (!role) {
      role = await strapi
        .query("role", "users-permissions")
        .findOne({ type: "public" }, []);
    }

    const route = ctx.request.route;
    const permission = await strapi
      .query("permission", "users-permissions")
      .findOne(
        {
          role: role.id,
          type: route.plugin || "application",
          controller: route.controller,
          action: route.action,
          enabled: true,
        },
        []
      );

    if (!permission) {
      return handleErrors(ctx, undefined, "forbidden");
    }

    // Execute the policies.
    if (permission.policy) {
      return await plugin.config.policies[permission.policy](ctx);
    }

    // Execute the action.
    return true;
  };
  return plugin;
};

const handleErrors = (ctx, err = undefined, type) => {
  throw strapi.errors[type](err);
};
