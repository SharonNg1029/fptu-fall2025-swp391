import React, { useState } from "react";
import { FaDna, FaPhone, FaEnvelope, FaClock, FaCheck } from "react-icons/fa";
import { Card, Button, Row, Col, Modal, Typography, Tag } from "antd";

const { Title, Text } = Typography;

const Pricing = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Helper function to format price to VND
  const formatToVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price * 23000);
  };

  const services = {
    nonLegal: [
      {
        name: "Paternity DNA Test",
        type: "Non-Legal",
        processingTime: "3-5 business days",
        basePrice: 199,
        expressPrice: 299,
      },
      {
        name: "Ancestry DNA Test",
        type: "Non-Legal",
        processingTime: "7-10 business days",
        basePrice: 249,
        expressPrice: 349,
      },
    ],
    legal: [
      {
        name: "Legal Paternity Test",
        type: "Legal",
        processingTime: "5-7 business days",
        basePrice: 399,
        expressPrice: 499,
      },
      {
        name: "Immigration DNA Test",
        type: "Legal",
        processingTime: "7-10 business days",
        basePrice: 449,
        expressPrice: 549,
      },
    ],
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
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="bg-primary py-8 text-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <FaDna className="text-4xl text-white mr-2" />
            <h1 className="text-3xl font-bold text-white">Genetix Bloodline</h1>
          </div>
          <h2 className="text-xl text-white">DNA Testing Services</h2>
          <p className="text-white mt-4 max-w-2xl mx-auto">
            Welcome to Genetix Bloodline - Your trusted partner for
            comprehensive DNA testing solutions. We offer both legal and
            non-legal DNA testing services with professional accuracy and
            confidentiality.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Non-Legal Services */}
        <div className="mb-12">
          <Title level={2} className="mb-6 text-foreground">
            Non-Legal DNA Testing
          </Title>
          <Row gutter={[24, 24]}>
            {services.nonLegal.map((service, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <Card
                  hoverable
                  className="shadow-lg"
                  title={<span className="font-semibold">{service.name}</span>}
                  extra={<Tag color="blue">{service.type}</Tag>}
                  onClick={() => openModal(service)}
                  style={{ cursor: "pointer" }}>
                  <p className="mb-2">
                    <FaClock className="inline mr-2" />
                    {service.processingTime}
                  </p>
                  <Text strong className="text-primary">
                    {formatToVND(service.basePrice)}
                  </Text>
                  <div className="mt-4">
                    <Button
                      type="primary"
                      block
                      onClick={() => openModal(service)}>
                      Xem chi tiết
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Legal Services */}
        <div className="mb-12">
          <Title level={2} className="mb-6 text-foreground">
            Legal DNA Testing
          </Title>
          <Row gutter={[24, 24]}>
            {services.legal.map((service, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <Card
                  hoverable
                  className="shadow-lg"
                  title={<span className="font-semibold">{service.name}</span>}
                  extra={<Tag color="red">{service.type}</Tag>}
                  onClick={() => openModal(service)}
                  style={{ cursor: "pointer" }}>
                  <p className="mb-2">
                    <FaClock className="inline mr-2" />
                    {service.processingTime}
                  </p>
                  <Text strong className="text-primary">
                    {formatToVND(service.basePrice)}
                  </Text>
                  <div className="mt-4">
                    <Button
                      type="primary"
                      block
                      onClick={() => openModal(service)}>
                      Xem chi tiết
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Contact Information */}
        <section className="mt-12 bg-white p-8 rounded-lg shadow-lg">
          <Title level={2} className="mb-6 text-center text-foreground">
            Contact Us
          </Title>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <FaPhone className="text-primary text-xl" />
              <p className="text-lg">Hotline: +84 901 452 366</p>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-primary text-xl" />
              <p className="text-lg">
                Email Support: genetixcontactsp@gmail.com
              </p>
            </div>
          </div>
        </section>

        {/* Service Modal */}
        <Modal
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
          title={selectedService?.name}>
          {selectedService && (
            <div>
              <p>
                <FaClock className="inline mr-2" /> Processing Time:{" "}
                {selectedService.processingTime}
              </p>
              <p>
                <FaCheck className="inline mr-2" /> Type: {selectedService.type}
              </p>
              <p className="text-lg font-semibold">
                Base Price: {formatToVND(selectedService.basePrice)}
              </p>
              <p className="text-lg font-semibold">
                Express Price: {formatToVND(selectedService.expressPrice)}
              </p>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
};

export default Pricing;
