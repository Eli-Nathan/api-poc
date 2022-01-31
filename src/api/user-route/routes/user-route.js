"use strict";

/**
 * user-route router.
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-routes",
      handler: "user-route.find",
    },
    {
      method: "GET",
      path: "/user-routes/public",
      handler: "user-route.findPublic",
    },
    {
      method: "GET",
      path: "/user-routes/:id",
      handler: "user-route.findOne",
    },
    {
      method: "POST",
      path: "/user-routes",
      handler: "user-route.create",
    },
    {
      method: "PUT",
      path: "/user-routes/:id",
      handler: "user-route.update",
    },
    {
      method: "DELETE",
      path: "/user-routes/:id",
      handler: "user-route.delete",
    },
  ],
};
