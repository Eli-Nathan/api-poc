'use strict';

/**
 * minimum-app-version service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::minimum-app-version.minimum-app-version');
