"use client";
import React, { useState } from "react";
import ClassWise from "./classwise";
import SessionWise from "./sessionwise";
import ScholarWise from "./scholarwise";
import StudentIncompleteDetails from "./StudentIncompleteDetails";

const tabs = [
  {
    key: "ClassWise",
    label: "Student Detail Class Wise",
    activeStyle: "bg-gradient-to-r from-green-500 to-green-900 translate-y-[-10px] max-sm:translate-y-[0px]",
    inactiveStyle: "bg-gradient-to-r from-green-200 to-green-300",
  },
  {
    key: "SessionWise",
    label: "Student Detail Session Wise",
    activeStyle: "bg-gradient-to-r from-blue-500 to-blue-900 translate-y-[-10px] max-sm:translate-y-[0px]",
    inactiveStyle: "bg-gradient-to-r from-blue-200 to-blue-300",
  },
  {
    key: "ScholarWise",
    label: "Student Detail Scholar Wise",
    activeStyle: "bg-gradient-to-r from-red-500 to-red-900 translate-y-[-10px] max-sm:translate-y-[0px]",
    inactiveStyle: "bg-gradient-to-r from-red-200 to-red-300",
  },
  {
    key: "StudentIncompleteDetails",
    label: "Student Incomplete Details",
    activeStyle: "bg-gradient-to-r from-yellow-500 to-yellow-900 translate-y-[-10px] max-sm:translate-y-[0px]",
    inactiveStyle: "bg-gradient-to-r from-yellow-200 to-yellow-300",
  },
];

const StudentSection = () => {
  const [activeTab, setActiveTab] = useState("ClassWise");

  const renderTabContent = () => {
    switch (activeTab) {
      case "ClassWise":
        return <ClassWise />;
      case "SessionWise":
        return <SessionWise />;
      case "ScholarWise":
        return <ScholarWise />;
      case "StudentIncompleteDetails":
        return <StudentIncompleteDetails/>
      default: 
        return null;
    }
  };

  return (
    <div className="w-full h-full max-lg:text-[16px] max-lg:mt-2 max-md:mt-16">
      {/* Header/Navbar */}
      <nav className="mb-5 sticky flex gap-3 max-xl:gap-2 max-sm:gap-3 max-sm:flex-wrap max-sm:justify-center max-lg:gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 max-xl:py-1 max-xl:px-2 max-xl:text-[14px] max-lg:text-[13px] text-white rounded-2xl shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl ${activeTab === tab.key
              ? tab.activeStyle
              : tab.inactiveStyle
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Student Section */}
      <div className="w-full">{renderTabContent()}</div>
    </div>
  );
};

export default StudentSection;
