"use strict";

/**
 * site router.
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/sites",
      handler: "site.find",
      config: {
        middlewares: ["api::site.populate-sites"],
      },
    },
    {
      method: "GET",
      path: "/sites/:id",
      handler: "site.findOne",
      config: {
        middlewares: ["api::site.populate-site"],
      },
    },
    {
      method: "GET",
      path: "/sites/uid/:uid",
      handler: "site.findOneByUID",
      config: {
        middlewares: ["api::site.populate-site"],
      },
    },
  ],
};
