import axios from "axios";

export const getBlog = async () => await axios(`/api/blog`);
export const deleteBlog = async (id) => await axios.delete(`/api/blog`, {
    data: { id: id }
});