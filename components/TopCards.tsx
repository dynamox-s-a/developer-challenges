import React from "react";

const TopCards = () => {
  return (
    // <div className="flex justify-between px-4 pt-4 ml-20 w-100">
    <div className="ml-20 grid lg:grid-cols-5 gap-4 p-4">
      <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full">
          <p className="text-2xl font-bold">texto qualquer</p>
          <p className="text-gray-600">outro texto qualquer</p>
        </div>
        <p className="bg-blue-300 flex justify-center items-center p-2 rounded-lg">
          <span className="text-blue-800 text-lg">+15%</span>
        </p>
      </div>
      <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full">
          <p className="text-2xl font-bold">texto qualquer</p>
          <p className="text-gray-600">outro texto qualquer</p>
        </div>
        <p className="bg-blue-300 flex justify-center items-center p-2 rounded-lg">
          <span className="text-blue-800 text-lg">+12%</span>
        </p>
      </div>
      <div className="bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full">
          <p className="text-2xl font-bold">texto qualquer</p>
          <p className="text-gray-600">outro texto qualquer</p>
        </div>
        <p className="bg-blue-300 flex justify-center items-center p-2 rounded-lg">
          <span className="text-blue-800 text-lg">-9%</span>
        </p>
      </div>
    </div>
  );
};

export default TopCards;
