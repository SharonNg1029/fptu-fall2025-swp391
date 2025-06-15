import React, { useState } from "react";
import { 
  FaDna, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaCheck, 
  FaShieldAlt,
  FaHome,
  FaBuilding,
  FaMailBulk,
  FaBolt,
  FaUsers,
  FaBaby,
  FaUserCheck,
  FaSearch,
  FaBalanceScale
} from "react-icons/fa";
import { MdScience, MdVerified, MdPregnantWoman } from "react-icons/md";
import { BiDna } from "react-icons/bi";

const Pricing = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Helper function to format price to VND
  const formatToVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Service data based on your requirements
  const services = {
    nonLegal: [
      {
        id: 1,
        name: "Paternity Testing",
        type: "Non-Legal",
        processingTime: "2-3 working days",
        basePrice: 3500000,
        expressPrice: 1000000,
        icon: <FaUsers className="text-2xl" />,
        description: "Determine biological father-child relationship for personal knowledge",
        features: ["99.9% accuracy", "Home collection available", "Confidential results"]
      },
      {
        id: 2,
        name: "Maternity Testing",
        type: "Non-Legal",
        processingTime: "2-3 working days",
        basePrice: 4000000,
        expressPrice: 1000000,
        icon: <MdPregnantWoman className="text-2xl" />,
        description: "Confirm biological mother-child relationship",
        features: ["Highly accurate", "Private testing", "Fast results"]
      },
      {
        id: 3,
        name: "Full Sibling Testing",
        type: "Non-Legal",
        processingTime: "2-3 working days",
        basePrice: 3500000,
        expressPrice: 1000000,
        icon: <FaUsers className="text-2xl" />,
        description: "Determine if siblings share the same biological parents",
        features: ["Full sibling analysis", "Statistical reporting", "Detailed results"]
      },
      {
        id: 4,
        name: "Grandparentage Testing",
        type: "Non-Legal",
        processingTime: "2-3 working days",
        basePrice: 4000000,
        expressPrice: 1000000,
        icon: <FaUserCheck className="text-2xl" />,
        description: "Establish grandparent-grandchild biological relationship",
        features: ["Extended family testing", "Comprehensive analysis", "Clear reporting"]
      },
      {
        id: 5,
        name: "Extended Family Relationship Testing",
        type: "Non-Legal",
        processingTime: "2-3 working days",
        basePrice: 4000000,
        expressPrice: 1000000,
        icon: <BiDna className="text-2xl" />,
        description: "Test relationships between aunts, uncles, cousins, and other relatives",
        features: ["Multiple relationship types", "Advanced analysis", "Detailed reporting"]
      },
      {
        id: 6,
        name: "Non-Invasive Prenatal Testing (NIPT)",
        type: "Non-Legal",
        processingTime: "5-7 working days",
        basePrice: 6000000,
        expressPrice: 2000000,
        icon: <FaBaby className="text-2xl" />,
        description: "Safe prenatal paternity testing using mother's blood sample",
        features: ["No risk to baby", "Early testing available", "Highly accurate"]
      }
    ],
    legal: [
      {
        id: 7,
        name: "Forensic DNA Analysis",
        type: "Legal",
        processingTime: "3-5 working days",
        basePrice: 4500000,
        expressPrice: 1500000,
        icon: <FaSearch className="text-2xl" />,
        description: "Court-admissible DNA analysis for legal proceedings",
        features: ["Chain of custody", "Court admissible", "Legal documentation"]
      },
      {
        id: 8,
        name: "Adoption DNA Testing",
        type: "Legal",
        processingTime: "3-5 working days",
        basePrice: 4000000,
        expressPrice: 1500000,
        icon: <FaShieldAlt className="text-2xl" />,
        description: "Legal DNA testing for adoption procedures",
        features: ["Official documentation", "Legal compliance", "Witnessed collection"]
      },
      {
        id: 9,
        name: "Individual Identification Testing",
        type: "Legal",
        processingTime: "5-7 working days",
        basePrice: 4500000,
        expressPrice: 2000000,
        icon: <FaBalanceScale className="text-2xl" />,
        description: "Legal identity verification through DNA analysis",
        features: ["Identity verification", "Legal validity", "Official certification"]
      }
    ]
  };

  // Mediation methods pricing
  const mediationMethods = [
    {
      name: "Home Collection",
      price: 300000,
      icon: <FaHome className="text-xl" />,
      description: "Professional sample collection at your home"
    },
    {
      name: "At Facility",
      price: 0,
      icon: <FaBuilding className="text-xl" />,
      description: "Visit our facility for sample collection"
    },
    {
      name: "Postal Delivery",
      price: 50000,
      icon: <FaMailBulk className="text-xl" />,
      description: "Self-collection kit delivered by post"
    }
  ];

  // Get all services for filtering
  const allServices = [...services.nonLegal, ...services.legal];

  // Filter services based on selected category
  const getFilteredServices = () => {
    if (selectedCategory === "all") return allServices;
    if (selectedCategory === "non-legal") return services.nonLegal;
    if (selectedCategory === "legal") return services.legal;
    return allServices;
  };

  // Open modal with service details
  const openModal = (service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative text-white py-20" style={{ background: 'linear-gradient(135deg, #003469 0%, #1e40af 100%)' }}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <FaDna className="text-5xl text-white mr-4" />
            <h1 className="text-5xl font-bold">DNA Testing Pricing</h1>
          </div>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Transparent pricing for all our DNA testing services. Choose from legal and non-legal options 
            with express processing available for faster results.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ No Hidden Fees</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Express Options Available</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Multiple Collection Methods</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All Services
              </button>
              <button
                onClick={() => setSelectedCategory("non-legal")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === "non-legal"
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Non-Legal Testing
              </button>
              <button
                onClick={() => setSelectedCategory("legal")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === "legal"
                    ? "bg-red-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Legal Testing
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {getFilteredServices().map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Service Header */}
              <div className={`p-6 ${service.type === "Legal" ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-green-500 to-green-600"} text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {service.icon}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      service.type === "Legal" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                    }`}>
                      {service.type}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-sm opacity-90">{service.description}</p>
              </div>

              {/* Service Body */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FaClock className="text-gray-500" />
                    <span className="text-gray-600">Processing Time: {service.processingTime}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Standard Price:</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {formatToVND(service.basePrice)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2">
                        <FaBolt className="text-orange-500" />
                        <span className="font-medium text-orange-700">Express Service:</span>
                      </div>
                      <span className="text-lg font-bold text-orange-700">
                        +{formatToVND(service.expressPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FaCheck className="text-green-500 text-sm" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => openModal(service)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                    service.type === "Legal"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  View Details & Order
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Collection Methods Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Sample Collection Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mediationMethods.map((method, index) => (
              <div key={index} className="text-center p-6 rounded-xl border-2 border-gray-100 hover:border-blue-300 transition-all duration-200">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-100 rounded-full">
                    {method.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.name}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <div className="text-2xl font-bold text-blue-600">
                  {method.price === 0 ? "FREE" : formatToVND(method.price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Need Help Choosing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our experts are here to help you select the right DNA testing service for your needs.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="flex items-center gap-3">
              <FaPhone className="text-2xl" />
              <div>
                <div className="font-semibold">Hotline</div>
                <div className="text-lg">+84 901 452 366</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-2xl" />
              <div>
                <div className="font-semibold">Email Support</div>
                <div className="text-lg">genetixcontactsp@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      {modalVisible && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`p-6 ${selectedService.type === "Legal" ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-green-500 to-green-600"} text-white`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{selectedService.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedService.type === "Legal" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                  }`}>
                    {selectedService.type}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 mb-6">{selectedService.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Processing Time</h4>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-500" />
                    <span>{selectedService.processingTime}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Service Type</h4>
                  <div className="flex items-center gap-2">
                    <MdVerified className="text-blue-500" />
                    <span>{selectedService.type}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Pricing Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Standard Processing:</span>
                    <span className="text-xl font-bold">{formatToVND(selectedService.basePrice)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaBolt className="text-orange-500" />
                      <span>Express Service (additional):</span>
                    </div>
                    <span className="text-lg font-bold text-orange-700">+{formatToVND(selectedService.expressPrice)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Express Total:</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatToVND(selectedService.basePrice + selectedService.expressPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {selectedService.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <FaCheck className="text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    selectedService.type === "Legal"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  Order Standard Service
                </button>
                <button
                  className="flex-1 py-3 px-6 rounded-xl font-semibold bg-orange-600 hover:bg-orange-700 text-white transition-all duration-200"
                >
                  Order Express Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;