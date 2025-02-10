import React, { useRef } from "react";
import Image from "next/image";
import logo from "../assets/logo_feeReciept.png";

const PrintReceiptModal = ({ receiptData }) => {
    // Ensure receiptData is always an object
    const data = receiptData || {};
    // Create a ref to capture the printable area.
    
    const printRef = useRef(null);

    // Function that triggers printing.
    const handlePrint = () => {
        // Add a class to the body to hide non-printable content
        document.body.classList.add("print-mode");

        // Trigger the print dialog
        window.print();

        // Remove the class after printing is done
        setTimeout(() => {
            document.body.classList.remove("print-mode");
        }, 500); // Adjust timeout if necessary
    };

    // Determine if data exists (i.e. any keys exist in receiptData)
    const hasData = receiptData && Object.keys(receiptData).length > 0;

    return (
        <>
            {/* Printable Component */}
            <div
                ref={printRef}
                id="printArea"
                className="p-2 relative w-[68%] max-xl:w-full h-full max-lg:w-[70%] max-sm:w-full flex flex-col items-center rounded shadow-lg"
                style={{
                    backgroundImage: 'url("/feeRecieptBG1.jpg")',
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover"
                }}
            >
                {hasData && (
                    <button
                        onClick={handlePrint}
                        className="no-print absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                        type="button"
                    >
                        Print
                    </button>
                )}

                {/* Print styling via global style */}
                <style jsx global>{`
                    /* Print-specific styles applied only when printing */
                    @media print {
                        /* Hide everything except the print area */
                        body * {
                            visibility: hidden;
                        }
                        /* Ensure print area is visible */
                        #printArea, #printArea * {
                            visibility: visible;
                        }
                        /* Position the print area at the top */
                        #printArea {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 105mm;
                            height: 148mm;
                            background-image: url("/feeRecieptBG1.jpg") !important;
                            background-position: center;
                            background-repeat: no-repeat;
                            background-size: cover;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                            overflow: hidden; /* Prevents content from overflowing */
                        }
                        /* Enforce strict A6 paper size */
                        @page {
                            size: 105mm 148mm; /* A6 portrait */
                            margin: 0;
                        }
                        html, body {
                            margin: 0;
                            padding: 0;
                            width: 105mm;
                            height: 148mm;
                            overflow: hidden; /* Ensures no unwanted content */
                        }
                        /* Hide elements with the no-print class */
                        .no-print {
                            display: none !important;
                        }
                        /* Newly added styles to fix table overflow */
                        table {
                            table-layout: fixed;
                            width: 100% !important;
                        }
                        th, td {
                            word-wrap: break-word;
                            overflow: hidden;
                        }
                    }
                `}</style>

                <div className="w-full h-full flex flex-col justify-between gap-5 text-[15px] p-2">

                    <div>
                        <p className="text-center font-medium text-[14px]">Recognized by Government</p>
                        <Image src={logo} className="mx-auto w-[250px]" alt="fee receipt logo" />
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex justify-between">
                                <p><strong>Receipt No:</strong> {data.receiptNo ?? "_________"}</p>
                                <p><strong>Date:</strong> {data.date ?? "_________"}</p>
                            </div>
                            <h2 className="text-center w-full font-semibold text-lg">Student's Information</h2>
                            <div className="flex justify-between">
                                <p><strong>Student Name:</strong> {data.studentName ?? "_________"}</p>
                                <p><strong>Class:</strong> {data.class ?? data.grade ?? "_________"}</p>
                            </div>
                            <div className="flex justify-between">
                                <p><strong>Scholar No:</strong> {data.scholarNo ?? "_________"}</p>
                                <p><strong>Session:</strong> {data.session ?? "_________"}</p>
                            </div>
                            <h2 className="text-center font-semibold text-lg">Fees/Payment Details</h2>
                            <table className="border-collapse border border-gray-300">
                                <thead>
                                    <tr className="border border-gray-300">
                                        <th className="px-2 max-xl:px-0 border border-gray-300 py-2 font-semibold">Description</th>
                                        <th className="px-2 max-xl:px-0 border border-gray-300 py-2 font-semibold whitespace-nowrap">Mode of Payment</th>
                                        <th className="px-2 max-xl:px-0 border border-gray-300 py-2 font-semibold whitespace-nowrap">Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border border-gray-300">
                                        <td className="px-2 max-xl:px-0 border border-gray-300 py-2 text-center">{data.description ?? "_________"}</td>
                                        <td className="px-2 max-xl:px-0 border border-gray-300 py-2 text-center">{data.modeOfPay ?? "_________"}</td>
                                        <td className="px-2 max-xl:px-0 border border-gray-300 py-2 text-center">₹{data.totalAmt ?? "0.00"}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <p className="flex gap-2">
                                <strong>Amount in Words:</strong> Rupees {data.Amt_Words ?? "_________"}
                            </p>
                        </div>
                    </div>
                    <p className="text-center font-medium text-[14px]">Deposited Amount will not be refundable</p>
                </div>
            </div>
        </>
    );
};

