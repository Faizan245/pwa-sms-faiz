'use client';
import React, { useState, useEffect, useRef } from 'react';
import Success from '../successDailogue/Success';

const AdmissionForm = () => {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const [documentURL, setDocumentURL] = useState(null);
  const [nextScholarNo, setNextScholarNo] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
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
    admission_year: '',
    admission_class: '',
    address: '',
    bank_account: '',
    ifsc_code: '',
    photo: null,
    document: null,
    photoPath: '',
    documentPath: '',
  });
  useEffect(() => {
    const fetchScholarNo = async () => {
      try {
        const response = await fetch(
          `/api/Admission/NextScholarNo`
        );
        const data = await response.json();
        if (response.ok) {
          setNextScholarNo(data.next_scholar_no);
          setFormData((prevData) => ({
            ...prevData,
            scholar_no: data.next_scholar_no,
          }));
        } else {
          setError(data.error || "Failed to fetch data");
        }
      } catch (err) {
        setError("Network error");
      }
    }
    fetchScholarNo();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
    setFormData((prev) => ({ ...prev, admission_date: today }));
  }, []);
  // Update the admission year based on admission_date
  useEffect(() => {
    if (formData.admission_date) {
      const admissionYear = new Date(formData.admission_date).getFullYear();
      let admissionYearOption = "";

      if (admissionYear >= 2023 && admissionYear < 2024) {
        admissionYearOption = "year_23_24";
      } else if (admissionYear >= 2024 && admissionYear < 2025) {
        admissionYearOption = "year_24_25";
      } else if (admissionYear >= 2025 && admissionYear < 2026) {
        admissionYearOption = "year_25_26";
      } else if (admissionYear >= 2026 && admissionYear < 2027) {
        admissionYearOption = "year_26_27";
      }

      setFormData((prev) => ({
        ...prev,
        admission_year: admissionYearOption,
      }));
    }
  }, [formData.admission_date]);


  const fetchScholarNo = async () => {
    try {
      const response = await fetch(`/api/Admission/NextScholarNo`);
      const data = await response.json();
      if (response.ok) {
        setNextScholarNo(data.next_scholar_no);
        setFormData((prevData) => ({
          ...prevData,
          scholar_no: data.next_scholar_no,
        }));
      } else {
        setError(data.error || "Failed to fetch data");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "scholar_no") {
      setNextScholarNo('');
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0]; // Access the first file

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
  const handleBrowseDocument = () => {
    if (documentURL) {
      window.open(documentURL, "_blank"); // Open the document in a new tab or the default PDF viewer
    } else {
      alert("No document available to open.");
    }
  };
  const handleRemoveDocument = () => {
    setDocumentName(""); // Clear the document name
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input field
    }
  };
  const handleRemovePhoto = () => {
    setPhotoPreview(null); // Clear the photo preview
    if (photoInputRef.current) {
      photoInputRef.current.value = ""; // Reset the file input field
    }
  };
  const clearForm = () => {
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
      admission_year: '',
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
    setDocumentName("");
    setDocumentURL(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (photoInputRef.current) photoInputRef.current.value = "";
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data for submission (including file paths)
    const formDataToSubmit = new FormData();
    for (const key in formData) {
      if (key === 'photo' || key === 'document') {
        // Skip photo and document in the regular form data since we will handle them separately
        continue;
      }
      formDataToSubmit.append(key, formData[key]);
    }

    try {
      // Upload photo and document first, then store their paths in formData
      if (formData.photo) {
        const photoData = new FormData();
        photoData.append('file', formData.photo);
        photoData.append('scholar_no', formData.scholar_no);
        await fetch('/api/upload-photo', {
          method: 'POST',
          body: photoData,
        });
        formDataToSubmit.append('photoPath', `/media/profilePhoto/photo${formData.scholar_no}.jpg`);
      }

      if (formData.document) {
        const documentData = new FormData();
        documentData.append('file', formData.document);
        documentData.append('scholar_no', formData.scholar_no);
        await fetch('/api/upload-document', {
          method: 'POST',
          body: documentData,
        });
        formDataToSubmit.append('documentPath', `/media/StudentDocuments/Document${formData.scholar_no}.pdf`);
      }





      // Convert FormData to a plain object for logging
      const formDataLog = {};
      formDataToSubmit.forEach((value, key) => {
        formDataLog[key] = value;
      });
      if (!formDataLog.samagra_id || formDataLog.samagra_id.length !== 9) {
        alert("Samagra ID must be exactly 9 digits.");
        return; // Prevent form submission
      }
      if (formDataLog.family_id && formDataLog.family_id.length !== 8) {
        alert("Family ID must be exactly 8 digits.");
        return; // Prevent form submission
      }
      if (!formDataLog.contact_no || formDataLog.contact_no.length !== 10) {
        alert("Contact Number must be exactly 10 digits.");
        return; // Prevent form submission
      }
      if (!formDataLog.aadhar_number || formDataLog.aadhar_number.length !== 12) {
        alert("Aadhar Number must be exactly 12 digits.");
        return; // Prevent form submission
      }



      if (!formDataLog.whatsapp_no || formDataLog.whatsapp_no.length !== 10) {
        alert("WhatsApp Number must be exactly 10 digits.");
        return; // Prevent form submission
      }


      console.log('Form Data to Submit:', formDataLog);


      // Submit the remaining form data to your API
      const response = await fetch('/api/Admission/admission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify JSON format
        },
        body: JSON.stringify(formDataLog), // Convert data to JSON string
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Form submitted successfully:', data);
        setShowSuccess(true); // Show the success dialog
        clearForm(); // Clear the form fields
        fetchScholarNo(); // Fetch the next scholar number
        setTimeout(() => {
          setShowSuccess(false);
        }, 1500);
        return { success: true };
      } else {
        console.error('Error submitting form:', data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  return (
    <div className="w-full mx-auto  border p-5 max-lg:p-2 border-gray-300 rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className='flex justify-between max-md:flex-col gap-5'>
          <div className="max-xl:text-sm max-lg:text-[14px] max-sm:w-full grid w-[90%] grid-cols-4 max-xl:grid-cols-3 max-[500px]:grid-cols-2 gap-5 max-lg:gap-y-0 max-sm:gap-y-2 gap-y-1 mb-5">
            <div>
              <label>Scholar No:</label>

              <input
                type="text"
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} // Allow only numbers
                name="scholar_no"
                value={formData.scholar_no !== "" ? formData.scholar_no : nextScholarNo} // Use nextScholarNo only if formData.scholar_no is null
                onChange={handleChange}
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
                required
              />
            </div>

            <div>
              <label>Student Name:</label>
              <input
                type="text"
                name="student_name"
                value={formData.student_name}
                onChange={(e) => {
                  // Capitalize the first letter of each word
                  const capitalizedValue = e.target.value.replace(/\b\w/g, (char) => char.toUpperCase());
                  handleChange(e, capitalizedValue); // Update the state with the capitalized value
                }}
                className="w-full text-transform capitalize p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
                required
              />
            </div>

            <div>
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
                required
              />
            </div>

            <div>
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
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
                value={formData.samagra_id}
                onChange={handleChange}
                maxLength="9"
                minLength="9"
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 9)}
                required
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
              />
            </div>

            <div>
              <label>Family ID:</label>
              <input
                type="text"
                name="family_id"
                value={formData.family_id}
                maxLength="8"
                minLength="8"
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 8)}
                onChange={handleChange}
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
              />
            </div>

            <div>
              <label>Contact No:</label>
              <input
                type="tel"
                name="contact_no"
                value={formData.contact_no}
                onChange={handleChange}
                required
                maxLength="10"
                minLength="10"
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)}
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
              />
            </div>

            <div>
              <label>Father's Name:</label>
              <input
                type="text"
                name="father_name"
                value={formData.father_name}
                onChange={(e) => {
                  // Capitalize the first letter of each word
                  const capitalizedValue = e.target.value.replace(/\b\w/g, (char) => char.toUpperCase());
                  handleChange(e, capitalizedValue); // Update the state with the capitalized value
                }}
                required
                className="w-full text-transform capitalize p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
              />
            </div>

            <div>
              <label>Mother's Name:</label>
              <input
                type="text"
                name="mother_name"
                value={formData.mother_name}
                onChange={(e) => {
                  // Capitalize the first letter of each word
                  const capitalizedValue = e.target.value.replace(/\b\w/g, (char) => char.toUpperCase());
                  handleChange(e, capitalizedValue); // Update the state with the capitalized value
                }}
                required
                className="w-full text-transform capitalize p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
              />
            </div>

            <div>
              <label>Caste:</label>
              <select
                name="cast"
                value={formData.cast}
                onChange={handleChange}
                required
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
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
                value={formData.aadhar_number}
                onChange={handleChange}
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 12)}
                maxLength="12"
                minLength="12"
                required
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
              />
            </div>

            <div>
              <label>Name on Aadhar:</label>
              <input
                type="text"
                name="name_on_aadhar"
                value={formData.name_on_aadhar}
                onChange={handleChange}
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
              />
            </div>

            <div>
              <label>Whatsapp No:</label>
              <input
                type="tel"
                name="whatsapp_no"
                value={formData.whatsapp_no}
                maxLength="10"
                minLength="10"
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)}
                onChange={handleChange}
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
              />
            </div>

            <div>
              <label>Previous Class:</label>
              <select
                name="previous_class"
                value={formData.previous_class}
                onChange={handleChange}
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
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
                value={formData.admission_under}
                onChange={handleChange}
                required
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
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
                value={formData.admission_date}
                onChange={handleChange}
                required
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
              />
            </div>

            <div>
              <label>Admission Year:</label>
              <select
                name="admission_year"
                value={formData.admission_year}
                onChange={handleChange}
                required
                disabled
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
              >
                <option value="">Select Admission Year</option>
                <option value="year_23_24">23-24</option>
                <option value="year_24_25">24-25</option>
                <option value="year_25_26">25-26</option>
                <option value="year_26_27">26-27</option>
              </select>
            </div>

            <div>
              <label>Admission Class:</label>
              <select
                name="admission_class"
                value={formData.admission_class}
                onChange={handleChange}
                required
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
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
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
              />
            </div>

            <div>
              <label>Bank Account No:</label>
              <input
                type="text"
                name="bank_account"
                value={formData.bank_account}
                onChange={handleChange}
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
              />
            </div>

            <div>
              <label>IFSC Code:</label>
              <input
                type="text"
                name="ifsc_code"
                value={formData.ifsc_code}
                onChange={handleChange}
                className="w-full p-2 max-xl:p-1 my-2 border border-gray-300 rounded-md text-sm "
              />
            </div>
          </div>
          {/* Right Side Section for Photo and Document */}
          <div className="flex flex-col max-md:flex-row max-md:justify-center max-md:w-full gap-5 max-xl:w-[30%]">
            {/* Photo Upload */}
            <div className='flex flex-col  gap-5 items-center'>
              {photoPreview && (
                <div className="mt-2 flex items-center gap-5">
                  <img
                    src={photoPreview}
                    alt="Uploaded Preview"
                    className="w-32 h-32 max-xl:w-24 max-lg:h-24 object-cover rounded-md"
                  />
                  <button
                    onClick={handleRemovePhoto}
                    className=""
                  >
                    ✖
                  </button>
                </div>
              )}
              <div className='flex items-center max-xl:flex-col  gap-2'>
                <label>Photo:</label>
                <input
                  type="file"
                  ref={photoInputRef}
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="p-2 max-xl:p-1 my-2 max-xl:w-[150px] border border-gray-300 rounded-md text-sm "
                />
              </div>
            </div>

            {/* Document Upload */}
            <div className='flex flex-col max-md:flex-col-reverse gap-5 items-center'>
              <div className='flex items-center max-xl:flex-col  gap-2'>
                <label>Document:</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  name="document"
                  onChange={handleFileChange}
                  className="p-2 max-xl:p-1 my-2 max-xl:w-[150px] border border-gray-300 rounded-md text-sm "
                />
              </div>
              {documentName && (
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={handleBrowseDocument}
                    className="px-4 py-2 max-lg:p-1 max-lg:text-[14px] bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    View Document
                  </button>
                  <button
                    onClick={handleRemoveDocument}
                    className=""
                  >
                    ✖
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <button
            type="submit"
            className="px-5 py-2 max-xl:py-1 max-xl:px-3 bg-green-500 text-white rounded-md cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
      {showSuccess && <Success />}
    </div>
  );
}

export default AdmissionForm;
