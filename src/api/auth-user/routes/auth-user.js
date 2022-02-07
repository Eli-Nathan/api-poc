"use strict";

/**
 * auth-user router.
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/auth-users/me",
      handler: "auth-user.findMe",
      config: {
        policies: ["plugin::users-permissions.isAuthed", "is-user"],
      },
    },
    {
      method: "POST",
      path: "/auth-users",
      handler: "auth-user.create",
      config: {
        policies: ["plugin::users-permissions.isAuthed", "set-user"],
      },
    },
    {
      method: "PUT",
      path: "/auth-users/:id",
      handler: "auth-user.update",
      config: {
        policies: ["plugin::users-permissions.isAuthed", "is-user"],
      },
    },
  ],
};
