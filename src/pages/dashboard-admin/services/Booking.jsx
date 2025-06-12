import React, { useEffect, useState } from "react";
import { Table, Typography, Tag, message } from "antd";
import api from "../../../configs/axios";

const { Title } = Typography;

const columns = [
  { title: "Booking ID", dataIndex: "bookingID", key: "bookingID" },
  { title: "Customer ID", dataIndex: "customerID", key: "customerID" },
  { title: "Service ID", dataIndex: "serviceID", key: "serviceID" },
  { title: "Booking Type", dataIndex: "bookingType", key: "bookingType" },
  { title: "Payment Method", dataIndex: "paymentMethod", key: "paymentMethod" },
  { title: "Sample Method", dataIndex: "sampleMethod", key: "sampleMethod" },
  { title: "Request Date", dataIndex: "requestDate", key: "requestDate" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={status === "Completed" ? "green" : "blue"}>{status}</Tag>
    ),
  },
  { title: "Note", dataIndex: "note", key: "note" },
  {
    title: "Mediation Method",
    dataIndex: "mediationMethod",
    key: "mediationMethod",
  },
];

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await api.get("/booking/bookings");
        setBookings(res.data?.data || res.data || []);
      } catch {
        message.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <Title level={3}>Tracking Booking</Title>
      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="bookingID"
        loading={loading}
        bordered
      />
    </div>
  );
};

export default Booking;
