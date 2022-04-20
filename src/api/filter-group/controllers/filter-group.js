"use strict";

/**
 *  filter-group controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const utils = require("@strapi/utils");

const { parseMultipartData } = utils;

const populateList = [
  "items",
  "filters",
  "filters.filter",
  "filters.filter.filter",
  "filters.filter.filter.siteType",
  "filters.filter.filter.facility",
];

const sortBy = ["priority"];
const enrichCtx = (ctx) => {
  if (!ctx.query) {
    ctx.query = {};
  }
  const currentPopulateList = ctx.query.populate || [];
  const currentSort = ctx.query.sort || [];
  ctx.query.populate = [...populateList, ...currentPopulateList];
  ctx.query.sort = [...sortBy, ...currentSort];
  return ctx;
};

module.exports = createCoreController(
  "api::filter-group.filter-group",
  ({ strapi }) => ({
    // find method
    async find(ctx) {
      const enrichedcCtx = enrichCtx(ctx);
      const filterGroups = await super.find(ctx);
      return this.sanitizeOutput(filterGroups, ctx);
    },

    // update method
    async findOne(ctx) {
      const enrichedcCtx = enrichCtx(ctx);
      const filterGroups = await super.findOne(ctx);
      return this.sanitizeOutput(filterGroups, ctx);
    },
  })
);
