import axios from "axios";
import * as config from "./../constants/config";

export default function callApi(endpoint, method, body, headers) {
  return axios.request({
    method: method,
    headers: headers,
    url: `${config.API_URL}/${endpoint}`,
    data: body,
  });
}