export default PrintReceiptModal;


// import React, { useRef } from "react";
// import Image from "next/image";
// import logo from "../assets/logo_feeReciept.png";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const PrintReceiptModal = ({ receiptData }) => {
//     // Ensure receiptData is always an object
//     const data = receiptData || {};
//     // Create a ref to capture the printable area.
//     const printRef = useRef(null);

//     // Function that triggers printing.
//     const handlePrint = () => {
//         // Add a class to the body to hide non-printable content
//         document.body.classList.add("print-mode");

//         // Trigger the print dialog
//         window.print();

//         // Remove the class after printing is done
//         setTimeout(() => {
//             document.body.classList.remove("print-mode");
//         }, 500); // Adjust timeout if necessary
//     };

//     // Function that generates PDF from receipt and sends it through WhatsApp
//     const handleSendWhatsapp = async () => {
//         const whatsappNo = receiptData?.whatsappNo;
//         if (!whatsappNo) {
//             alert("WhatsApp number not provided");
//             return;
//         }
        
//         const element = printRef.current;
//         if (!element) {
//             alert("Printable area not found");
//             return;
//         }
//         try {
//             // Generate canvas from the printable area
//             const canvas = await html2canvas(element);
//             const imgData = canvas.toDataURL('image/jpeg');
            
//             // Create a jsPDF instance. Using A6 dimensions (105 x 148 mm)
//             const pdf = new jsPDF('p', 'mm', [105,148]);
//             const imgProps = pdf.getImageProperties(imgData);
//             const pdfWidth = pdf.internal.pageSize.getWidth();
//             const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//             // Add the image to the PDF
//             pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            
//             // Output the PDF as a Blob
//             const pdfBlob = pdf.output('blob');
            
//             // Check if the native share API with file support is available
//             if (navigator.canShare && navigator.canShare({files: [new File([pdfBlob], 'receipt.pdf', { type: 'application/pdf' })]})) {
//                 const file = new File([pdfBlob], 'receipt.pdf', { type: 'application/pdf' });
//                 await navigator.share({
//                     files: [file],
//                     title: 'Receipt',
//                     text: 'Please find attached receipt.',
//                 });
//             } else {
//                 // Fallback: open WhatsApp URL with a prefilled message
//                 // Note: Direct PDF attachment via WhatsApp URL is not available.
//                 const text = encodeURIComponent("Please find your receipt attached. Kindly download the PDF from your device.");
//                 window.open(`https://wa.me/${whatsappNo}?text=${text}`, '_blank');
//             }
//         } catch (error) {
//             console.error("Error generating PDF", error);
//             alert("An error occurred while generating the PDF.");
//         }
//     };

//     // Determine if data exists (i.e. any keys exist in receiptData)
//     const hasData = receiptData && Object.keys(receiptData).length > 0;

//     return (
//         <>
//             {/* Printable Component */}
//             <div
//                 ref={printRef}
//                 id="printArea"
//                 className="p-2 relative w-[68%] max-xl:w-full h-full max-lg:w-[70%] max-sm:w-full flex flex-col items-center rounded shadow-lg"
//                 style={{
//                     backgroundImage: 'url("/feeRecieptBG1.jpg")',
//                     backgroundPosition: "center",
//                     backgroundRepeat: "no-repeat",
//                     backgroundSize: "cover"
//                 }}
//             >
//                 {hasData && (
//                     <div className="no-print absolute top-2 right-2 flex gap-2">
//                         <button
//                             onClick={handlePrint}
//                             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
//                             type="button"
//                         >
//                             Print
//                         </button>
//                         <button
//                             onClick={handleSendWhatsapp}
//                             className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
//                             type="button"
//                         >
//                             Send to WhatsApp
//                         </button>
//                     </div>
//                 )}

