"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function NavBar() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/");
  };

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <button
          onClick={() => router.push("/machines")}
          className="text-white hover:underline"
        >
          Machines
        </button>
        <button
          onClick={() => router.push("/monitoring-points")}
          className="text-white hover:underline"
        >
          Monitoring Points
        </button>
        <button
          onClick={() => router.push("/sensors")}
          className="text-white hover:underline"
        >
          Sensors
        </button>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}
