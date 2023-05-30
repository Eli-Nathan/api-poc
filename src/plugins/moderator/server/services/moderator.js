"use strict";

const {
  getRejectedMailContent,
  sendEmail,
} = require("../../../../nomad/emails");

module.exports = ({ strapi }) => ({
  async getAdditions() {
    const additions = await strapi.db
      .query("api::addition-request.addition-request")
      .findMany({
        where: {
          $and: [
            {
              status: {
                $not: "rejected",
              },
            },
            {
              status: {
                $not: "complete",
              },
            },
          ],
        },
        populate: {
          owner: true,
        },
      });
    return additions;
  },

  async getEdits() {
    const edits = await strapi.db
      .query("api::edit-request.edit-request")
      .findMany({
        where: {
          $and: [
            {
              status: {
                $not: "rejected",
              },
            },
            {
              status: {
                $not: "complete",
              },
            },
          ],
        },
        populate: {
          owner: true,
          site: true,
        },
      });
    return edits;
  },

  async getComments() {
    const comments = await strapi.db.query("api::comment.comment").findMany({
      where: {
        $and: [
          {
            status: {
              $not: "rejected",
            },
          },
          {
            status: {
              $not: "complete",
            },
          },
        ],
      },
      populate: {
        owner: true,
        site: true,
      },
    });
    return comments;
  },

  async rejectRequest(collection, id) {
    const rejected = await strapi.db
      .query(`api::${collection}.${collection}`)
      .update({
        where: {
          id,
        },
        data: {
          status: "rejected",
        },
        populate: {
          owner: true,
          site: true,
        },
      });
    const { text, html, subject } = getRejectedMailContent(
      collection,
      rejected.title
    );
    await sendEmail({
      strapi,
      subject,
      address: rejected.owner.email,
      text,
      html,
    });
    return rejected;
  },

  async approveAddition(id) {
    const addition = await strapi.db
      .query(`api::addition-request.addition-request`)
      .findOne({
        where: { id },
        populate: {
          owner: true,
          type: true,
          facilities: true,
          sub_types: true,
          images: true,
        },
      });
    const { owner, status, id: _id, ...safeAddition } = addition;
    const approved = await strapi.db.query(`api::site.site`).create({
      data: {
        ...safeAddition,
        added_by: addition.owner.id,
      },
    });
    if (addition.owner) {
      const currentUser = await strapi.db
        .query(`api::auth-user.auth-user`)
        .findOne({
          where: { id: addition.owner.id },
        });

      await strapi.db.query(`api::auth-user.auth-user`).update({
        where: { id: currentUser.id },
        data: {
          score: currentUser.score + 10,
        },
      });
    }
    await strapi.db.query(`api::addition-request.addition-request`).update({
      where: { id: addition.id },
      data: {
        status: "complete",
      },
    });
    return approved;
  },

  async approveComment(id) {
    const comment = await strapi.db.query(`api::comment.comment`).findOne({
      where: { id },
      populate: {
        owner: true,
        type: true,
      },
    });
    await strapi.db.query(`api::comment.comment`).update({
      where: { id: comment.id },
      data: {
        status: "complete",
      },
    });
    if (comment.owner) {
      const currentUser = await strapi.db
        .query(`api::auth-user.auth-user`)
        .findOne({
          where: { id: comment.owner.id },
        });

      await strapi.db.query(`api::auth-user.auth-user`).update({
        where: { id: currentUser.id },
        data: {
          score: currentUser.score + 1,
        },
      });
    }
    return approved;
  },

  async approveEdit(id) {
    const edit = await strapi.db
      .query(`api::edit-request.edit-request`)
      .findOne({
        where: { id },
        populate: {
          owner: true,
          site: true,
          type: true,
          facilities: true,
          sub_types: true,
          images: true,
        },
      });
    console.log("edit.data", edit.data);
    const approved = await strapi.db.query(`api::site.site`).update({
      where: {
        id: edit.site.id,
      },
      data: { images: edit.images, ...edit.data },
    });
    if (edit.owner) {
      const currentUser = await strapi.db
        .query(`api::auth-user.auth-user`)
        .findOne({
          where: { id: edit.owner.id },
        });
      await strapi.db.query(`api::auth-user.auth-user`).update({
        where: { id: currentUser.id },
        data: {
          score: currentUser.score + 5,
        },
      });
    }
    await strapi.db.query(`api::edit-request.edit-request`).update({
      where: { id: edit.id },
      data: {
        status: "complete",
      },
    });
    return approved;
  },
});
