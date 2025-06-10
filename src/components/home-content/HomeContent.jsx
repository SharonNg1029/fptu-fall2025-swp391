import React from "react";

const HomeContent = () => {
  return (
    <div className="pt-[80px] bg-white min-h-screen">
      {/* Hero Section */}
      <div
        className="relative w-full h-[340px] md:h-[420px] bg-no-repeat bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/body-background.jpg')" }}
      >
        <div className="text-center px-2">
          <h1
            className="text-white text-3xl md:text-5xl font-bold mb-4"
            style={{
              textShadow:
                "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000",
            }}
          >
            Genetix – Your Trusted Partner in DNA Testing
          </h1>
          <p
            className="text-white text-lg md:text-xl font-medium"
            style={{
              textShadow:
                "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
            }}
          >
            Easy home collection, secure payments, and total privacy guaranteed.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="w-full flex justify-center items-center px-2">
        <div className="bg-[#4077AA] rounded-3xl shadow-2xl border-2 border-blue-200 max-w-5xl w-full px-4 md:px-12 py-10 flex flex-col md:flex-row gap-8 md:gap-16 items-center mt-8">
          {/* Logo & About */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
            <img
              src="/images/logo.png"
              alt="DNA Testing Services"
              className="h-16 md:h-20 w-auto mb-4"
              onError={e => {
                e.target.onerror = null;
                e.target.src = '/images/fallback-logo.png';
              }}
            />
            <h2 className="text-2xl font-bold text-white mb-2"
              style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000' }}>
              About Genetix Medical Mechanism
            </h2>
            <p className="text-base text-blue-50 leading-relaxed">
              Genetix is a leading professional medical facility in the field of DNA testing, with over 8 years of experience and commitment to delivering high quality services, absolute security and 99.9% accuracy.
            </p>
          </div>
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-1/2 ">
            <div className="bg-white rounded-lg shadow text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-100 py-5 px-2">
              <div className="text-xl font-bold text-bg-red-200">8+</div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Years of Experience</p>
            </div>
            <div className="bg-white rounded-lg shadow text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-100 py-5 px-2">
              <div className="text-xl font-bold text-blue-600 mb-1">5000+</div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Tests Completed</p>
            </div>
            <div className="bg-white rounded-lg shadow text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-100 py-5 px-2">
              <div className="text-xl font-bold text-blue-600 mb-1">99.9%</div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Accuracy</p>
            </div>
            <div className="bg-white rounded-lg shadow text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-100 py-5 px-2">
              <div className="text-xl font-bold text-blue-600 mb-1">24/7</div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Consulting Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* DNA Testing Process */}
      <div className="py-12 px-2 bg-gray-50 flex items-center justify-center">
        <div className="max-w-6xl w-full mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              DNA Testing Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, fast and secure process
            </p>
          </div>
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gray-300 z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4 shadow-lg">
                  1
                </div>
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow mb-4 border-4 border-gray-100">
                  <svg className="w-7 h-7 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  Register & Schedule
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Choose testing service and schedule online or via hotline
                </p>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4 shadow-lg">
                  2
                </div>
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow mb-4 border-4 border-gray-100">
                  <svg className="w-7 h-7 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.71,4.63L19.37,3.29C19,2.9 18.35,2.9 17.96,3.29L9,12.25L11.75,15L20.71,6.04C21.1,5.65 21.1,5 20.71,4.63M7,14A3,3 0 0,0 4,17C4,18.31 2.84,19 2,19C2.92,20.22 4.5,21 6,21A4,4 0 0,0 10,17A3,3 0 0,0 7,14Z"/>
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  Sample Collection
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Collect samples at medical facility or self-collect at home with kit
                </p>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4 shadow-lg">
                  3
                </div>
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow mb-4 border-4 border-gray-100">
                  <svg className="w-7 h-7 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  Laboratory Testing
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Samples analyzed by experts with modern equipment
                </p>
              </div>
              {/* Step 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4 shadow-lg">
                  4
                </div>
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow mb-4 border-4 border-gray-100">
                  <svg className="w-7 h-7 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M16,11H8V13H16V11M16,15H8V17H16V15"/>
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  Receive Results
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Receive results via email or directly at medical facility
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;