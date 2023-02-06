import { request } from "@strapi/helper-plugin";
import pluginId from "../pluginId";

export const fetchAllUsers = async () => {
  try {
    const data = await request(`/${pluginId}/unverified-users`, {
      method: "GET",
    });
    return data;
  } catch (error) {
    return null;
  }
};

export const verifyUserEmail = async (id) => {
  try {
    const data = await request(`/${pluginId}/update/user/${id}`, {
      method: "GET",
    });
    return data;
  } catch (error) {
    return null;
  }
};
