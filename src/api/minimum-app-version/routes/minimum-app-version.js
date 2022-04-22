'use strict';

/**
 * minimum-app-version router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::minimum-app-version.minimum-app-version');
