import axios from "axios";

const loginService = (email, password) => {
  return axios.post("http://localhost:3000/api/v1/login", { email, password });
};

export default loginService;