//                 {/* Print styling via global style */}
//                 <style jsx global>{`
//                     /* Print-specific styles applied only when printing */
//                     @media print {
//                         /* Hide everything except the print area */
//                         body * {
//                             visibility: hidden;
//                         }
//                         /* Ensure print area is visible */
//                         #printArea, #printArea * {
//                             visibility: visible;
//                         }
//                         /* Position the print area at the top */
//                         #printArea {
//                             position: absolute;
//                             left: 0;
//                             top: 0;
//                             width: 105mm;
//                             height: 148mm;
//                             background-image: url("/feeRecieptBG1.jpg") !important;
//                             background-position: center;
//                             background-repeat: no-repeat;
//                             background-size: cover;
//                             -webkit-print-color-adjust: exact;
//                             print-color-adjust: exact;
//                             overflow: hidden; /* Prevents content from overflowing */
//                         }
//                         /* Enforce strict A6 paper size */
//                         @page {
//                             size: 105mm 148mm; /* A6 portrait */
//                             margin: 0;
//                         }
//                         html, body {
//                             margin: 0;
//                             padding: 0;
//                             width: 105mm;
//                             height: 148mm;
//                             overflow: hidden; /* Ensures no unwanted content */
//                         }
//                         /* Hide elements with the no-print class */
//                         .no-print {
//                             display: none !important;
//                         }
//                         /* Newly added styles to fix table overflow */
//                         table {
//                             table-layout: fixed;
//                             width: 100% !important;
//                         }
//                         th, td {
//                             word-wrap: break-word;
//                             overflow: hidden;
//                         }
//                     }
//                 `}</style>

//                 <div className="w-full h-full flex flex-col justify-between gap-5 text-[15px] p-2">
//                     <div>
//                         <p className="text-center font-medium text-[14px]">Recognized by Government</p>
//                         <Image src={logo} className="mx-auto w-[250px]" alt="fee receipt logo" />
//                         <div className="w-full flex flex-col gap-4">
//                             <div className="flex justify-between">
//                                 <p><strong>Receipt No:</strong> {data.receiptNo ?? "_________"}</p>
//                                 <p><strong>Date:</strong> {data.date ?? "_________"}</p>
//                             </div>
//                             <h2 className="text-center w-full font-semibold text-lg">Student's Information</h2>
//                             <div className="flex justify-between">
//                                 <p><strong>Student Name:</strong> {data.studentName ?? "_________"}</p>
//                                 <p><strong>Class:</strong> {data.class ?? data.grade ?? "_________"}</p>
//                             </div>
//                             <div className="flex justify-between">
//                                 <p><strong>Scholar No:</strong> {data.scholarNo ?? "_________"}</p>
//                                 <p><strong>Session:</strong> {data.session ?? "_________"}</p>
//                             </div>
//                             <h2 className="text-center font-semibold text-lg">Fees/Payment Details</h2>
//                             <table className="border-collapse border border-gray-300">
//                                 <thead>
//                                     <tr className="border border-gray-300">
//                                         <th className=" border border-gray-300 py-2 font-semibold">Description</th>
//                                         <th className=" border border-gray-300 py-2 font-semibold whitespace-nowrap">Mode of Payment</th>
//                                         <th className=" border border-gray-300 py-2 font-semibold whitespace-nowrap">Total Amount</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     <tr className="border border-gray-300">
//                                         <td className=" border border-gray-300 py-2 text-center">{data.description ?? "_________"}</td>
//                                         <td className=" border border-gray-300 py-2 text-center">{data.modeOfPay ?? "_________"}</td>
//                                         <td className=" border border-gray-300 py-2 text-center">₹{data.totalAmt ?? "0.00"}</td>
//                                     </tr>
//                                 </tbody>
//                             </table>

//                             <p className="flex gap-2">
//                                 <strong>Amount in Words:</strong> Rupees {data.Amt_Words ?? "_________"}
//                             </p>
//                         </div>
//                     </div>
//                     <p className="text-center font-medium text-[14px]">Deposited Amount will not be refundable</p>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default PrintReceiptModal;