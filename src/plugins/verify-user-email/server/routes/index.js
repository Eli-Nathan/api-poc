module.exports = [
  {
    method: "GET",
    path: "/unverified-users",
    handler: "verifyer.getUnverifiedUsers",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/update/user/:id",
    handler: "verifyer.verifyUser",
    config: {
      policies: [],
    },
  },
];
