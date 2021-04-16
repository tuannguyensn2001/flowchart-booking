import bookingAPI from "../../../network/bookingAPI";

export const getWfDefDetails = (id) => {
    return bookingAPI.get(`/wf-def-details/${id}`);
}
export const editWfDefDetails = (id,data) => {
    return bookingAPI.put(`/wf-def-details/${id}`,data);
}