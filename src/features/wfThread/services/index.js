import bookingAPI from "../../../network/bookingAPI";

export const getJobDetailThread = (id) => {
    return bookingAPI.get(`/job-details/${id}`)
}