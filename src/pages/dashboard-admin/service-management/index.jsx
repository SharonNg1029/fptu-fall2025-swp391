import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Typography,
  Tag,
  Modal,
  Form,
  InputNumber,
  message,
  Tooltip,
  Card,
  Descriptions,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  BarChartOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ServiceManagement = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editForm] = Form.useForm();

  // Fetch services data from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/services");
      console.log("Services response:", response);

      const servicesData = response.data?.data || response.data || [];
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error);
      message.error(
        "Failed to fetch services: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services based on search text
  const filteredServices = services.filter(
    (service) =>
      service.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      service.type?.toLowerCase().includes(searchText.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    totalServices: services.length,
    totalRevenue: services.reduce(
      (sum, service) => sum + service.cost * (service.monthlyOrders || 0),
      0
    ),
    totalOrders: services.reduce(
      (sum, service) => sum + (service.monthlyOrders || 0),
      0
    ),
    avgPrice:
      services.length > 0
        ? services.reduce((sum, service) => sum + service.cost, 0) /
          services.length
        : 0,
  };

  // Service table columns
  const serviceColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 60,
    },
    {
      title: "Service Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <MedicineBoxOutlined />
          {text}
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = "blue";
        if (type === "Relationship") color = "green";
        if (type === "Ancestry") color = "purple";
        if (type === "Medical") color = "orange";
        return <Tag color={color}>{type}</Tag>;
      },
      filters: [
        { text: "Relationship", value: "Relationship" },
        { text: "Ancestry", value: "Ancestry" },
        { text: "Medical", value: "Medical" },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Price",
      dataIndex: "cost",
      key: "cost",
      render: (cost) => `$${cost?.toFixed(2) || "0.00"}`,
      sorter: (a, b) => (a.cost || 0) - (b.cost || 0),
    },
    {
      title: "Estimated Time",
      dataIndex: "estimatedTime",
      key: "estimatedTime",
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          {time || "N/A"}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Price">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setEditingService(record);
                setIsEditModalVisible(true);
                editForm.setFieldsValue({
                  name: record.name,
                  type: record.type,
                  cost: record.cost,
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Service Management</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Services"
              value={stats.totalServices}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Monthly Revenue"
              value={stats.totalRevenue}
              precision={2}
              prefix="$"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Monthly Orders"
              value={stats.totalOrders}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Average Price"
              value={stats.avgPrice}
              precision={2}
              prefix="$"
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}>
        <Input
          placeholder="Search services..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchServices}
          style={{ marginRight: 8 }}>
          Refresh
        </Button>
      </div>
      <Table
        columns={serviceColumns}
        dataSource={filteredServices}
        loading={loading}
        rowKey="id"
        bordered
      />
      {/* Modal chỉnh sửa giá */}
      <Modal
        title={
          editingService
            ? `Edit Price for: ${editingService.name}`
            : "Edit Price"
        }
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingService(null);
          editForm.resetFields();
        }}
        onOk={() => editForm.submit()}
        okText="Save"
        cancelText="Cancel">
        <Form
          form={editForm}
          layout="vertical"
          onFinish={async (values) => {
            try {
              await api.put(`/admin/services/${editingService.id}/pricing`, {
                cost: values.cost,
              });
              message.success("Service price updated successfully");
              setIsEditModalVisible(false);
              setEditingService(null);
              editForm.resetFields();
              fetchServices();
            } catch (error) {
              message.error(
                "Failed to update price: " +
                  (error.response?.data?.message || error.message)
              );
            }
          }}
          initialValues={{ cost: editingService?.cost }}>
          <Form.Item
            label="Service Name"
            name="name"
            initialValue={editingService?.name}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            initialValue={editingService?.type}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Cost ($)"
            name="cost"
            rules={[
              { required: true, message: "Please input the service cost!" },
            ]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;
