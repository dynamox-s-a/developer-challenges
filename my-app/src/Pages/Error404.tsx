import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/data')
  }, [])

  return null
};

export default Error404;