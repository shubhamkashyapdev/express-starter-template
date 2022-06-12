import axios from 'axios';
const fetcher = (url: string, headers: any) => {
  return axios
    .get(url, {
      headers,
      withCredentials: true,
    })
    .then((res) => res.data);
};

export default fetcher;
