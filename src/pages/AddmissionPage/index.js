"use client";
import React, { useState } from "react";
import AdmissionForm from "./admissionform";
import EditStudentAdmissionDetails from "./EditStudentAdmissionDetails";
import YearWiseData from "./YearWiseData";
import DeletedStudents from "./DeletedStudents";

const AdmissionPage = () => {
  const [activeTab, setActiveTab] = useState("AdmissionForm");

  const tabs = [
    { label: "Admission Form", value: "AdmissionForm", color: "green" },
    { label: "Edit Student's Admission Details", value: "EditAdmission", color: "blue" },
    { label: "Year wise Admission Data", value: "YearwiseList", color: "yellow" },
    { label: "Deleted Students Data", value: "DeletedStudents", color: "red" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "AdmissionForm":
        return <AdmissionForm />;
      case "EditAdmission":
        return <EditStudentAdmissionDetails />;
      case "YearwiseList":
        return <YearWiseData />;
      case "DeletedStudents":
        return <DeletedStudents />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full max-lg:mt-2 max-md:mt-16">
      {/* Header/Navbar */}
      <nav className="mb-5 sticky flex gap-3 max-xl:gap-2 max-sm:gap-3 max-sm:flex-wrap max-sm:justify-center max-lg:gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-5 py-2 max-xl:py-1 max-xl:px-2 text-white max-xl:text-[14px] rounded-xl shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl ${activeTab === tab.value
                ? `bg-gradient-to-r ${tab.color === "yellow"
                  ? "from-yellow-400 to-yellow-600"
                  : `from-${tab.color}-500 to-${tab.color}-900`
                } translate-y-[-10px] max-sm:translate-y-[0px]`
                : `bg-gradient-to-r ${tab.color === "yellow"
                  ? "from-yellow-100 to-yellow-300"
                  : `from-${tab.color}-200 to-${tab.color}-300`
                }`
              }`}
          >
            {tab.label}
          </button>

        ))}
      </nav>

      {/* Tab Content */}
      <div className="w-full">{renderTabContent()}</div>
    </div>
  );
};

export default AdmissionPage;
