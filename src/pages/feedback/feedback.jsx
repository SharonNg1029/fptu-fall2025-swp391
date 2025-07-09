import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../configs/axios"; // Your custom axios file

const defaultTitleTop = "We appreciate your trust";
const defaultTitleBottom = "Please provide your feedback on our service.";

const FeedbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingID = searchParams.get("bookingId") || searchParams.get("bookingid");
  const customerID = useSelector(state => state.user?.customerID);

  const [form, setForm] = useState({
    content: "",
    rating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [alreadyFeedback, setAlreadyFeedback] = useState(false);

  const createAt = new Date().toISOString().slice(0, 10);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleStarClick = (value) => {
    setForm((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (form.rating === 0) {
      setError("Please select a rating.");
      setLoading(false);
      return;
    }
    const data = {
      title: `${defaultTitleTop} - ${defaultTitleBottom}`,
      content: form.content,
      rating: form.rating,
      createAt: createAt,
    };
    try {
      await api.post(
        `/customer/feedback/${bookingID}/${customerID}`,
        data
      );
      setSubmitted(true);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setAlreadyFeedback(true);
        setError("You have already submitted feedback. You cannot submit again.");
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred while submitting feedback.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Header with logo left, text right
  const FeedbackHeader = () => (
    <div className="bg-blue-600 rounded-t-2xl flex items-center px-8 py-6 min-h-[110px]">
      <div className="flex-shrink-0">
        <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-blue-600">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-10 w-10 object-contain"
          />
        </div>
      </div>
      <div className="ml-6 flex flex-col justify-center">
        <div className="text-2xl font-bold text-white leading-tight">{defaultTitleTop}</div>
        <div className="text-base text-blue-100 mt-1">{defaultTitleBottom}</div>
      </div>
    </div>
  );

  const FeedbackBox = ({ children }) => (
    <div className="max-w-md w-full mx-auto mt-16 bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
      <FeedbackHeader />
      <div className="py-8 px-8">{children}</div>
    </div>
  );

  if (!bookingID) {
    return (
      <FeedbackBox>
        <div className="flex flex-col items-center justify-center text-base font-medium text-red-600">
          Missing bookingID!
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition border border-blue-200"
          >
            Back
          </button>
        </div>
      </FeedbackBox>
    );
  }

  if (!customerID) {
    return (
      <FeedbackBox>
        <div className="flex flex-col items-center justify-center text-base font-medium text-red-600">
          Missing customer information!
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition border border-blue-200"
          >
            Back
          </button>
        </div>
      </FeedbackBox>
    );
  }

  if (alreadyFeedback) {
    return (
      <FeedbackBox>
        <div className="flex flex-col items-center mb-4">
          <div className="text-blue-700 text-center text-xl font-bold mt-2">{defaultTitleTop}</div>
          <div className="text-blue-600 text-center text-base">{defaultTitleBottom}</div>
        </div>
        <div className="mb-4 text-blue-700 font-semibold text-center">
          You have already submitted feedback. You cannot submit again.
        </div>
        <button
          onClick={handleBack}
          className="mt-4 px-6 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-semibold border border-blue-200 transition"
        >
          Back
        </button>
      </FeedbackBox>
    );
  }

  if (submitted) {
    return (
      <FeedbackBox>
        <div className="flex flex-col items-center mb-4">
          <div className="text-blue-700 text-center text-xl font-bold mt-2">{defaultTitleTop}</div>
          <div className="text-blue-600 text-center text-base">{defaultTitleBottom}</div>
        </div>
        <div className="flex flex-col items-center justify-center text-blue-700 text-lg font-semibold">
          Thank you for your feedback!
          <button
            onClick={handleBack}
            className="mt-6 px-6 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-semibold border border-blue-200 transition"
          >
            Back
          </button>
        </div>
      </FeedbackBox>
    );
  }

  return (
    <FeedbackBox>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          {/* Ẩn label Content */}
          <textarea
            name="content"
            value={form.content}
            required
            onChange={handleChange}
            placeholder="Enter your feedback"
            rows={5}
            className="w-full px-3 py-2 border border-blue-200 rounded bg-blue-50 focus:outline-none focus:border-blue-400 text-blue-900 resize-none"
            style={{ minHeight: 120, maxHeight: 200 }}
          />
        </div>
        <div>
          {/* Ẩn label Rating */}
          <div className="flex items-center space-x-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                aria-label={`Rate ${star} star`}
                onClick={() => handleStarClick(star)}
                className="focus:outline-none"
                tabIndex={0}
              >
                <svg
                  className={`w-7 h-7 ${
                    star <= form.rating ? "text-blue-500" : "text-blue-100"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.184c.969 0 1.371 1.24.588 1.81l-3.388 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.389-2.462a1 1 0 00-1.176 0l-3.389 2.462c-.784.57-1.838-.197-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.05 9.401c-.783-.57-.38-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.974z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-blue-600">{form.rating} / 5</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="ml-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-medium border border-blue-200 transition"
          >
            Back
          </button>
        </div>
        {error && <div className="text-red-600 text-center mt-2">{error}</div>}
      </form>
    </FeedbackBox>
  );
};

export default FeedbackPage;