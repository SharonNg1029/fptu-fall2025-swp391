import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Tag,
  Input,
  Row,
  Col,
  Card,
  Space,
  Button,
  Empty,
  Modal,
  Descriptions,
  Select,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import api from "../../configs/axios";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Option } = Select;

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [serviceFilter, setServiceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const statusList = [
  "Waiting confirmed",
  "Booking confirmed",
  "Awaiting Sample",
  "In Progress",
  "Ready",
  "Pending Payment",
  "Completed",
  "Cancel",
  ];

  const serviceMap = {
  SNL001: "Paternity DNA Test",
  SNL002: "Bloodline DNA Test",
  SNL003: "Maternity DNA Test",
  };

  const user = useSelector((state) => state.user.currentUser);
  const { customerID } = useSelector(state => state.user);
  useEffect(() => {
    fetchMyBookings();
  }, [user?.id]);

  const fetchMyBookings = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
        const res = await api.get(`/booking/my-bookings/${customerID}`);
        console.log("Full API response:", res);
        console.log("res.data:", res.data);
        console.log("res.data.data:", res.data?.data);
        setBookings(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch your bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (record) => {
    setSelectedBooking(record);
    setShowModal(true);
  };

  const getStatusTag = (status) => {
    let color = "default";
    let icon = <ClockCircleOutlined />;
    if (status === "Waiting confirmed") color = "gold";
    else if (status === "Booking confirmed") {
      color = "blue";
      icon = <CheckCircleOutlined />;
    } else if (status === "Awaiting Sample") {
      color = "purple";
      icon = <LoadingOutlined />;
    } else if (status === "In Progress") {
      color = "cyan";
      icon = <LoadingOutlined />;
    } else if (status === "Ready") {
      color = "lime";
      icon = <CheckCircleOutlined />;
    } else if (status === "Pending Payment") {
      color = "orange";
      icon = <ExclamationCircleOutlined />;
    } else if (status === "Completed") {
      color = "green";
      icon = <CheckCircleOutlined />;
    } else if (status === "Cancel") {
      color = "red";
      icon = <ExclamationCircleOutlined />;
    }
    return (
      <Tag icon={icon} color={color} style={{ fontWeight: 500 }}>
        {status}
      </Tag>
    );
  };

  const columns = [
  { title: "Booking ID", dataIndex: "bookingId", key: "bookingId" },
  {
    title: "Service ID",
    dataIndex: "serviceID",
    key: "serviceID",
    render: (text) => text || "N/A",
  },
  {
    title: "Appointment Date",
    dataIndex: "appointmentTime",
    key: "appointmentTime",
    render: (appointmentTime) => {
      if (Array.isArray(appointmentTime) && appointmentTime.length === 3) {
        const [year, month, day] = appointmentTime;
        return `${day.toString().padStart(2, "0")}/${month
          .toString()
          .padStart(2, "0")}/${year}`;
      }
      return "N/A";
    },
  },
  {
    title: "Time Slot",
    dataIndex: "timeRange",
    key: "timeRange",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: getStatusTag,
  },
  {
    title: "Payment Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
  },
  {
    title: "Total Cost",
    dataIndex: "totalCost",
    key: "totalCost",
    render: (cost) =>
      cost != null
        ? cost.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VNĐ"
        : "",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Button
        icon={<EyeOutlined />}
        onClick={() => handleViewDetail(record)}
      >
        View
      </Button>
    ),
  },
];


  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingId?.toString().includes(searchText) ||
      booking.serviceID?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.status?.toLowerCase().includes(searchText.toLowerCase());
    const matchesService = serviceFilter ? booking.serviceID === serviceFilter : true;
    const matchesStatus = statusFilter ? booking.status === statusFilter : true;
    return matchesSearch && matchesService && matchesStatus;
  });

  const uniqueServices = [...new Set(bookings.map((b) => b.serviceID))];

  return (
    <div>
      <div className="bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-bold">DNA Testing Booking</h1>
        <p className="text-blue-100">My Booking</p>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search bookings..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="Filter by service"
              value={serviceFilter || undefined}
              onChange={(val) => setServiceFilter(val)}
              allowClear
              style={{ width: "100%" }}
              size="large"
            >
              {uniqueServices.map((s) => (
                <Option key={s} value={s}>{s}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={6}>
            <Select
            placeholder="Filter by status"
            allowClear
            onChange={(value) => setStatusFilter(value)}
            style={{ minWidth: 180 }}
            >
            {statusList.map((status) => (
                <Option key={status} value={status}>
                {status}
                </Option>
            ))}
            </Select>
          </Col>
          <Col>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchMyBookings}
              type="primary"
              loading={loading}
              size="large"
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="bookingId"
          loading={loading}
          bordered
          scroll={{ x: true }}
          locale={{ emptyText: <Empty description="No bookings found" /> }}
          pagination={{ pageSize: 6 }}
        />
      </Card>

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={800}
        title={`Chi tiết lịch hẹn: #${selectedBooking?.bookingId}`}
      >
        {selectedBooking && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Service">
              {selectedBooking.serviceID || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Appointment">
              {Array.isArray(selectedBooking.appointmentTime)
                ? selectedBooking.appointmentTime.reverse().join("/")
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {getStatusTag(selectedBooking.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Total Cost">
              {selectedBooking.totalCost?.toLocaleString("vi-VN")} VNĐ
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              {selectedBooking.paymentMethod || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Note">
              {selectedBooking.note || "Không có ghi chú"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default MyBooking;
