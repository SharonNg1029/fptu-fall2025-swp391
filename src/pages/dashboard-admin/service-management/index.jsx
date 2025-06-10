import React from "react"
import { useState, useEffect } from "react"
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
  Tabs,
} from "antd"
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
} from "@ant-design/icons"
import api from "../../../configs/axios"

const { Title, Text } = Typography
const { TextArea } = Input
const { TabPane } = Tabs

const ServiceManagement = () => {
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState([])
  const [searchText, setSearchText] = useState("")
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isPricingModalVisible, setIsPricingModalVisible] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [editForm] = Form.useForm()
  const [pricingForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState("services")

  // Fetch services data from API
  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await api.get("/admin/services")
      console.log("Services response:", response)

      const servicesData = response.data?.data || response.data || []
      setServices(servicesData)
    } catch (error) {
      console.error("Error fetching services:", error)
      message.error("Failed to fetch services: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // Handle service edit
  const handleEdit = (record) => {
    setEditingService(record)
    editForm.setFieldsValue({
      name: record.name,
      type: record.type,
      cost: record.cost,
      estimatedTime: record.estimatedTime,
      instruction: record.instruction,
      description: record.description,
    })
    setIsEditModalVisible(true)
  }

  // Handle edit form submission
  const handleEditSubmit = async (values) => {
    try {
      const serviceData = {
        name: values.name,
        type: values.type,
        cost: values.cost,
        estimatedTime: values.estimatedTime,
        instruction: values.instruction,
        description: values.description,
      }

      if (editingService) {
        await api.put(`/admin/services/${editingService.id}`, serviceData)
        message.success("Service updated successfully")
      } else {
        await api.post("/admin/services", serviceData)
        message.success("Service created successfully")
      }

      setIsEditModalVisible(false)
      editForm.resetFields()
      setEditingService(null)
      fetchServices() // Refresh the list
    } catch (error) {
      console.error("Error saving service:", error)
      message.error("Failed to save service: " + (error.response?.data?.message || error.message))
    }
  }

  // Handle pricing update
  const handlePricingUpdate = async (values) => {
    try {
      await api.put(`/admin/services/${selectedService.id}/pricing`, { cost: values.cost })
      message.success("Pricing updated successfully")
      setIsPricingModalVisible(false)
      pricingForm.resetFields()
      setSelectedService(null)
      fetchServices() // Refresh the list
    } catch (error) {
      console.error("Error updating pricing:", error)
      message.error("Failed to update pricing: " + (error.response?.data?.message || error.message))
    }
  }

  // Filter services based on search text
  const filteredServices = services.filter(
    (service) =>
      service.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      service.type?.toLowerCase().includes(searchText.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchText.toLowerCase()),
  )

  // Calculate statistics
  const stats = {
    totalServices: services.length,
    totalRevenue: services.reduce((sum, service) => sum + service.cost * (service.monthlyOrders || 0), 0),
    totalOrders: services.reduce((sum, service) => sum + (service.monthlyOrders || 0), 0),
    avgPrice: services.length > 0 ? services.reduce((sum, service) => sum + service.cost, 0) / services.length : 0,
  }

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
        let color = "blue"
        if (type === "Relationship") color = "green"
        if (type === "Ancestry") color = "purple"
        if (type === "Medical") color = "orange"
        return <Tag color={color}>{type}</Tag>
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
      title: "Monthly Orders",
      dataIndex: "monthlyOrders",
      key: "monthlyOrders",
      render: (orders) => (
        <Space>
          <BarChartOutlined />
          {orders || 0}
        </Space>
      ),
      sorter: (a, b) => (a.monthlyOrders || 0) - (b.monthlyOrders || 0),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Service">
            <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          </Tooltip>

          <Tooltip title="Update Pricing">
            <Button
              type="default"
              icon={<DollarOutlined />}
              size="small"
              onClick={() => {
                setSelectedService(record)
                pricingForm.setFieldsValue({ cost: record.cost })
                setIsPricingModalVisible(true)
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  // Pricing table columns
  const pricingColumns = [
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
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = "blue"
        if (type === "Relationship") color = "green"
        if (type === "Ancestry") color = "purple"
        if (type === "Medical") color = "orange"
        return <Tag color={color}>{type}</Tag>
      },
    },
    {
      title: "Current Price",
      dataIndex: "cost",
      key: "cost",
      render: (cost) => (
        <Text strong style={{ fontSize: "16px" }}>
          ${cost?.toFixed(2) || "0.00"}
        </Text>
      ),
      sorter: (a, b) => (a.cost || 0) - (b.cost || 0),
    },
    {
      title: "Monthly Orders",
      dataIndex: "monthlyOrders",
      key: "monthlyOrders",
      render: (orders) => `${orders || 0} orders`,
    },
    {
      title: "Monthly Revenue",
      key: "revenue",
      render: (_, record) => `$${((record.cost || 0) * (record.monthlyOrders || 0)).toFixed(2)}`,
      sorter: (a, b) => (a.cost || 0) * (a.monthlyOrders || 0) - (b.cost || 0) * (b.monthlyOrders || 0),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<DollarOutlined />}
          onClick={() => {
            setSelectedService(record)
            pricingForm.setFieldsValue({ cost: record.cost })
            setIsPricingModalVisible(true)
          }}
        >
          Update Price
        </Button>
      ),
    },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={2}>Service Management</Title>
        <Space>
          <Input
            placeholder="Search services..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button icon={<ReloadOutlined />} onClick={fetchServices} loading={loading}>
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingService(null)
              editForm.resetFields()
              setIsEditModalVisible(true)
            }}
          >
            Add Service
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Services" value={stats.totalServices} prefix={<MedicineBoxOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Monthly Revenue"
              value={stats.totalRevenue}
              prefix="$"
              precision={2}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Monthly Orders"
              value={stats.totalOrders}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Price"
              value={stats.avgPrice}
              prefix="$"
              precision={2}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Service Management" key="services">
            <Table
              loading={loading}
              columns={serviceColumns}
              dataSource={filteredServices}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} services`,
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <Card style={{ margin: 0 }}>
                    <Descriptions title="Service Details" bordered column={1}>
                      <Descriptions.Item label="Description">{record.description || "N/A"}</Descriptions.Item>
                      <Descriptions.Item label="Instructions">
                        <Space>
                          <FileTextOutlined />
                          {record.instruction || "N/A"}
                        </Space>
                      </Descriptions.Item>
                      <Descriptions.Item label="Popularity">{record.popularity || 0}%</Descriptions.Item>
                    </Descriptions>
                  </Card>
                ),
              }}
            />
          </TabPane>

          <TabPane tab="Pricing Management" key="pricing">
            <Table
              loading={loading}
              columns={pricingColumns}
              dataSource={filteredServices}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} services`,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Edit Service Modal */}
      <Modal
        title={editingService ? "Edit Service Information" : "Add New Service"}
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false)
          editForm.resetFields()
          setEditingService(null)
        }}
        footer={null}
        width={800}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Service Name"
                rules={[{ required: true, message: "Please enter service name" }]}
              >
                <Input placeholder="Service Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Type" rules={[{ required: true, message: "Please enter service type" }]}>
                <Input placeholder="Service Type" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cost"
                label="Cost ($)"
                rules={[{ required: true, message: "Please enter service cost" }]}
              >
                <InputNumber min={0} step={0.01} precision={2} style={{ width: "100%" }} placeholder="Service Cost" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="estimatedTime"
                label="Estimated Time"
                rules={[{ required: true, message: "Please enter estimated time" }]}
              >
                <Input placeholder="e.g., 3-5 days" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter service description" }]}
          >
            <TextArea rows={3} placeholder="Service Description" />
          </Form.Item>

          <Form.Item
            name="instruction"
            label="Instructions"
            rules={[{ required: true, message: "Please enter service instructions" }]}
          >
            <TextArea rows={4} placeholder="Service Instructions" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large">
                {editingService ? "Update Service" : "Add Service"}
              </Button>
              <Button
                size="large"
                onClick={() => {
                  setIsEditModalVisible(false)
                  editForm.resetFields()
                  setEditingService(null)
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Pricing Modal */}
      <Modal
        title="Update Service Pricing"
        open={isPricingModalVisible}
        onCancel={() => {
          setIsPricingModalVisible(false)
          pricingForm.resetFields()
          setSelectedService(null)
        }}
        footer={null}
        width={500}
      >
        {selectedService && (
          <Form form={pricingForm} layout="vertical" onFinish={handlePricingUpdate}>
            <Form.Item label="Service">
              <Text strong style={{ fontSize: "16px" }}>
                {selectedService.name}
              </Text>
            </Form.Item>

            <Form.Item label="Service Type">
              <Tag color="blue">{selectedService.type}</Tag>
            </Form.Item>

            <Form.Item label="Current Price">
              <Text style={{ fontSize: "18px", color: "#1890ff" }}>${selectedService.cost?.toFixed(2) || "0.00"}</Text>
            </Form.Item>

            <Form.Item label="Monthly Orders">
              <Text>{selectedService.monthlyOrders || 0} orders</Text>
            </Form.Item>

            <Form.Item label="Current Monthly Revenue">
              <Text style={{ fontSize: "16px", color: "#52c41a" }}>
                ${((selectedService.cost || 0) * (selectedService.monthlyOrders || 0)).toFixed(2)}
              </Text>
            </Form.Item>

            <Form.Item
              name="cost"
              label="New Price ($)"
              rules={[{ required: true, message: "Please enter new price" }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                precision={2}
                style={{ width: "100%" }}
                placeholder="New Price"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" size="large">
                  Update Price
                </Button>
                <Button
                  size="large"
                  onClick={() => {
                    setIsPricingModalVisible(false)
                    pricingForm.resetFields()
                    setSelectedService(null)
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  )
}

export default ServiceManagement
