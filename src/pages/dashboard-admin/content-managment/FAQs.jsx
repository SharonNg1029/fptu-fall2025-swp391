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
  message,
  Tooltip,
  Popconfirm,
  Card,
  Switch,
  Select,
  Row,
  Col,
  Statistic,
  Collapse,
} from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  SortAscendingOutlined,
  EyeOutlined,
  UpOutlined,
  DownOutlined,
  ReloadOutlined,
} from "@ant-design/icons"
import api from "../../../configs/axios"

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { Panel } = Collapse

const FAQs = () => {
  const [loading, setLoading] = useState(true)
  const [faqs, setFaqs] = useState([])
  const [searchText, setSearchText] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [form] = Form.useForm()
  const [categoryFilter, setCategoryFilter] = useState("")
  const [previewMode, setPreviewMode] = useState(false)

  // Fetch FAQs data from API
  const fetchFaqs = async () => {
    try {
      setLoading(true)
      const response = await api.get("/admin/faqs")
      console.log("FAQs response:", response)

      const faqsData = response.data?.data || response.data || []
      setFaqs(faqsData)
    } catch (error) {
      console.error("Error fetching FAQs:", error)
      message.error("Failed to fetch FAQs: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  // Handle FAQ edit
  const handleEdit = (record) => {
    setEditingFaq(record)
    form.setFieldsValue({
      question: record.question,
      answer: record.answer,
      category: record.category,
      isActive: record.isActive,
      sortOrder: record.sortOrder,
    })
    setIsModalVisible(true)
  }

  // Handle FAQ delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/faqs/${id}`)
      message.success("FAQ deleted successfully")
      fetchFaqs() // Refresh the list
    } catch (error) {
      console.error("Error deleting FAQ:", error)
      message.error("Failed to delete FAQ: " + (error.response?.data?.message || error.message))
    }
  }

  // Handle form submission
  const handleFormSubmit = async (values) => {
    try {
      const faqData = {
        question: values.question,
        answer: values.answer,
        category: values.category,
        isActive: values.isActive,
        sortOrder: values.sortOrder,
      }

      if (editingFaq) {
        // Update existing FAQ
        await api.put(`/admin/faqs/${editingFaq.id}`, faqData)
        message.success("FAQ updated successfully")
      } else {
        // Create new FAQ
        await api.post("/admin/faqs", faqData)
        message.success("FAQ created successfully")
      }

      setIsModalVisible(false)
      form.resetFields()
      setEditingFaq(null)
      fetchFaqs() // Refresh the list
    } catch (error) {
      console.error("Error saving FAQ:", error)
      message.error("Failed to save FAQ: " + (error.response?.data?.message || error.message))
    }
  }

  // Handle sort order change
  const handleMoveUp = async (id) => {
    try {
      await api.put(`/admin/faqs/${id}/move-up`)
      message.success("FAQ moved up successfully")
      fetchFaqs() // Refresh the list
    } catch (error) {
      console.error("Error moving FAQ up:", error)
      message.error("Failed to move FAQ up: " + (error.response?.data?.message || error.message))
    }
  }

  const handleMoveDown = async (id) => {
    try {
      await api.put(`/admin/faqs/${id}/move-down`)
      message.success("FAQ moved down successfully")
      fetchFaqs() // Refresh the list
    } catch (error) {
      console.error("Error moving FAQ down:", error)
      message.error("Failed to move FAQ down: " + (error.response?.data?.message || error.message))
    }
  }

  // Filter FAQs based on search text and category
  const filteredFaqs = faqs
    .filter((faq) => {
      const matchesSearch =
        faq.question?.toLowerCase().includes(searchText.toLowerCase()) ||
        faq.answer?.toLowerCase().includes(searchText.toLowerCase()) ||
        faq.category?.toLowerCase().includes(searchText.toLowerCase())

      const matchesCategory = categoryFilter === "" || faq.category === categoryFilter

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

  // Get unique categories for filter
  const categories = [...new Set(faqs.map((faq) => faq.category).filter(Boolean))]

  // Calculate statistics
  const stats = {
    total: faqs.length,
    active: faqs.filter((faq) => faq.isActive).length,
    inactive: faqs.filter((faq) => !faq.isActive).length,
    categories: categories.length,
    totalViews: faqs.reduce((sum, faq) => sum + (faq.views || 0), 0),
  }

  // FAQ table columns
  const columns = [
    {
      title: "Order",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 80,
      render: (sortOrder) => <Text strong>{sortOrder || 0}</Text>,
    },
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      render: (text) => (
        <Space>
          <QuestionCircleOutlined />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category || "Uncategorized"}</Tag>,
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>,
      width: 100,
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      width: 100,
      render: (views) => views || 0,
      sorter: (a, b) => (a.views || 0) - (b.views || 0),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record, index) => (
        <Space size="small">
          <Tooltip title="Move Up">
            <Button
              type="default"
              icon={<UpOutlined />}
              size="small"
              onClick={() => handleMoveUp(record.id)}
              disabled={index === 0}
            />
          </Tooltip>

          <Tooltip title="Move Down">
            <Button
              type="default"
              icon={<DownOutlined />}
              size="small"
              onClick={() => handleMoveDown(record.id)}
              disabled={index === filteredFaqs.length - 1}
            />
          </Tooltip>

          <Tooltip title="Edit">
            <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          </Tooltip>

          <Popconfirm
            title="Are you sure you want to delete this FAQ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={2}>Frequently Asked Questions</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchFaqs} loading={loading}>
            Refresh
          </Button>
          <Button
            type={previewMode ? "default" : "primary"}
            icon={<EyeOutlined />}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? "Exit Preview" : "Preview Mode"}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingFaq(null)
              form.resetFields()
              setIsModalVisible(true)
            }}
          >
            Add New FAQ
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total FAQs" value={stats.total} prefix={<QuestionCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active FAQs"
              value={stats.active}
              valueStyle={{ color: "#52c41a" }}
              prefix={<QuestionCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Categories" value={stats.categories} prefix={<SortAscendingOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Views" value={stats.totalViews} prefix={<EyeOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={8}>
            <Input
              placeholder="Search FAQs..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Select
              placeholder="Filter by category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: "100%" }}
              allowClear
            >
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {previewMode ? (
        // Preview Mode - Show FAQs as they would appear on the website
        <Card title="FAQ Preview" style={{ marginBottom: 16 }}>
          <Collapse accordion>
            {filteredFaqs
              .filter((faq) => faq.isActive)
              .map((faq) => (
                <Panel header={faq.question} key={faq.id}>
                  <p>{faq.answer}</p>
                  <div style={{ marginTop: 8 }}>
                    <Tag color="blue">{faq.category || "Uncategorized"}</Tag>
                  </div>
                </Panel>
              ))}
          </Collapse>
        </Card>
      ) : (
        // Management Mode - Show FAQs in a table
        <Card>
          <Table
            loading={loading}
            columns={columns}
            dataSource={filteredFaqs}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} FAQs`,
            }}
            expandable={{
              expandedRowRender: (record) => (
                <div>
                  <Text strong>Answer:</Text>
                  <p style={{ margin: "8px 0" }}>{record.answer}</p>
                </div>
              ),
            }}
          />
        </Card>
      )}

      {/* Create/Edit FAQ Modal */}
      <Modal
        title={editingFaq ? "Edit FAQ" : "Add New FAQ"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
          setEditingFaq(null)
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            isActive: true,
            sortOrder: faqs.length + 1,
          }}
        >
          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true, message: "Please enter the question" }]}
          >
            <Input placeholder="Enter the question" />
          </Form.Item>

          <Form.Item name="answer" label="Answer" rules={[{ required: true, message: "Please enter the answer" }]}>
            <TextArea rows={6} placeholder="Enter the answer" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Please enter a category" }]}
              >
                <Select placeholder="Select or enter category" mode="combobox">
                  {categories.map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sortOrder"
                label="Sort Order"
                rules={[{ required: true, message: "Please enter order" }]}
              >
                <Input type="number" placeholder="Enter sort order" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="isActive" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large">
                {editingFaq ? "Update FAQ" : "Add FAQ"}
              </Button>
              <Button
                size="large"
                onClick={() => {
                  setIsModalVisible(false)
                  form.resetFields()
                  setEditingFaq(null)
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FAQs
