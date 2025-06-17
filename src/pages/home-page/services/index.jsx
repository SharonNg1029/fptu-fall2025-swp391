import React from "react";
import { Link } from "react-router-dom";

const ServicesOverview = () => {
  const services = [
    {
      id: 1,
      title: "Non-Legal DNA Testing",
      subtitle: "As a form of DNA testing, it is used to determine the blood relationship between individuals and serve personal and family purposes.",
      description:
        "Non-Legal DNA Testing is used to determine the biological relationship between individuals, such as parent-child or grandparent-grandchild relationships. At GENTIS International Testing Center, we ensure accuracy and confidentiality.",
      price: "Starting from 3,500,000 VND",
      turnaround: "2-7 working days",
      link: "/services/non-legal",
    },
    {
      id: 2,
      title: "Legal DNA Testing",
      subtitle: "As a legally binding and administrative form of DNA testing",
      description:
        "Legal DNA Testing is conducted under strict procedures, and the results are legally valid to resolve issues related to inheritance, divorce, and child custody.",
      price: "Starting from 4,500,000 VND",
      turnaround: "3-7 working days",
      link: "/services/legal",
    },
  ];

  const sampleTypes = [
    {
      id: 1,
      name: "Nail",
      image: "https://gentis.vn/wp-content/uploads/2021/01/ban-da-biet-quy-trinh-xet-nghiem-adn-chua-1.jpg",
    },
    {
      id: 2,
      name: "Hair roots",
      image: "https://medlatec.vn/media/13792/content/20200917_xet-nghiem-adn-bang-toc-01.jpg",
    },
    {
      id: 3,
      name: "Oral mucosa",
      image: "https://gentis.com.vn/public/media/tin-tuc/2022/t5/xet-nghiem-adn-bang-niem-mac-mieng.jpg",
    },
    {
      id: 4,
      name: "Blood sample",
      image: "https://gentis.vn/wp-content/uploads/2021/05/Cach-lay-mau-xet-nghiem-ADn-tai-nha-641x400.jpg",
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div
        className="relative text-white py-20 mt-10"
        style={{ backgroundColor: "#003469" }}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            DNA Testing
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            DNA testing is a test that analyzes DNA information on 23 pairs of chromosomes of two or more human individuals to determine a genetic relationship from which to determine a lineage relationship. This is the current exact method of determination.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ 99.9% Accuracy</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Multiple Test Types</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Fast Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Types of DNA Testing Services
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col h-full"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-blue-600 mb-3">
                      {service.title}
                    </h3>
                    
                    {/* ✅ THÊM THANH NGANG NGĂN CÁCH */}
                    <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 mb-3"></div>
                    
                    <div className="min-h-[3rem] mb-3">
                      <p className="text-sm font-medium text-gray-700 italic leading-relaxed">
                        {service.subtitle}
                      </p>
                    </div>
                    <div className="min-h-[4.5rem] mb-4">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="text-lg font-bold text-gray-900">
                      {service.price}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {service.turnaround}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 mt-auto">
                  <Link
                    to={service.link}
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    View Details
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sample Types Section */}
      <div className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sample Types for Testing
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {sampleTypes.map((sample) => (
              <div
                key={sample.id}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={sample.image}
                    alt={sample.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center hidden">
                    <span className="text-white text-xl font-bold">
                      {sample.name[0]}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {sample.name}
                </h3>

                <p className="text-sm text-gray-600">
                  {sample.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesOverview;