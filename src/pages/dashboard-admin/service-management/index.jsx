"use client"

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
} from "@ant-design/icons"

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

  // Fetch services data
  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          name: "Paternity DNA Test",
          type: "Relationship",
          cost: 199.99,
          estimatedTime: "3-5 days",
          instruction: "Collect cheek swab samples from all participants using the provided collection kit.",
          description: "Determines biological relationship between alleged father and child with 99.9% accuracy.",
          popularity: 85,
          monthlyOrders: 45,
        },
        {
          id: 2,
          name: "Maternity DNA Test",
          type: "Relationship",
          cost: 199.99,
          estimatedTime: "3-5 days",
          instruction: "Collect cheek swab samples from all participants using the provided collection kit.",
          description: "Confirms biological relationship between alleged mother and child.",
          popularity: 65,
          monthlyOrders: 25,
        },
        {
          id: 3,
          name: "Sibling DNA Test",
          type: "Relationship",
          cost: 249.99,
          estimatedTime: "5-7 days",
          instruction: "Collect cheek swab samples from all participants. Additional samples may be required.",
          description: "Determines if two individuals share one or both biological parents.",
          popularity: 45,
          monthlyOrders: 15,
        },
        {
          id: 4,
          name: "Ancestry DNA Test",
          type: "Ancestry",
          cost: 149.99,
          estimatedTime: "14-21 days",
          instruction:
            "Collect saliva sample using the provided collection tube. Do not eat or drink 30 minutes before collection.",
          description: "Reveals ethnic background and geographical origins of your ancestors.",
          popularity: 75,
          monthlyOrders: 56,
        },
        {
          id: 5,
          name: "Prenatal DNA Test",
          type: "Medical",
          cost: 599.99,
          estimatedTime: "7-10 days",
          instruction:
            "Blood sample required from mother (after 9 weeks of pregnancy). Cheek swab from alleged father.",
          description: "Non-invasive prenatal paternity test with 99.9% accuracy.",
          popularity: 30,
          monthlyOrders: 8,
        },
      ]
      setServices(mockData)
      setLoading(false)
    }, 1000)
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
  const handleEditSubmit = (values) => {
    setServices(
      services.map((service) =>
        service.id === editingService.id
          ? {
              ...service,
              name: values.name,
              type: values.type,
              cost: values.cost,
              estimatedTime: values.estimatedTime,
              instruction: values.instruction,
              description: values.description,
            }
          : service,
      ),
    )
    message.success("Service updated successfully")
    setIsEditModalVisible(false)
    editForm.resetFields()
    setEditingService(null)
  }

  // Handle pricing update
  const handlePricingUpdate = (values) => {
    setServices(
      services.map((service) => (service.id === selectedService.id ? { ...service, cost: values.cost } : service)),
    )
    message.success("Pricing updated successfully")
    setIsPricingModalVisible(false)
    pricingForm.resetFields()
    setSelectedService(null)
  }

  // Filter services based on search text
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchText.toLowerCase()) ||
      service.type.toLowerCase().includes(searchText.toLowerCase()) ||
      service.description.toLowerCase().includes(searchText.toLowerCase()),
  )

  // Calculate statistics
  const stats = {
    totalServices: services.length,
    totalRevenue: services.reduce((sum, service) => sum + service.cost * service.monthlyOrders, 0),
    totalOrders: services.reduce((sum, service) => sum + service.monthlyOrders, 0),
    avgPrice: services.reduce((sum, service) => sum + service.cost, 0) / services.length,
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
      render: (cost) => `$${cost.toFixed(2)}`,
      sorter: (a, b) => a.cost - b.cost,
    },
    {
      title: "Estimated Time",
      dataIndex: "estimatedTime",
      key: "estimatedTime",      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          {time}
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
          {orders}
        </Space>
      ),
      sorter: (a, b) => a.monthlyOrders - b.monthlyOrders,
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
          ${cost.toFixed(2)}
        </Text>
      ),
      sorter: (a, b) => a.cost - b.cost,
    },
    {
      title: "Monthly Orders",
      dataIndex: "monthlyOrders",
      key: "monthlyOrders",
      render: (orders) => `${orders} orders`,
    },
    {
      title: "Monthly Revenue",
      key: "revenue",
      render: (_, record) => `$${(record.cost * record.monthlyOrders).toFixed(2)}`,
      sorter: (a, b) => a.cost * a.monthlyOrders - b.cost * b.monthlyOrders,
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
        <Input
          placeholder="Search services..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
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
                      <Descriptions.Item label="Description">{record.description}</Descriptions.Item>
                      <Descriptions.Item label="Instructions">
                        <Space>
                          <FileTextOutlined />
                          {record.instruction}
                        </Space>
                      </Descriptions.Item>
                      <Descriptions.Item label="Popularity">{record.popularity}%</Descriptions.Item>
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
        title="Edit Service Information"
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
                Update Service
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
              <Text style={{ fontSize: "18px", color: "#1890ff" }}>${selectedService.cost.toFixed(2)}</Text>
            </Form.Item>

            <Form.Item label="Monthly Orders">
              <Text>{selectedService.monthlyOrders} orders</Text>
            </Form.Item>

            <Form.Item label="Current Monthly Revenue">
              <Text style={{ fontSize: "16px", color: "#52c41a" }}>
                ${(selectedService.cost * selectedService.monthlyOrders).toFixed(2)}
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
