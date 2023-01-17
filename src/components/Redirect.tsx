import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Redirect = () => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentValue) => currentValue - 1);
    }, 1000);
    count === 0 && navigate("/login");
    return () => clearInterval(interval);
  }, [count, navigate]);
  return (
    <section className="flex items-center justify-center h-screen bg-gray-800">
      <div className=" flex flex-col w-full max-w-lg py-20 gap-8 bg-gray-900 rounded text-center">
        <h1 className="text-gray-400 text-4xl">You are not authenticated</h1>
        <h3 className="font-bold text-white text-2xl">
          Redirecting to login in {count}
        </h3>
      </div>
    </section>
  );
};

export default Redirect;
