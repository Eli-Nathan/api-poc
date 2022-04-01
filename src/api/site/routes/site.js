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
      middlewares: ["populate-sites"],
    },
    {
      method: "GET",
      path: "/sites/:id",
      handler: "site.findOne",
      middlewares: ["populate-site"],
    },
  ],
};
