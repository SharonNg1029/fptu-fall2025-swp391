import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectUserRole,
  selectCustomerID,
  selectStaffID,
  selectManagerID,
  selectAdminID,
} from "../../redux/features/userSlice";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import api from "../../configs/axios";
import { updateUser } from "../../redux/features/userSlice";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user?.currentUser);
  const userRole = useSelector(selectUserRole);
  const customerID = useSelector(selectCustomerID);
  const staffID = useSelector(selectStaffID);
  const managerID = useSelector(selectManagerID);
  const adminID = useSelector(selectAdminID);

  // Ưu tiên lấy đúng ID theo role
  let userID = null;
  if (userRole === "customer") userID = customerID;
  else if (userRole === "staff") userID = staffID;
  else if (userRole === "manager") userID = managerID;
  else if (userRole === "admin") userID = adminID;

  // Nếu vẫn không có userID, fallback lấy từ currentUser
  if (!userID && currentUser) {
    userID =
      currentUser?.customerID ||
      currentUser?.customerId ||
      currentUser?.staffID ||
      currentUser?.staffId ||
      currentUser?.managerID ||
      currentUser?.managerId ||
      currentUser?.adminID ||
      currentUser?.adminId;
  }

  if (!userID && currentUser) {
    setTimeout(() => {
      toast.error(
        "Can not find User ID in your account. Please sign in again or contact support."
      );
    }, 100);
  }

  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  });

  // ✅ Thêm state cho DOB validation
  const [dobValidation, setDobValidation] = useState({ isValid: true, message: "" });

  // ✅ Helper function để get max date (ngày hiện tại)
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ✅ Helper function để get min date (100 năm trước)
  const getMinDate = () => {
    const today = new Date();
    const minYear = today.getFullYear() - 100;
    return `${minYear}-01-01`;
  };

  // ✅ Validation function cho DOB
  const validateDateOfBirth = (dateValue) => {
    if (!dateValue) return { isValid: true, message: "" };
    
    const selectedDate = new Date(dateValue);
    const today = new Date();
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(today.getFullYear() - 100);
    
    // Reset time to compare only dates
    today.setHours(23, 59, 59, 999);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      return {
        isValid: false,
        message: "Date of birth cannot be in the future"
      };
    }
    
    if (selectedDate < hundredYearsAgo) {
      return {
        isValid: false,
        message: "Please enter a valid date of birth"
      };
    }
    
    return { isValid: true, message: "" };
  };

  // ✅ FIXED: Gender conversion functions
  const convertDatabaseGenderToUI = (dbGender) => {
    console.log('🔄 Converting DB gender to UI:', { 
      dbGender, 
      type: typeof dbGender,
      timestamp: new Date().toISOString()
    });
    
    // Database: 0 = Male, 1 = Female
    // UI: 1 = Male, 2 = Female
    if (dbGender === 0 || dbGender === "0") {
      console.log('✅ DB Male (0) → UI Male (1)');
      return "1"; // Male
    }
    if (dbGender === 1 || dbGender === "1") {
      console.log('✅ DB Female (1) → UI Female (2)');
      return "2"; // Female
    }
    
    console.log('❌ Unknown gender value, returning empty');
    return ""; // Unknown
  };

  const convertUIGenderToDatabase = (uiGender) => {
    console.log('🔄 Converting UI gender to DB:', { 
      uiGender, 
      type: typeof uiGender,
      timestamp: new Date().toISOString()
    });
    
    // UI: 1 = Male, 2 = Female
    // Database: 0 = Male, 1 = Female
    if (uiGender === "1" || uiGender === 1) {
      console.log('✅ UI Male (1) → DB Male (0)');
      return 0; // Male
    }
    if (uiGender === "2" || uiGender === 2) {
      console.log('✅ UI Female (2) → DB Female (1)');
      return 1; // Female
    }
    
    console.log('❌ Unknown UI gender, returning null');
    return null; // Unknown
  };

  const getGenderDisplayText = (dbGender) => {
    if (dbGender === 0 || dbGender === "0") return "Male";
    if (dbGender === 1 || dbGender === "1") return "Female";
    return "Not provided";
  };

  // ✅ Helper function để clean placeholder values
  const cleanPlaceholderValue = (value, type = 'text') => {
    if (!value) return "";
    
    const placeholders = ['string', 'test', 'placeholder', 'example', 'null', 'undefined'];
    
    if (typeof value === 'string' && placeholders.includes(value.toLowerCase())) {
      return "";
    }
    
    if (type === 'gender') {
      if (value === 1 || value === '1') return 1;
      if (value === 2 || value === '2') return 2;
      if (value === 0 || value === '0') return 0;
      if (value === 1073741824 || value > 10) return "";
      return value;
    }
    
    return value;
  };

  // ✅ Helper function để lấy tất cả fields từ database
  const getFieldValue = (profile, fieldName, fallbackFields = []) => {
    // Thử lấy từ field chính
    let value = profile?.[fieldName];
    
    // Nếu không có, thử các fallback fields
    if (!value && fallbackFields.length > 0) {
      for (const fallback of fallbackFields) {
        if (profile?.[fallback]) {
          value = profile[fallback];
          break;
        }
      }
    }
    
    // Thử lấy từ account nested object nếu có
    if (!value && profile?.account?.[fieldName]) {
      value = profile.account[fieldName];
    }
    
    return cleanPlaceholderValue(value);
  };

  // ✅ Sửa lại function formatMemberSince để xử lý array date
  const formatMemberSince = (dateValue) => {
    if (!dateValue) return "Unknown";

    try {
      let date;

      if (Array.isArray(dateValue) && dateValue.length >= 3) {
        const [year, month, day] = dateValue;
        date = new Date(year, month - 1, day);
      } else if (typeof dateValue === "string") {
        date = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        date = dateValue;
      } else {
        return "Unknown";
      }

      if (isNaN(date.getTime())) return "Unknown";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error, dateValue);
      return "Unknown";
    }
  };

  // Helper function để xử lý tiếng Việt
  const normalizeVietnamese = (text, shouldTrim = false) => {
    if (!text) return text;
    const normalized = text.normalize("NFC");
    return shouldTrim ? normalized.trim() : normalized;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userID) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let apiPath = `/customer/my-info/${userID}`;
        if (userRole === "staff") apiPath = `/staff/my-info/${userID}`;
        if (userRole === "manager") apiPath = `/manager/my-info/${userID}`;
        if (userRole === "admin") apiPath = `/admin/my-info/${userID}`;

        console.log('🔍 Fetching profile:', {
          apiPath,
          userRole,
          userID,
          timestamp: new Date().toISOString()
        });

        const response = await api.get(apiPath, {
          headers: {
            Accept: "application/json; charset=utf-8",
          },
        });

        const profile = response.data.data || response.data[0] || response.data;
        console.log('📊 Raw profile data received:', profile);
        
        setUserProfile(profile);

        // ✅ Get all database fields với fallbacks
        const fullName = getFieldValue(profile, 'full_name', ['fullName', 'fullname']);
        const email = getFieldValue(profile, 'email', ['Email']);
        const phone = getFieldValue(profile, 'phone', ['Phone']);
        const address = getFieldValue(profile, 'address', ['Address']);
        const rawGender = getFieldValue(profile, 'gender', ['Gender']);
        const dobValue = getFieldValue(profile, 'dob', ['DOB', 'dateOfBirth']);

        console.log('📋 Extracted field values:', {
          fullName,
          email,
          phone,
          address,
          rawGender,
          rawGenderType: typeof rawGender,
          dobValue,
          timestamp: new Date().toISOString()
        });

        // ✅ Handle DOB conversion
        let dobForInput = "";
        if (dobValue) {
          if (Array.isArray(dobValue) && dobValue.length >= 3) {
            const [year, month, day] = dobValue;
            dobForInput = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          } else if (typeof dobValue === 'string') {
            if (dobValue.includes('-')) {
              dobForInput = dobValue;
            } else {
              const parsedDate = new Date(dobValue);
              if (!isNaN(parsedDate.getTime())) {
                dobForInput = parsedDate.toISOString().split("T")[0];
              }
            }
          }
        }

        // ✅ FIXED: Convert gender từ Database sang UI
        const genderForUI = convertDatabaseGenderToUI(rawGender);

        console.log('🎯 Gender conversion result:', {
          rawGender,
          rawGenderType: typeof rawGender,
          genderForUI,
          timestamp: new Date().toISOString()
        });

        setEditForm({
          fullName: normalizeVietnamese(fullName, false) || "",
          dob: dobForInput,
          email: normalizeVietnamese(email, true) || "",
          phone: normalizeVietnamese(phone, true) || "",
          address: normalizeVietnamese(address, false) || "",
          gender: genderForUI, // ✅ FIXED: Sử dụng function convert
        });

        console.log('📝 Edit form populated:', {
          fullName: normalizeVietnamese(fullName, false) || "",
          dob: dobForInput,
          email: normalizeVietnamese(email, true) || "",
          phone: normalizeVietnamese(phone, true) || "",
          address: normalizeVietnamese(address, false) || "",
          gender: genderForUI,
          timestamp: new Date().toISOString()
        });

        setError(null);
      } catch (err) {
        console.error("❌ Error fetching user profile:", err);
        setError("Failed to load profile data.");
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userID, userRole]);

  // ✅ Updated handleInputChange với DOB validation
  const handleInputChange = useCallback((field, value) => {
    console.log('✏️ Input change:', {
      field,
      value,
      timestamp: new Date().toISOString()
    });

    // ✅ Validate DOB khi thay đổi
    if (field === "dob") {
      const validation = validateDateOfBirth(value);
      setDobValidation(validation);
      
      console.log('📅 DOB Validation:', {
        value,
        isValid: validation.isValid,
        message: validation.message,
        timestamp: new Date().toISOString()
      });
    }

    setEditForm((prev) => ({
      ...prev,
      [field]:
        field === "fullName" || field === "address"
          ? normalizeVietnamese(value, false)
          : normalizeVietnamese(value, true),
    }));
  }, []);

  // ✅ Updated handleSaveProfile với DOB validation check
  const handleSaveProfile = async () => {
    if (!userID) return;

    // ✅ Validate DOB trước khi save
    const dobValidationResult = validateDateOfBirth(editForm.dob);
    if (!dobValidationResult.isValid) {
      setError(dobValidationResult.message);
      toast.error(dobValidationResult.message);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // ✅ Correct update paths
      let updatePath = `/customer/${userID}`;
      if (userRole === "staff") updatePath = `/staff/my-account/${userID}`;
      if (userRole === "manager") updatePath = `/manager/my-account/${userID}`;
      if (userRole === "admin") updatePath = `/admin/my-account/${userID}`;

      // ✅ FIXED: Convert gender từ UI sang Database
      const genderForDatabase = convertUIGenderToDatabase(editForm.gender);

      const formData = {
        fullName: normalizeVietnamese(editForm.fullName, false) || null,
        email: normalizeVietnamese(editForm.email, true) || null,
        phone: normalizeVietnamese(editForm.phone, true) || null,
        address: normalizeVietnamese(editForm.address, false) || null,
        dob: editForm.dob || null,
        gender: genderForDatabase, // ✅ FIXED: Sử dụng converted value
      };

      // Remove null/empty values
      const cleanFormData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value !== null && value !== '' && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      console.log('💾 Saving profile with validated DOB:', {
        updatePath,
        originalGender: editForm.gender,
        convertedGender: genderForDatabase,
        validatedDob: editForm.dob,
        cleanFormData,
        userRole,
        userID,
        timestamp: new Date().toISOString()
      });

      const response = await api.patch(updatePath, cleanFormData, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json; charset=utf-8",
        },
      });

      console.log('✅ Update success:', {
        status: response.status,
        data: response.data,
        timestamp: new Date().toISOString()
      });

      // ✅ CORRECT refresh paths
      let refreshPath = `/customer/my-info/${userID}`;
      if (userRole === "staff") refreshPath = `/staff/my-info/${userID}`;
      if (userRole === "manager") refreshPath = `/manager/my-info/${userID}`;
      if (userRole === "admin") refreshPath = `/admin/my-info/${userID}`;

      console.log('🔄 Refreshing from path:', refreshPath);

      // Wait for server to commit
      await new Promise(resolve => setTimeout(resolve, 1000));

      const refreshResponse = await api.get(refreshPath, {
        headers: {
          Accept: "application/json; charset=utf-8",
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        params: {
          _t: Date.now()
        }
      });

      const refreshedProfile = refreshResponse.data.data || refreshResponse.data[0] || refreshResponse.data;
      
      console.log('📊 Refreshed profile:', refreshedProfile);

      // ✅ Update states
      setUserProfile(refreshedProfile);
      
      // ✅ Re-extract all fields
      const refreshedFullName = getFieldValue(refreshedProfile, 'full_name', ['fullName', 'fullname']);
      const refreshedEmail = getFieldValue(refreshedProfile, 'email', ['Email']);
      const refreshedPhone = getFieldValue(refreshedProfile, 'phone', ['Phone']);
      const refreshedAddress = getFieldValue(refreshedProfile, 'address', ['Address']);
      const refreshedRawGender = getFieldValue(refreshedProfile, 'gender', ['Gender']);
      const refreshedDob = getFieldValue(refreshedProfile, 'dob', ['DOB', 'dateOfBirth']);

      console.log('📋 Extracted refresh data:', {
        refreshedFullName,
        refreshedEmail,
        refreshedPhone,
        refreshedAddress,
        refreshedRawGender,
        refreshedRawGenderType: typeof refreshedRawGender,
        refreshedDob,
        timestamp: new Date().toISOString()
      });

      // ✅ FIXED: Handle DOB conversion
      let refreshedDobForInput = "";
      if (refreshedDob) {
        if (Array.isArray(refreshedDob) && refreshedDob.length >= 3) {
          const [year, month, day] = refreshedDob;
          refreshedDobForInput = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        } else if (typeof refreshedDob === 'string' && refreshedDob.includes('-')) {
          refreshedDobForInput = refreshedDob;
        }
      }

      // ✅ FIXED: Convert gender từ Database sang UI
      const refreshedGenderForUI = convertDatabaseGenderToUI(refreshedRawGender);

      console.log('🔄 Final gender conversion:', {
        refreshedRawGender,
        refreshedRawGenderType: typeof refreshedRawGender,
        refreshedGenderForUI,
        timestamp: new Date().toISOString()
      });

      const updatedEditForm = {
        fullName: normalizeVietnamese(refreshedFullName, false) || "",
        dob: refreshedDobForInput,
        email: normalizeVietnamese(refreshedEmail, true) || "",
        phone: normalizeVietnamese(refreshedPhone, true) || "",
        address: normalizeVietnamese(refreshedAddress, false) || "",
        gender: refreshedGenderForUI, // ✅ FIXED: Sử dụng converted value
      };

      setEditForm(updatedEditForm);

      console.log('📝 Final updated edit form:', {
        updatedEditForm,
        timestamp: new Date().toISOString()
      });

      dispatch(updateUser({ ...currentUser, ...refreshedProfile }));
      
      setIsEditing(false);
      setSuccess(true);
      toast.success("Profile updated successfully!");

      // ✅ Reset DOB validation sau khi save thành công
      setDobValidation({ isValid: true, message: "" });

      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error("❌ Error updating profile:", err);
      const errorMessage = err.response?.data?.message || "Failed to update profile.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // ✅ Reset với extracted data từ userProfile
    const fullName = getFieldValue(userProfile, 'full_name', ['fullName', 'fullname']);
    const email = getFieldValue(userProfile, 'email', ['Email']);
    const phone = getFieldValue(userProfile, 'phone', ['Phone']);
    const address = getFieldValue(userProfile, 'address', ['Address']);
    const rawGender = getFieldValue(userProfile, 'gender', ['Gender']);
    const dobValue = getFieldValue(userProfile, 'dob', ['DOB', 'dateOfBirth']);

    let dobForInput = "";
    if (dobValue) {
      if (Array.isArray(dobValue) && dobValue.length >= 3) {
        const [year, month, day] = dobValue;
        dobForInput = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      } else if (typeof dobValue === 'string' && dobValue.includes('-')) {
        dobForInput = dobValue;
      }
    }

    // ✅ FIXED: Convert gender từ Database sang UI
    const genderForUI = convertDatabaseGenderToUI(rawGender);

    setEditForm({
      fullName: normalizeVietnamese(fullName, false) || "",
      dob: dobForInput,
      email: normalizeVietnamese(email, true) || "",
      phone: normalizeVietnamese(phone, true) || "",
      address: normalizeVietnamese(address, false) || "",
      gender: genderForUI, // ✅ FIXED: Sử dụng converted value
    });

    console.log('🔄 Form reset with converted gender:', {
      rawGender,
      genderForUI,
      timestamp: new Date().toISOString()
    });

    // ✅ Reset DOB validation khi cancel
    setDobValidation({ isValid: true, message: "" });
    setIsEditing(false);
    setError(null);
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleChangePassword = () => {
    console.log('🔐 Navigating to Change Password page', {
      userRole,
      userID,
      timestamp: new Date().toISOString()
    });

    let passwordResetPath = '/reset-password';
    
    if (userRole === "admin" && userID) {
      passwordResetPath = `/admin/reset-password/${userID}`;
    } else if (userRole === "staff" && userID) {
      passwordResetPath = `/staff/reset-password/${userID}`;
    } else if (userRole === "manager" && userID) {
      passwordResetPath = `/manager/reset-password/${userID}`;
    } else if (userRole === "customer" && userID) {
      passwordResetPath = `/customer/reset-password/${userID}`;
    }

    console.log('🔗 Password reset path:', passwordResetPath);
    navigate(passwordResetPath);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="text-lg font-medium text-gray-700 vietnamese-text">
            Loading Your Profile...
          </span>
        </div>
      </div>
    );
  }

  if (error && !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3 vietnamese-text">
            Oops! Something Went Wrong
          </h2>
          <p className="text-gray-600 vietnamese-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      lang="vi"
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
          
          .vietnamese-text {
            font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
            font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-variant-ligatures: normal;
            letter-spacing: 0.01em;
          }
          
          .vietnamese-text {
            unicode-bidi: embed;
            direction: ltr;
          }
          
          input.vietnamese-input, 
          textarea.vietnamese-input, 
          select.vietnamese-input {
            font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            font-size: 16px !important;
            line-height: 1.5 !important;
            letter-spacing: 0.01em !important;
          }
          
          button.vietnamese-button {
            font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            font-weight: 500 !important;
            letter-spacing: 0.01em !important;
          }
          
          h1.vietnamese-header, h2.vietnamese-header, h3.vietnamese-header {
            font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            font-weight: 600 !important;
            letter-spacing: -0.01em !important;
          }
          
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
          
          * {
            text-rendering: optimizeLegibility;
          }
        `,
        }}
      />

      <div className="container mx-auto px-4 py-10">
        {/* Messages */}
        {success && (
          <div className="fixed top-5 right-5 z-50 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slideIn">
            <CheckCircle className="h-5 w-5" />
            <span className="vietnamese-text">
              Profile updated successfully!
            </span>
          </div>
        )}
        {error && (
          <div className="fixed top-5 right-5 z-50 bg-red-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span className="vietnamese-text">{error}</span>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-200">
            <div
              className="p-8 relative"
              style={{
                background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
              }}
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={goBack}
                  className="p-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors vietnamese-button flex items-center justify-center"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-blue-200">
                      <User className="h-8 w-8 text-blue-800" />
                    </div>
                    <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-transform duration-200 hover:scale-110 hover:bg-blue-700 border-2 border-white">
                      <Camera className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-white flex-1">
                    <h1 className="text-2xl font-bold mb-1 vietnamese-text vietnamese-header">
                      Profile Settings
                    </h1>
                    <p className="text-blue-100 vietnamese-text">
                      Manage your personal information and account settings
                    </p>
                  </div>
                </div>

                <button
                  onClick={
                    isEditing ? handleCancelEdit : () => setIsEditing(true)
                  }
                  disabled={saving}
                  className={`px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-300 flex items-center space-x-2 disabled:opacity-60 vietnamese-button ${
                    isEditing
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-white text-blue-700 hover:bg-gray-100 hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {isEditing ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Edit3 className="h-5 w-5" />
                  )}
                  <span className="vietnamese-text">
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Information Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3 vietnamese-header">
                <User className="h-6 w-6 text-blue-800" />
                <span className="vietnamese-text">Personal Information</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent vietnamese-input"
                        placeholder="Enter full name"
                      />
                    </div>

                    {/* Date of Birth with Validation */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={editForm.dob}
                        onChange={(e) => handleInputChange("dob", e.target.value)}
                        min={getMinDate()} // ✅ Không cho chọn quá 100 năm trước
                        max={getTodayDate()} // ✅ Không cho chọn tương lai
                        className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent vietnamese-input ${
                          !dobValidation.isValid 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300'
                        }`}
                      />
                      {/* ✅ Hiển thị error message cho DOB */}
                      {!dobValidation.isValid && (
                        <p className="mt-1 text-sm text-red-600 vietnamese-text flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {dobValidation.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent vietnamese-input"
                        placeholder="Enter email"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent vietnamese-input"
                        placeholder="Enter phone"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Gender
                      </label>
                      <select
                        value={editForm.gender}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white vietnamese-input"
                      >
                        <option value="" className="vietnamese-text">
                          Select gender
                        </option>
                        <option value={1} className="vietnamese-text">
                          Male
                        </option>
                        <option value={2} className="vietnamese-text">
                          Female
                        </option>
                      </select>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Address
                      </label>
                      <textarea
                        value={editForm.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent vietnamese-input"
                        placeholder="Enter address"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Display Fields */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Full Name
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center space-x-3 border border-gray-200">
                        <span className="truncate vietnamese-text">
                          {normalizeVietnamese(getFieldValue(userProfile, 'full_name', ['fullName', 'fullname']), false) || "Not provided"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Date of Birth
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center space-x-3 border border-gray-200">
                        <Calendar className="h-5 w-5 text-blue-700 flex-shrink-0" />
                        <span className="truncate vietnamese-text">
                          {formatMemberSince(getFieldValue(userProfile, 'dob', ['DOB', 'dateOfBirth'])) || "Not provided"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Email Address
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center space-x-3 border border-gray-200">
                        <Mail className="h-5 w-5 text-blue-700 flex-shrink-0" />
                        <span className="truncate vietnamese-text">
                          {getFieldValue(userProfile, 'email', ['Email']) || "Not provided"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Phone Number
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center space-x-3 border border-gray-200">
                        <Phone className="h-5 w-5 text-blue-700 flex-shrink-0" />
                        <span className="truncate vietnamese-text">
                          {getFieldValue(userProfile, 'phone', ['Phone']) || "Not provided"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Gender
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center space-x-3 border border-gray-200">
                        <span className="truncate vietnamese-text">
                          {getGenderDisplayText(getFieldValue(userProfile, 'gender', ['Gender']))}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Address
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center space-x-3 border border-gray-200">
                        <MapPin className="h-5 w-5 text-blue-700 flex-shrink-0" />
                        <span className="truncate vietnamese-text">
                          {normalizeVietnamese(getFieldValue(userProfile, 'address', ['Address']), false) || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {isEditing && (
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 vietnamese-button"
                  >
                    <span className="vietnamese-text">Cancel</span>
                  </button>
                  {/* ✅ Updated Save button để disable khi có validation error */}
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving || !dobValidation.isValid} // ✅ Disable khi DOB không valid
                    className={`px-6 py-2.5 text-white rounded-lg font-semibold transition-all duration-300 shadow-md flex items-center space-x-2 disabled:cursor-not-allowed transform vietnamese-button ${
                      saving || !dobValidation.isValid
                        ? 'opacity-60 cursor-not-allowed'
                        : 'opacity-100 hover:scale-105'
                    }`}
                    style={{
                      background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                    }}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="vietnamese-text">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span className="vietnamese-text">Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 vietnamese-text vietnamese-header">
                  Member Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium vietnamese-text">
                      Member Since
                    </span>
                    <span className="text-gray-800 font-semibold vietnamese-text">
                      {formatMemberSince(
                        userProfile?.account?.createAt || userProfile?.createAt
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 vietnamese-text vietnamese-header">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleChangePassword}
                    className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 text-gray-700 font-medium hover:bg-gray-100 hover:text-blue-800 vietnamese-button"
                  >
                    <Shield className="h-5 w-5 text-blue-700" />
                    <span className="vietnamese-text">Change Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;