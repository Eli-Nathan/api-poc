module.exports = async (policyContext, config, { strapi }) => {
  if (policyContext.state.user) {
    if (policyContext.state.route) {
      // Get api name
      const apiName = policyContext.state.route.info.apiName;
      // Get controllerName
      const controllerName = policyContext.state.route.handler.split(".")[0];

      // apiName and controllerName name can now be used with string concatenation like api::article.article (see below)

      const { id } = policyContext.params;

      // ID query if search is a findOne, update or delete request
      const idQuery = { ...(id ? { id: { $eq: id } } : undefined) };

      // Query db for items with owner as current user (and ID if present in request)
      const entity = await strapi.db
        .query(`api::${apiName}.${controllerName}`)
        .findMany({
          where: {
            $not: {
              owner: policyContext.state.user.id,
            },
            ...idQuery,
          },
        });
    }
    return true;
  }

  return false; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
