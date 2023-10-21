"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { setActiveComponent } from "../../../lib/redux/slices/pageSlice";

import Link from "next/link";
import {
  RxGear,
  RxMixerVertical,
  RxCodesandboxLogo,
  RxDashboard,
  RxPerson,
  RxRulerHorizontal,
  RxShuffle,
} from "react-icons/rx";
import { MdSensors } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

const Sidebar = () => {

  const dispatch = useDispatch();

  const handleComponentChange = (componentName:string) => {
    dispatch(setActiveComponent(componentName));
  };

    return (
    <div className="flex">
      <div className="fixed w-20 h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between">
        <div className="flex flex-col items-center">
          <Link href="/">
            <div className="bg-blue-500 text-white p-3 rounded-lg inline-block">
              <RxCodesandboxLogo size={20} />
            </div>
          </Link>
          <span className="border-b-[2px] border-blue-300 w-full p-2"></span>
          <Link href="/">
            <div className="bg-gray-500 hover:bg-blue-500 text-white my-4 p-3 rounded-lg inline-block">
              <RxDashboard size={20} onClick={() => handleComponentChange("Daschboard")}/>
            </div>
          </Link>
          <Link href="/">
            <div className="bg-gray-500 hover:bg-blue-500 text-white my-4 p-3 rounded-lg inline-block">
              <RxRulerHorizontal size={20} />
            </div>
          </Link>
          <Link href="/">
            <div className="bg-gray-500 hover:bg-blue-500 text-white my-4 p-3 rounded-lg inline-block">
              <MdSensors size={20} onClick={() => handleComponentChange("Sensors")}/>
            </div>
          </Link>
          <Link href="/">
            <div className="bg-gray-500 hover:bg-blue-500 text-white my-4 p-3 rounded-lg inline-block">
              <RxMixerVertical size={20} />
            </div>
          </Link>
          <Link href="/">
            <div className="bg-gray-500 hover:bg-blue-500 text-white my-4 p-3 rounded-lg inline-block"
            >
              <RxGear size={20} onClick={() => handleComponentChange("Machines")}/>
            </div>
          </Link>
          <Link href="/">
            <div className="bg-gray-500 hover:bg-blue-500 text-white my-4 p-3 rounded-lg inline-block">
              <RxPerson size={20} onClick={() => handleComponentChange("Profile")}/>
            </div>
          </Link>
        </div>
        <div>
          <Link href="/">
            <div className="bg-gray-500 hover:bg-blue-500 text-white my-4 p-3 rounded-lg inline-block">
              <FiLogOut size={20} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
