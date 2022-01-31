module.exports = async (policyContext, config, { strapi }) => {
  if (policyContext.state.user && policyContext.state.route) {
    const apiName = policyContext.state.route.info.apiName;
    const [controllerName, method] =
      policyContext.state.route.handler.split(".");

    const { id } = policyContext.params;

    const entity = await strapi.db
      .query(`api::${apiName}.${controllerName}`)
      .findMany({
        where: {
          ...(id ? { id } : undefined),
          owner: { $eq: policyContext.state.user.sub },
        },
      });

    if (!policyContext.query) {
      policyContext.query = {};
    }
    if (!policyContext.query.filters) {
      policyContext.query.filters = {};
    }
    policyContext.query.filters.owner = policyContext.state.user.sub;

    if (entity && entity.length > 0) {
      return true;
    }
  }

  return false; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
