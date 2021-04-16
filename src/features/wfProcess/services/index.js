import bookingAPI from "../../../network/bookingAPI";
export const getWfDefDetailFromProcess = (id) => {
    return bookingAPI.get(`/wf-processes/${id}`);
}