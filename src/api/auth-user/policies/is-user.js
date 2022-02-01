module.exports = async (policyContext, config, { strapi }) => {
  if (policyContext.state.user && policyContext.state.route) {
    // Get api name
    const apiName = policyContext.state.route.info.apiName;
    // Get controllerName
    const controllerName = policyContext.state.route.handler.split(".")[0];

    // Query db for items with owner as current user (and ID if present in request)
    const entity = await strapi.db.query(`api::auth-user.auth-user`).findMany({
      where: {
        user_id: { $eq: policyContext.state.user.sub },
      },
    });

    if (entity && entity.length > 0) {
      // Ensure there is a filters object to use
      if (!policyContext.params) {
        policyContext.params = {};
      }
      //Set owner as current user
      policyContext.params.id = entity[0].id;
      return true; // Return true (policy allows the request through)
    }
  }

  return false; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
