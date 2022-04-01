module.exports = async ({ strapi, subject, address, text, html }) => {
  await strapi.plugins["email"].services.email.send({
    to: address,
    from: "ely.nathan93@gmail.com",
    replyTo: "ely.nathan93@gmail.com",
    subject: subject,
    text,
    html,
  });
};
