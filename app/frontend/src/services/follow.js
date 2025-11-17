import api from "./api";
export const followUser = (targetId) => api.put(`/users/${targetId}/follow`);
export const unfollowUser = (targetId) => api.delete(`/users/${targetId}/follow`);
export const getFollowStatus = async (targetId) => {
    const { data } = await api.get(`/users/${targetId}/follow`);
    return data.following === true;
};
