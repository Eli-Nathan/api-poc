module.exports = ({ env }) => ({
  upload: {
    provider: "cloudinary",
    providerOptions: {
      cloud_name: "nomad-app-cloud",
      api_key: "363513265654319",
      api_secret: "psASG5ZL26TXDFTzoD01HcueWxA",
    },
    actionOptions: {
      upload: "hnafqp5p",
    },
  },
});
