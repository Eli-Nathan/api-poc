"use strict";

/**
 * edit-request router.
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/edit-requests",
      handler: "edit-request.find",
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::is-owner"],
      },
    },
    {
      method: "GET",
      path: "/edit-requests/:id",
      handler: "edit-request.findOne",
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::is-owner"],
      },
    },
    {
      method: "POST",
      path: "/edit-requests",
      handler: "edit-request.create",
      config: {
        policies: ["plugin::users-permissions.isAuthed", "global::set-owner"],
      },
    },
  ],
};
