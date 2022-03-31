module.exports = [
  {
    method: "GET",
    path: "/addition-requests",
    handler: "moderator.findAdditions",
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/edit-requests",
    handler: "moderator.findEdits",
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/",
    handler: "moderator.findAll",
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/update/:collection/:id",
    handler: "moderator.reject",
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/approve-addition-request/:id",
    handler: "moderator.approveAddition",
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/approve-edit-request/:id",
    handler: "moderator.approveEdit",
    config: {
      auth: false,
      policies: [],
    },
  },
];
