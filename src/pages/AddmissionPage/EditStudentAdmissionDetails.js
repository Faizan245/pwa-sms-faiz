'use client'

import React, { useState, useRef, useEffect } from 'react';

const StudentAdmissionDetails = () => {
  const [searchScholarNo, setSearchScholarNo] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null); // Reference for the input field
  const buttonRef = useRef(null);
  const [fileKey, setFileKey] = useState(Date.now()); // Add a key to force input re-render
  const [documentURL, setDocumentURL] = useState(null);
  const [searchTrigger, setSearchTrigger] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [disableUpdate, setDisableUpdate] = useState(true);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [formData, setFormData] = useState({
    scholar_no: searchScholarNo,
    student_name: '',
    dob: '',
    gender: '',
    samagra_id: '',
    family_id: '',
    contact_no: '',
    father_name: '',
    mother_name: '',
    cast: '',
    aadhar_number: '',
    name_on_aadhar: '',
    whatsapp_no: '',
    previous_class: '',
    admission_under: '',
    admission_date: '',
    admission_class: '',
    address: '',
    bank_account: '',
    ifsc_code: '',
    photo: null,
    document: null,
    photoPath: '',
    documentPath: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Utility function to convert date format from "DD/MM/YYYY" to "YYYY-MM-DD"
  const convertDateToISOString = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDisableUpdate(false); // Enable the update button
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission (if inside a form)
      buttonRef.current?.click(); // Trigger button click programmatically
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0]; // Access the first file
    setDisableUpdate(false); // Enable the update button

    if (file) {
      // Update form data
      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));

      // Handle photo preview
      if (name === "photo") {
        const photoURL = URL.createObjectURL(file); // Generate URL for the photo
        setPhotoPreview(photoURL);
      }
      // Handle document name
      else if (name === "document") {
        setDocumentName(file.name); // Store the document name
        const url = URL.createObjectURL(file); // Generate URL for the file
        setDocumentURL(url);
      }
    }
  };

  const handleBrowseDocument = (e) => {
    e.preventDefault(); // Prevent any default behavior like form submission

    // Ensure the document path is a valid URL and append it to the base URL
    const baseURL = window.location.origin; // e.g., "http://localhost:3000"
    const fullDocumentURL = baseURL + formData.documentPath;

    if (documentURL) {
      window.open(documentURL, "_blank", "noopener,noreferrer");
    } else if (fullDocumentURL) {
      // Opening the document URL (ensure it's accessible from the server)
      window.open(fullDocumentURL, "_blank", "noopener,noreferrer");
    } else {
      alert("No document found");
    }
  };

  useEffect(() => {
    // Fetch student details only if searchScholarNo is not empty
    const fetchStudentDetails = async () => {
      setSearchScholarNo(searchScholarNo); // Update the scholar_no in the form data
      if (!searchScholarNo) return; // Avoid fetching when scholar_no is empty

      setLoading(true);
      setIsSearching(true);
      setShowDeleteButton(true);
      setError("");

      try {
        const response = await fetch("/api/Admission/FetchAdmission", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Ensure content type is JSON
          },
          body: JSON.stringify({ scholarNo: searchScholarNo }) // Send scholar_no as body data
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Fetched Student Details:", data); // Log the fetched data
          // Convert dob and admission_date to ISO format for input type="date"
          const formattedDob = convertDateToISOString(data.dob);
          const formattedAdmissionDate = convertDateToISOString(data.admission_date);
          setFormData({
            ...data,
            photo: null, // Keep photo as null
            document: null, // Keep document as null
            photoPath: data.photo, // Store the photo URL in photoPath
            documentPath: data.document, // Store the document URL in documentPath
            dob: formattedDob,
            admission_date: formattedAdmissionDate,
          });
        } else {
          setError(data.error || "Student not found");
        }
      } catch (err) {
        setError("Network error");
      }

      setLoading(false);
      setIsSearching(false);
      setSearchTrigger(false); // Reset the search trigger
    };

    fetchStudentDetails();
  }, [searchTrigger]);

  const handleUpdateData = async (e, data) => {
    e.preventDefault();
    const formDataPayload = new FormData();
    for (const key in data) {
      if (key === 'photo' || key === 'document') {
        // Skip photo and document in the regular form data since we will handle them separately
        continue;
      }
      formDataPayload.append(key, data[key]);
    }
    if (data.photo) {
      const photoData = new FormData();
      photoData.append('file', data.photo);
      photoData.append('scholar_no', data.scholar_no);
      await fetch('/api/upload-photo', {
        method: 'POST',
        body: photoData,
      });
      formDataPayload.set('photoPath', `/media/profilePhoto/photo${data.scholar_no}.jpg`);
    }
    if (data.document) {
      const documentData = new FormData();
      documentData.append('file', data.document);
      documentData.append('scholar_no', data.scholar_no);
      await fetch('/api/upload-document', {
        method: 'POST',
        body: documentData,
      });
      formDataPayload.set('documentPath', `/media/StudentDocuments/Document${data.scholar_no}.pdf`);
    }

    const formDataLog = {};
    formDataPayload.forEach((value, key) => {
      formDataLog[key] = value;
    });
    try {
      const response = await fetch('/api/Admission/UpdateAdmissionDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataLog),
      });

      if (response.ok) {
        const result = await response.json();
        // Show the popup
        setShowPopup(true);
        clearFields(); // Clear the form fields
        setFormData(''); // Clear the form fields
        setSearchScholarNo(''); // Clear the search field
        setPhotoPreview(null); // Clear the photo preview
        setDocumentName('');
        setDisableUpdate(true);
        setFileKey(Date.now());

        // Hide the popup after 2 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
        return { success: true };
      } else {
        // Check for 400 Bad Request or any other errors
        if (response.status === 400) {
          const errorResult = await response.json();
          console.error('Error:', errorResult.error);
          setErrorMessage('Please search for a valid scholar number before updating.');
          setShowError(true);
        } else {
          const errorResult = await response.json();
          console.error('Error:', errorResult.error);
          setErrorMessage('Something went wrong. Please try again.');
          setShowError(true);
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const clearFields = () => {
    setFormData({
      scholar_no: '',
      student_name: '',
      dob: '',
      gender: '',
      samagra_id: '',
      family_id: '',
      contact_no: '',
      father_name: '',
      mother_name: '',
      cast: '',
      aadhar_number: '',
      name_on_aadhar: '',
      whatsapp_no: '',
      previous_class: '',
      admission_under: '',
      admission_date: '',
      admission_class: '',
      address: '',
      bank_account: '',
      ifsc_code: '',
      photo: null,
      document: null,
      photoPath: '',
      documentPath: '',
    });
    setPhotoPreview(null);
    setDocumentName('');
  };

  const handleScholarNoChange = (e) => {
    setDisableUpdate(true);
    setShowDeleteButton(false);
    setErrorMessage('');
    setShowError(false);
    clearFields(); // Clear the form fields
    const { value } = e.target;
    setSearchScholarNo(value); // Update only the scholar_no state
  };

  const handleStudentDelete = async () => {
    try {
      const response = await fetch('/api/Admission/DeleteStudentAdmission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scholar_no: searchScholarNo }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Student deleted successfully');
        clearFields(); // Clear the form fields
        setSearchScholarNo(''); // Reset the search scholar no state
        setPhotoPreview(null); // Clear the photo preview
        setDocumentName('');
        setDisableUpdate(true);
        setShowError(false);
        setErrorMessage('');
        setShowDeleteButton(false);
      } else {
        alert(data.error || 'Error deleting student');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full mx-auto border p-5 max-lg:p-2 border-gray-300 rounded-lg">
        <form>
          <div className='flex justify-between max-md:flex-col gap-5'>
            <div className="max-xl:text-sm max-lg:text-[14px] max-sm:w-full grid w-[90%] grid-cols-4 max-xl:grid-cols-3 max-[500px]:grid-cols-2 gap-5 max-lg:gap-y-0 gap-y-1 mb-5">
              <div>
                <label>Scholar No:</label>
                <input
                  type="text"
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  name="scholarNo"
                  ref={inputRef}
                  onKeyDown={handleKeyDown}
                  value={searchScholarNo}
                  placeholder='Search by Scholar No'
                  onChange={handleScholarNoChange}
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                  required
                />
              </div>
              <div>
                <label>Student Name:</label>
                <input
                  type="text"
                  name="student_name"
                  disabled={isSearching}
                  value={formData.student_name || ''}
                  onChange={(e) => {
                    const capitalizedValue = e.target.value.replace(/\b\w/g, (char) => char.toUpperCase());
                    handleChange(e, capitalizedValue);
                  }}
                  className="w-full text-transform capitalize p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                  required
                />
              </div>
              <div>
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob || ''}
                  onChange={handleChange}
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                  required
                />
              </div>
              <div>
                <label>Gender:</label>
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  required
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label>Samagra ID:</label>
                <input
                  type="text"
                  name="samagra_id"
                  value={formData.samagra_id || ''}
                  onChange={handleChange}
                  maxLength="9"
                  minLength="9"
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 9)}
                  required
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                />
              </div>
              <div>
                <label>Family ID:</label>
                <input
                  type="text"
                  name="family_id"
                  value={formData.family_id || ''}
                  maxLength="8"
                  minLength="8"
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 8)}
                  onChange={handleChange}
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                />
              </div>
              <div>
                <label>Contact No:</label>
                <input
                  type="tel"
                  name="contact_no"
                  value={formData.contact_no || ''}
                  onChange={handleChange}
                  required
                  maxLength="10"
                  minLength="10"
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)}
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                />
              </div>
              <div>
                <label>Father's Name:</label>
                <input
                  type="text"
                  name="father_name"
                  value={formData.father_name || ''}
                  onChange={(e) => {
                    const capitalizedValue = e.target.value.replace(/\b\w/g, (char) => char.toUpperCase());
                    handleChange(e, capitalizedValue);
                  }}
                  required
                  className="w-full text-transform capitalize p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                />
              </div>
              <div>
                <label>Mother's Name:</label>
                <input
                  type="text"
                  name="mother_name"
                  value={formData.mother_name || ''}
                  onChange={(e) => {
                    const capitalizedValue = e.target.value.replace(/\b\w/g, (char) => char.toUpperCase());
                    handleChange(e, capitalizedValue);
                  }}
                  required
                  className="w-full text-transform capitalize p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                />
              </div>
              <div>
                <label>Caste:</label>
                <select
                  name="cast"
                  value={formData.cast || ''}
                  onChange={handleChange}
                  required
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                >
                  <option value="">Select Caste</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OBC">OBC</option>
                  <option value="GEN">GEN</option>
                </select>
              </div>
              <div>
                <label>Aadhar Number:</label>
                <input
                  type="text"
                  name="aadhar_number"
                  value={formData.aadhar_number || ''}
                  onChange={handleChange}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 12)}
                  maxLength="12"
                  minLength="12"
                  required
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                />
              </div>
              <div>
                <label>Name on Aadhar:</label>
                <input
                  type="text"
                  name="name_on_aadhar"
                  value={formData.name_on_aadhar || ''}
                  onChange={handleChange}
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                />
              </div>
              <div>
                <label>Whatsapp No:</label>
                <input
                  type="tel"
                  name="whatsapp_no"
                  value={formData.whatsapp_no || ''}
                  maxLength="10"
                  minLength="10"
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)}
                  onChange={handleChange}
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                />
              </div>
              <div>
                <label>Previous Class:</label>
                <select
                  name="previous_class"
                  value={formData.previous_class || ''}
                  onChange={handleChange}
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                >
                  <option value="">Select Previous Class</option>
                  <option value="Nur">Nursery</option>
                  <option value="Kg1">KG1</option>
                  <option value="Kg2">KG2</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                  <option value="5th">5th</option>
                  <option value="6th">6th</option>
                  <option value="7th">7th</option>
                  <option value="8th">8th</option>
                  <option value="9th">9th</option>
                  <option value="10th">10th</option>
                  <option value="11th">11th</option>
                  <option value="12th">12th</option>
                </select>
              </div>
              <div>
                <label>Admission Under:</label>
                <select
                  name="admission_under"
                  value={formData.admission_under || ''}
                  onChange={handleChange}
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                >
                  <option value="">Select Admission Under</option>
                  <option value="Fees">Fees</option>
                  <option value="RTE">RTE</option>
                </select>
              </div>
              <div>
                <label>Admission Date:</label>
                <input
                  type="date"
                  name="admission_date"
                  value={formData.admission_date || ''}
                  onChange={handleChange}
                  required
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                />
              </div>
              <div>
                <label>Admission Class:</label>
                <select
                  name="admission_class"
                  value={formData.admission_class || ''}
                  onChange={handleChange}
                  required
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                >
                  <option value="">Select Admission Class</option>
                  <option value="Nur">Nursery</option>
                  <option value="Kg1">KG1</option>
                  <option value="Kg2">KG2</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                  <option value="5th">5th</option>
                  <option value="6th">6th</option>
                  <option value="7th">7th</option>
                  <option value="8th">8th</option>
                  <option value="9th">9th</option>
                  <option value="10th">10th</option>
                  <option value="11th">11th</option>
                  <option value="12th">12th</option>
                </select>
              </div>
              <div className='col-span-2'>
                <label>Address:</label>
                <input
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  required
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                />
              </div>
              <div>
                <label>Bank Account No:</label>
                <input
                  type="text"
                  name="bank_account"
                  value={formData.bank_account || ''}
                  onChange={handleChange}
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                />
              </div>
              <div>
                <label>IFSC Code:</label>
                <input
                  type="text"
                  name="ifsc_code"
                  value={formData.ifsc_code || ''}
                  onChange={handleChange}
                  className="w-full p-2 my-2 border border-gray-300 rounded-md text-sm max-xl:p-1"
                />
              </div>
            </div>
            {/* Right Side Section for Photo and Document */}
            <div className="flex flex-col max-md:flex-row max-md:justify-center max-md:w-full gap-5 max-xl:w-[30%]">
              {/* Photo Upload */}
              <div className='flex flex-col gap-5 items-center'>
                {(photoPreview || formData.photoPath) && (
                  <div className="mt-2 flex items-center gap-5">
                    <img
                      src={
                        photoPreview
                          ? photoPreview
                          : formData.photoPath
                            ? `${formData.photoPath}?t=${new Date().getTime()}`
                            : null
                      }
                      alt="Uploaded Preview"
                      className="w-32 h-32 max-xl:w-24 max-lg:h-24 object-cover rounded-md"
                    />
                  </div>
                )}
                <div className='flex items-center gap-2 max-xl:flex-col'>
                  <label>Photo:</label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    key={fileKey}
                    className="p-2 max-xl:p-1 my-2 max-xl:w-[150px] border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              {/* Document Upload */}
              <div className='flex flex-col gap-5 items-center max-md:flex-col-reverse'>
                <div className='flex items-center max-xl:flex-col gap-2'>
                  <label>Document:</label>
                  <input
                    type="file"
                    name="document"
                    onChange={handleFileChange}
                    key={fileKey}
                    className="p-2 max-xl:p-1 my-2 max-xl:w-[150px] border border-gray-300 rounded-md text-sm"
                  />
                </div>
                {(documentName || formData.documentPath) && (
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleBrowseDocument}
                      className="px-4 py-2 max-lg:p-1 max-lg:text-[14px] bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      View Document
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-center space-x-5 space-y-5 mt-2">
            <button
              type="submit"
              className={`px-5 py-2 bg-green-500 max-xl:py-1 max-xl:px-3 text-white rounded-md cursor-pointer ${disableUpdate ? 'opacity-50' : 'hover:bg-green-600'}`}
              onClick={(e) => handleUpdateData(e, formData)}
              disabled={disableUpdate}
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => { clearFields(); setSearchTrigger(true) }}
              ref={buttonRef}
              className="px-5 py-2 max-xl:py-1 max-xl:px-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => { clearFields(); setSearchScholarNo('') }}
              className="px-5 py-2 max-xl:py-1 max-xl:px-3 bg-yellow-500 text-white rounded hover:bg-red-600"
            >
              Clear Fields
            </button>
            {showDeleteButton && (
              <>
                <button
                  type="button"
                  onClick={handleStudentDelete}
                  className="px-5 py-2 max-xl:py-1 max-xl:px-3 bg-red-500 text-white rounded hover:bg-blue-600"
                >
                  Delete Student
                </button>
              </>
            )}
            {showError && (
              <div className="error-message text-red-500">
                {errorMessage}
              </div>
            )}
          </div>
        </form>
      </div>
      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 scale-105">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center relative">
                <div className="animate-spin-slow absolute h-16 w-16 border-4 border-green-400 rounded-full border-t-transparent"></div>
                <div className="bg-green-500 p-4 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-700 mt-4">
                Data added successfully!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAdmissionDetails;