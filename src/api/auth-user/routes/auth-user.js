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
      path: "/auth-users/favourites/:id",
      handler: "auth-user.updateFavourites",
      config: {
        policies: ["plugin::users-permissions.isAuthed", "is-user"],
      },
    },
    {
      method: "PUT",
      path: "/auth-users/updateSavedRoutes",
      handler: "auth-user.updateSavedRoutes",
      config: {
        policies: ["plugin::users-permissions.isAuthed", "is-user"],
      },
    },
    {
      method: "PUT",
      path: "/auth-users/edit-profile",
      handler: "auth-user.editProfile",
      config: {
        policies: ["plugin::users-permissions.isAuthed", "is-user"],
      },
    },
    {
      method: "PUT",
      path: "/auth-users/me/verifyEmail",
      handler: "auth-user.verifyEmail",
      config: {
        policies: ["plugin::users-permissions.isAuthed", "is-user"],
      },
    },
  ],
};
