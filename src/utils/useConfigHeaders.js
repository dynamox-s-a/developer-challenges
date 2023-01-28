import { useSelector } from "react-redux";

export default function useConfigHeaders() {
  const user = useSelector((state) => state.users);
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  return config;
}
