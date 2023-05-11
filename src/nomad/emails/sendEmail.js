module.exports = async ({ strapi, subject, address, text, html }) => {
  await strapi.plugins["email"].services.email.send({
    to: address,
    from: "wildway.app@gmail.com",
    replyTo: "wildway.app@gmail.com",
    subject: subject,
    text,
    html,
  });
};
