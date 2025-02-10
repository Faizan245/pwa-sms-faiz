import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toWords } from "number-to-words";
import Image from "next/image";
import logo from "../assets/logo_feeReciept.png";

const DepositFeesModal = ({ isOpen, onClose, onDeposit, studentName, scholarNo, grade, session }) => {
    const [error, setError] = useState(null);
    const receiptFetched = useRef(false);
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [otherDescription, setOtherDescription] = useState("");

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const [formData, setFormData] = useState({
        receiptId: "",
        receiptNo: "",
        date: formatDate(new Date()),
        studentName: studentName || "",
        scholarNo: scholarNo || "",
        class: grade || "",
        session: session || "",
        description: "",
        modeOfPay: "",
        totalAmt: "",
        amtInWords: "",
    });

    useEffect(() => {
        const fetchReceiptNo = async () => {
            try {
                const response = await fetch(`/api/Fees/FetchNextReceiptNo`);
                const data = await response.json();
                if (response.ok) {
                    setFormData((prevData) => ({
                        ...prevData,
                        receiptNo: data.nextReceiptNo,
                    }));
                } else {
                    setError(data.error || "Failed to fetch data");
                }
            } catch (err) {
                setError("Network error");
            }
        };

        if (isOpen && !receiptFetched.current) {
            fetchReceiptNo();
            receiptFetched.current = true;
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            receiptFetched.current = false;
        }
    }, [isOpen]);

    useEffect(() => {
        if (session && grade && scholarNo) {
            const receiptID = `${session}_${grade}_${scholarNo}`;
            setFormData((prevData) => ({
                ...prevData,
                receiptId: receiptID,
            }));
        }
    }, [session, grade, scholarNo]);

    useEffect(() => {
        setFormData((prevState) => ({
            ...prevState,
            studentName: studentName || prevState.studentName,
            scholarNo: scholarNo || prevState.scholarNo,
            class: grade || prevState.class,
            session: session || prevState.session,
        }));
    }, [studentName, scholarNo, grade, session]);

    useEffect(() => {
        if (formData.totalAmt) {
            const words = toWords(Number(formData.totalAmt));
            setFormData((prevData) => ({
                ...prevData,
                amtInWords: words,
            }));
        }
    }, [formData.totalAmt]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "description") {
            setIsOtherSelected(value === "Other");
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleOtherDescriptionChange = (e) => {
        setOtherDescription(e.target.value);
        // Do not update formData's description here so that the select value remains "Other"
    };

    const handleDeposit = () => {
        // If description is "Other", override with the value from otherDescription.
        const updatedFormData = { ...formData };
        if (updatedFormData.description === "Other") {
            updatedFormData.description = otherDescription;
        }
        // Exclude studentName from the data submitted.
        const { studentName, ...formDataToSubmit } = updatedFormData;
        onDeposit(formDataToSubmit);
        onClose();
        // Reset form and states.
        setFormData({
            receiptId: "",
            receiptNo: "",
            date: formatDate(new Date()),
            studentName: "",
            scholarNo: "",
            class: "",
            session: "",
            description: "",
            modeOfPay: "",
            totalAmt: "",
            amtInWords: "",
        });
        setIsOtherSelected(false);
        setOtherDescription("");
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
            <div
                className="p-6 max-sm:p-2 max-sm:mx-1 flex flex-col items-center rounded shadow-lg w-full max-w-lg"
                style={{
                    backgroundImage: 'url("/feeRecieptBG1.jpg")',
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }}
            >
                <Image src={logo} className="w-[250px] max-sm:w-[200px]" alt="fee receipt logo" />
                <form>
                    <div className="grid grid-cols-3 gap-4 max-sm:gap-x-0">
                        <div className="flex col-span-2 items-center gap-4">
                            <label className="block text-sm font-medium whitespace-nowrap">Receipt No.</label>
                            <input
                                type="text"
                                name="receiptNo"
                                value={formData.receiptNo}
                                className="w-[120px] bg-transparent"
                                disabled
                            />
                        </div>
                        <div className="flex-row-reverse flex items-center gap-4">
                            <input
                                type="text"
                                name="date"
                                value={formData.date}
                                className="w-[120px] max-sm:w-[80px] bg-transparent"
                                disabled
                            />
                            <label className="block text-sm font-medium whitespace-nowrap">Date :</label>
                        </div>
                        <h2 className="col-span-3 text-center font-semibold text-lg whitespace-nowrap">Student's Information</h2>
                        <div className="col-span-3 flex items-center justify-center gap-2">
                            <label className="block text-sm w-[130px] font-medium whitespace-nowrap">Student Name : </label>
                            <input
                                type="text"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleInputChange}
                                className="w-full bg-transparent"
                                disabled
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="block text-sm font-medium w-[120px] max-sm:w-[120px] whitespace-nowrap">Scholar No. :</label>
                            <input
                                type="text"
                                name="scholarNo"
                                value={formData.scholarNo}
                                onChange={handleInputChange}
                                className="bg-transparent w-full"
                                disabled
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="block text-sm font-medium w-[80px] whitespace-nowrap">Class :</label>
                            <input
                                type="text"
                                name="class"
                                value={formData.class}
                                onChange={handleInputChange}
                                className="bg-transparent w-full"
                                disabled
                            />
                        </div>
                        <div className="flex items-center w-[150px]">
                            <label className="block text-sm font-medium whitespace-nowrap">Session :</label>
                            <input
                                type="text"
                                name="session"
                                value={formData.session}
                                onChange={handleInputChange}
                                className="bg-transparent w-full"
                                disabled
                            />
                        </div>
                        <h2 className="col-span-3 text-center font-semibold text-lg whitespace-nowrap">Fees/Payment Details</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <select
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-1"
                            >
                                <option value="">Select a description</option>
                                <option value="Fees Installment">Fees Installment</option>
                                <option value="Admission Fees">Admission Fees</option>
                                <option value="Exam Form Fees">Exam Form Fees</option>
                                <option value="RTE">RTE</option>
                                <option value="TC Fees">TC Fees</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Mode of Payment</label>
                            <select
                                name="modeOfPay"
                                value={formData.modeOfPay}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-1"
                            >
                                <option value="">Select a mode of payment</option>
                                <option value="Cash">Cash</option>
                                <option value="Online">Online</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Total Amount</label>
                            <input
                                type="number"
                                name="totalAmt"
                                value={formData.totalAmt}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-1"
                            />
                        </div>
                        {isOtherSelected && (
                            <div className="col-span-3">
                                <input
                                    type="text"
                                    name="otherDescription"
                                    value={otherDescription}
                                    onChange={handleOtherDescriptionChange}
                                    className="w-full border rounded px-3 py-1 mt-2"
                                    placeholder="Please Specify Description"
                                    required
                                />
                            </div>
                        )}
                        <div className="col-span-3">
                            <label className="block text-sm font-medium mb-1">Amount in Words</label>
                            <input
                                type="text"
                                name="amtInWords"
                                value={formData.amtInWords}
                                className="w-full border rounded px-3 py-1"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-1 rounded"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="bg-green-500 text-white px-4 py-1 rounded"
                            onClick={handleDeposit}
                        >
                            Deposit
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default DepositFeesModal;