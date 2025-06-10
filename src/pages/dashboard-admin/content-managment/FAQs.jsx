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
} from "@ant-design/icons"

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

  // Fetch FAQs data
  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockFaqs = [
        {
          id: 1,
          question: "How accurate are DNA tests?",
          answer:
            "DNA tests are highly accurate, with most tests having an accuracy rate of 99.9% or higher. However, the accuracy can vary depending on the type of test and the quality of the sample provided. For paternity tests, the accuracy is typically 99.9% or higher when confirming paternity and 100% when excluding paternity.",
          isActive: true,
          category: "General",
          sortOrder: 1,
          views: 1245,
        },
        {
          id: 2,
          question: "How long does it take to get results?",
          answer:
            "Most DNA test results are available within 3-5 business days for standard tests. Express testing options can provide results in 1-2 business days for an additional fee. More complex tests like ancestry or health-related genetic testing may take 2-8 weeks to process. The timeline begins once your sample arrives at our laboratory.",
          isActive: true,
          category: "Testing Process",
          sortOrder: 2,
          views: 980,
        },
        {
          id: 3,
          question: "Can I collect samples at home?",
          answer:
            "Yes, we provide home collection kits with detailed instructions for easy sample collection. Our kits use cheek swabs which are simple, painless, and can be done in the comfort of your home. Each kit contains everything needed for proper collection and secure return shipping to our laboratory.",
          isActive: true,
          category: "Sample Collection",
          sortOrder: 3,
          views: 756,
        },
        {
          id: 4,
          question: "What types of DNA tests do you offer?",
          answer:
            "We offer a comprehensive range of DNA testing services including paternity, maternity, sibling, ancestry, and prenatal DNA testing. We also provide specialized tests for immigration purposes, legal cases, and health-related genetic screening. Each test is conducted in our accredited laboratory using the latest technology.",
          isActive: false,
          category: "Services",
          sortOrder: 4,
          views: 645,
        },
        {
          id: 5,
          question: "Are DNA tests legally admissible in court?",
          answer:
            "Yes, our legal DNA tests are court-admissible. These tests follow a strict chain of custody procedure where all participants must be properly identified, and samples are collected by an authorized professional. The entire process is documented to ensure the results can be used for legal matters such as child support, custody cases, or immigration.",
          isActive: true,
          category: "Legal",
          sortOrder: 5,
          views: 532,
        },
        {
          id: 6,
          question: "How much do DNA tests cost?",
          answer:
            "The cost of DNA tests varies depending on the type of test and turnaround time. Basic paternity tests start at $99, while more complex tests like ancestry or health screening can range from $199 to $499. Legal tests that are court-admissible have additional fees for professional collection and documentation. Please contact us for a detailed price list.",
          isActive: true,
          category: "Pricing",
          sortOrder: 6,
          views: 890,
        },
      ]

      setFaqs(mockFaqs)
      setLoading(false)
    }, 1000)
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
  const handleDelete = (id) => {
    setFaqs(faqs.filter((faq) => faq.id !== id))
    message.success("FAQ deleted successfully")
  }

  // Handle form submission
  const handleFormSubmit = (values) => {
    if (editingFaq) {
      // Update existing FAQ
      setFaqs(
        faqs.map((faq) =>
          faq.id === editingFaq.id
            ? {
                ...faq,
                question: values.question,
                answer: values.answer,
                category: values.category,
                isActive: values.isActive,
                sortOrder: values.sortOrder,
              }
            : faq,
        ),
      )
      message.success("FAQ updated successfully")
    } else {
      // Create new FAQ
      const newFaq = {
        id: faqs.length + 1,
        question: values.question,
        answer: values.answer,
        category: values.category,
        isActive: values.isActive,
        sortOrder: values.sortOrder || faqs.length + 1,
        views: 0,
      }
      setFaqs([...faqs, newFaq])
      message.success("FAQ created successfully")
    }
    setIsModalVisible(false)
    form.resetFields()
    setEditingFaq(null)
  }

  // Handle sort order change
  const handleMoveUp = (id) => {
    const index = faqs.findIndex((faq) => faq.id === id)
    if (index > 0) {
      const newFaqs = [...faqs]
      const currentSortOrder = newFaqs[index].sortOrder
      newFaqs[index].sortOrder = newFaqs[index - 1].sortOrder
      newFaqs[index - 1].sortOrder = currentSortOrder
      setFaqs(newFaqs.sort((a, b) => a.sortOrder - b.sortOrder))
      message.success("FAQ moved up successfully")
    }
  }

  const handleMoveDown = (id) => {
    const index = faqs.findIndex((faq) => faq.id === id)
    if (index < faqs.length - 1) {
      const newFaqs = [...faqs]
      const currentSortOrder = newFaqs[index].sortOrder
      newFaqs[index].sortOrder = newFaqs[index + 1].sortOrder
      newFaqs[index + 1].sortOrder = currentSortOrder
      setFaqs(newFaqs.sort((a, b) => a.sortOrder - b.sortOrder))
      message.success("FAQ moved down successfully")
    }
  }

  // Filter FAQs based on search text and category
  const filteredFaqs = faqs
    .filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchText.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchText.toLowerCase())

      const matchesCategory = categoryFilter === "" || faq.category === categoryFilter

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)

  // Get unique categories for filter
  const categories = [...new Set(faqs.map((faq) => faq.category))]

  // Calculate statistics
  const stats = {
    total: faqs.length,
    active: faqs.filter((faq) => faq.isActive).length,
    inactive: faqs.filter((faq) => !faq.isActive).length,
    categories: categories.length,
    totalViews: faqs.reduce((sum, faq) => sum + faq.views, 0),
  }

  // FAQ table columns
  const columns = [
    {
      title: "Order",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 80,
      render: (sortOrder) => <Text strong>{sortOrder}</Text>,
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
      render: (category) => <Tag color="blue">{category}</Tag>,
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
      sorter: (a, b) => a.views - b.views,
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
                    <Tag color="blue">{faq.category}</Tag>
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
                rules={[{ required: true, message: "Please select a category" }]}
              >
                <Select placeholder="Select category">
                  {categories.map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                  <Option value="new">+ Add New Category</Option>
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
