"use client";
import React, { useState } from "react";
import FeesStructure from "./FeesStructure";
import IndividualFees from "./IndividualFees";
import ClassWiseFees from "./ClassWiseFees";
import Accounts from "./Accounts";
import PrintReceipt from "./PrintReceipt";
import DeletedReceipts from "./DeletedReceipts";

const tabs = [
  { id: "FeesStructure", label: "Fees Structure" },
  { id: "IndividualFees", label: "Individual Fees View/Deposit" },
  { id: "ClassWiseFees", label: "View Fees Class Wise" },
  { id: "Accounts", label: "Accounts" },
  { id: "PrintReceipt", label: "Print Receipt" },
  { id: "DeletedReceipts", label: "Deleted Receipts" }
];


const FeesManagement = () => {
  const [activeTab, setActiveTab] = useState("FeesStructure");

  const renderTabContent = () => {
    switch (activeTab) {
      case "FeesStructure":
        return <FeesStructure />;
      case "IndividualFees":
        return <IndividualFees />;
      case "ClassWiseFees":
        return <ClassWiseFees />;
      case "Accounts":
        return <Accounts />;
      case "PrintReceipt":
        return <PrintReceipt />;
        case "DeletedReceipts":
        return <DeletedReceipts/>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-lg:mt-2 max-md:mt-16">
      {/* Header/Navbar */}
      <nav className=" flex gap-2 flex-wrap max-sm:text-[14px] max-lg:text-[12px] max-md:justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 max-xl:px-2 z-0 max-xl:py-1 text-white rounded-2xl shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl ${activeTab === tab.id
              ? "bg-gradient-to-r from-blue-500 to-blue-900 translate-y-[-10px] max-sm:translate-y-0"
              : "bg-gradient-to-r from-blue-200 to-blue-300 "
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="w-full pt-5">{renderTabContent()}</div>
    </div>
  );
};

export default FeesManagement;
