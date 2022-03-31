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

export const rejectRequest = async (type, id) => {
  try {
    const data = await request(`/${pluginId}/update/${type}/${id}`, {
      method: "GET",
    });
    return data;
  } catch (error) {
    return null;
  }
};

export const approveRequest = async (type, id) => {
  try {
    const data = await request(`/${pluginId}/approve-${type}/${id}`, {
      method: "GET",
    });
    return data;
  } catch (error) {
    return null;
  }
};
