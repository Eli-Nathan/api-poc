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
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::is-owner"],
      },
    },
    {
      method: "GET",
      path: "/user-routes/public",
      handler: "user-route.findPublic",
      config: {
        policies: ["plugin::users-permissions.isAuthed"],
      },
    },
    {
      method: "GET",
      path: "/user-routes/:id",
      handler: "user-route.findOne",
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::is-owner"],
      },
    },
    {
      method: "POST",
      path: "/user-routes",
      handler: "user-route.create",
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::set-owner"],
      },
    },
    {
      method: "PUT",
      path: "/user-routes/:id",
      handler: "user-route.update",
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::is-owner"],
      },
    },
    {
      method: "DELETE",
      path: "/user-routes/:id",
      handler: "user-route.delete",
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::is-owner"],
      },
    },
  ],
};
