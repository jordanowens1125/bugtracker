
import axios from "axios";
const baseURL = process.env.REACT_APP_BASELINE_URL + "aggregate";

export const getAll = async () =>
  await axios.get(baseURL).then((response) => {
    return response.data;
  });
