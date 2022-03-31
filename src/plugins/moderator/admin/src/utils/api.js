// ./admin/src/utils/api.js
import { request } from "@strapi/helper-plugin";
import pluginId from "../pluginId";

export const fetchAllRequests = async () => {
  try {
    const data = await request(`/${pluginId}`, {
      method: "GET",
    });
    return data;
  } catch (error) {
    return null;
  }
};
