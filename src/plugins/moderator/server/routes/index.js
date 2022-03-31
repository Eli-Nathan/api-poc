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
];
