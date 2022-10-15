import axios from "axios";
const customFetchItem = axios.create({
  baseURL: "http://localhost:3000/Products",
});

export default customFetchItem;
