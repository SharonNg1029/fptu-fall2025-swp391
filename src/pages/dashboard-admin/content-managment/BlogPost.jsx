// BlogPost.jsx
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
  Select,
  Row,
  Col,
  Statistic,
  DatePicker,
  Upload,
} from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  ReadOutlined,
  LikeOutlined,
  CommentOutlined,
} from "@ant-design/icons"

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { RangePicker } = DatePicker

const BlogPosts = () => {
  const [loading, setLoading] = useState(true)
  const [blogs, setBlogs] = useState([])
  const [searchText, setSearchText] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [form] = Form.useForm()
  const [dateRange, setDateRange] = useState(null)
  const [statusFilter, setStatusFilter] = useState("")

  // Fetch blogs data
  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockBlogs = [
        {
          id: 1,
          title: "Understanding DNA Testing: A Comprehensive Guide",
          content:
            "DNA testing has revolutionized the way we understand genetics and heredity. This comprehensive guide explains the different types of DNA tests available, how they work, and what information they can provide. From paternity testing to ancestry analysis, learn everything you need to know about modern DNA testing procedures.",
          excerpt: "DNA testing has revolutionized the way we understand genetics...",
          author: "Dr. Sarah Johnson",
          createdAt: "2023-06-01",
          updatedAt: "2023-06-05",
          status: "Published",
          category: "Education",
          tags: ["DNA", "Testing", "Science", "Genetics"],
          featuredImage: "https://example.com/images/dna-testing.jpg",
          views: 1245,
          likes: 87,
          comments: 23,
        },
        {
          id: 2,
          title: "Paternity Testing: What You Need to Know",
          content:
            "Paternity testing is one of the most common types of DNA tests. This article covers everything from how to prepare for a paternity test, what to expect during the process, and how to interpret the results. We also discuss the legal implications of paternity testing and when it might be necessary to pursue this option.",
          excerpt: "Paternity testing is one of the most common types of DNA tests...",
          author: "Dr. Michael Chen",
          createdAt: "2023-06-02",
          updatedAt: "2023-06-02",
          status: "Published",
          category: "Information",
          tags: ["Paternity", "DNA Test", "Family"],
          featuredImage: "https://example.com/images/paternity-test.jpg",
          views: 980,
          likes: 56,
          comments: 14,
        },
        {
          id: 3,
          title: "The Science Behind Ancestry DNA Testing",
          content:
            "Ancestry DNA testing can reveal fascinating insights about your heritage and family history. This post explains the scientific principles behind ancestry testing, how genetic markers are used to determine ethnicity, and what limitations exist in current testing methods. Discover how these tests can connect you with relatives and help you build your family tree.",
          excerpt: "Ancestry DNA testing can reveal fascinating insights about your heritage...",
          author: "Dr. Emily Rodriguez",
          createdAt: "2023-06-03",
          updatedAt: "2023-06-04",
          status: "Draft",
          category: "Education",
          tags: ["Ancestry", "Heritage", "Genealogy"],
          featuredImage: "https://example.com/images/ancestry-dna.jpg",
          views: 0,
          likes: 0,
          comments: 0,
        },
        {
          id: 4,
          title: "How to Collect DNA Samples at Home",
          content:
            "Collecting DNA samples at home is simple and straightforward with the right guidance. This step-by-step guide walks you through the process of using a home DNA collection kit, ensuring you get accurate results. Learn about common mistakes to avoid and best practices for sample collection.",
          excerpt: "Collecting DNA samples at home is simple and straightforward...",
          author: "James Wilson",
          createdAt: "2023-06-04",
          updatedAt: "2023-06-04",
          status: "Published",
          category: "How-to",
          tags: ["Sample Collection", "Home Testing", "DIY"],
          featuredImage: "https://example.com/images/dna-collection.jpg",
          views: 756,
          likes: 42,
          comments: 8,
        },
        {
          id: 5,
          title: "DNA Testing Ethics and Privacy Concerns",
          content:
            "As DNA testing becomes more widespread, important ethical and privacy questions arise. This article examines the ethical implications of DNA testing, including privacy concerns, data security, and potential misuse of genetic information. We discuss current regulations and best practices for protecting your genetic data.",
          excerpt: "As DNA testing becomes more widespread, important ethical and privacy questions arise...",
          author: "Dr. Lisa Thompson",
          createdAt: "2023-06-05",
          updatedAt: "2023-06-06",
          status: "Scheduled",
          category: "Ethics",
          tags: ["Privacy", "Ethics", "Data Security"],
          featuredImage: "https://example.com/images/dna-privacy.jpg",
          views: 0,
          likes: 0,
          comments: 0,
          scheduledDate: "2023-06-10",
        },
      ]

      setBlogs(mockBlogs)
      setLoading(false)
    }, 1000)
  }, [])

  // Handle blog edit
  const handleEdit = (record) => {
    setEditingBlog(record)
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      excerpt: record.excerpt,
      author: record.author,
      status: record.status,
      category: record.category,
      tags: record.tags,
    })
    setIsModalVisible(true)
  }

  // Handle blog view
  const handleView = (record) => {
    setSelectedBlog(record)
    setIsViewModalVisible(true)
  }

  // Handle blog delete
  const handleDelete = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id))
    message.success("Blog post deleted successfully")
  }

  // Handle form submission
  const handleFormSubmit = (values) => {
    if (editingBlog) {
      // Update existing blog
      setBlogs(
        blogs.map((blog) =>
          blog.id === editingBlog.id
            ? {
                ...blog,
                title: values.title,
                content: values.content,
                excerpt: values.excerpt,
                author: values.author,
                status: values.status,
                category: values.category,
                tags: values.tags,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : blog,
        ),
      )
      message.success("Blog post updated successfully")
    } else {
      // Create new blog
      const newBlog = {
        id: blogs.length + 1,
        title: values.title,
        content: values.content,
        excerpt: values.excerpt,
        author: values.author,
        status: values.status,
        category: values.category,
        tags: values.tags,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        views: 0,
        likes: 0,
        comments: 0,
        featuredImage: "https://example.com/images/default.jpg",
      }
      setBlogs([...blogs, newBlog])
      message.success("Blog post created successfully")
    }
    setIsModalVisible(false)
    form.resetFields()
    setEditingBlog(null)
  }

  // Filter blogs based on search text, date range, and status
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(searchText.toLowerCase()))

    const matchesStatus = statusFilter === "" || blog.status === statusFilter

    const matchesDateRange =
      !dateRange ||
      !dateRange[0] ||
      !dateRange[1] ||
      (new Date(blog.createdAt) >= dateRange[0].startOf("day").toDate() &&
        new Date(blog.createdAt) <= dateRange[1].endOf("day").toDate())

    return matchesSearch && matchesStatus && matchesDateRange
  })

  // Calculate statistics
  const stats = {
    total: blogs.length,
    published: blogs.filter((blog) => blog.status === "Published").length,
    draft: blogs.filter((blog) => blog.status === "Draft").length,
    scheduled: blogs.filter((blog) => blog.status === "Scheduled").length,
    totalViews: blogs.reduce((sum, blog) => sum + blog.views, 0),
    totalLikes: blogs.reduce((sum, blog) => sum + blog.likes, 0),
    totalComments: blogs.reduce((sum, blog) => sum + blog.comments, 0),
  }

  // Blog table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <Space>
          <FileTextOutlined />
          <Text strong>{text}</Text>
        </Space>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue"
        if (status === "Published") color = "green"
        if (status === "Draft") color = "orange"
        if (status === "Scheduled") color = "purple"
        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Space>
          <CalendarOutlined />
          {date}
        </Space>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Stats",
      key: "stats",
      render: (_, record) => (
        <Space>
          <Tooltip title="Views">
            <Space>
              <ReadOutlined />
              {record.views}
            </Space>
          </Tooltip>
          <Tooltip title="Likes">
            <Space>
              <LikeOutlined />
              {record.likes}
            </Space>
          </Tooltip>
          <Tooltip title="Comments">
            <Space>
              <CommentOutlined />
              {record.comments}
            </Space>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button type="default" icon={<EyeOutlined />} size="small" onClick={() => handleView(record)} />
          </Tooltip>

          <Tooltip title="Edit">
            <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          </Tooltip>

          <Popconfirm
            title="Are you sure you want to delete this blog post?"
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
        <Title level={2}>Blog Posts</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            setEditingBlog(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
        >
          Create New Post
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Posts" value={stats.total} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Published"
              value={stats.published}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Views"
              value={stats.totalViews}
              prefix={<ReadOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Engagement"
              value={stats.totalLikes + stats.totalComments}
              prefix={<LikeOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={8}>
            <Input
              placeholder="Search by title, content, author..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6} lg={4}>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              allowClear
            >
              <Option value="Published">Published</Option>
              <Option value="Draft">Draft</Option>
              <Option value="Scheduled">Scheduled</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6} lg={8}>
            <RangePicker
              style={{ width: "100%" }}
              onChange={(dates) => setDateRange(dates)}
              placeholder={["Start Date", "End Date"]}
            />
          </Col>
        </Row>
      </Card>

      {/* Blog Posts Table */}
      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredBlogs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} posts`,
          }}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <p style={{ margin: 0 }}>
                  <strong>Excerpt:</strong> {record.excerpt}
                </p>
                <p style={{ margin: "8px 0 0 0" }}>
                  <strong>Tags:</strong>{" "}
                  {record.tags.map((tag) => (
                    <Tag key={tag} color="blue">
                      {tag}
                    </Tag>
                  ))}
                </p>
              </div>
            ),
          }}
        />
      </Card>

      {/* Create/Edit Blog Modal */}
      <Modal
        title={editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
          setEditingBlog(null)
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} initialValues={{ status: "Draft" }}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please enter blog title" }]}>
            <Input placeholder="Blog Title" />
          </Form.Item>

          <Form.Item name="excerpt" label="Excerpt" rules={[{ required: true, message: "Please enter blog excerpt" }]}>
            <TextArea rows={2} placeholder="Short excerpt for blog preview" />
          </Form.Item>

          <Form.Item name="content" label="Content" rules={[{ required: true, message: "Please enter blog content" }]}>
            <TextArea rows={10} placeholder="Blog Content" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="author" label="Author" rules={[{ required: true, message: "Please enter author name" }]}>
                <Input placeholder="Author Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select placeholder="Select category">
                  <Option value="Education">Education</Option>
                  <Option value="Information">Information</Option>
                  <Option value="How-to">How-to</Option>
                  <Option value="Ethics">Ethics</Option>
                  <Option value="News">News</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="tags" label="Tags" rules={[{ required: true, message: "Please add at least one tag" }]}>
            <Select mode="tags" placeholder="Add tags" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
            <Select placeholder="Select status">
              <Option value="Draft">Draft</Option>
              <Option value="Published">Published</Option>
              <Option value="Scheduled">Scheduled</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Featured Image">
            <Upload listType="picture-card" maxCount={1}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large">
                {editingBlog ? "Update Post" : "Create Post"}
              </Button>
              <Button
                size="large"
                onClick={() => {
                  setIsModalVisible(false)
                  form.resetFields()
                  setEditingBlog(null)
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Blog Modal */}
      <Modal
        title="Blog Post Preview"
        open={isViewModalVisible}
        onCancel={() => {
          setIsViewModalVisible(false)
          setSelectedBlog(null)
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsViewModalVisible(false)
              setSelectedBlog(null)
            }}
          >
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedBlog && (
          <div>
            <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>{selectedBlog.title}</h1>

            <div style={{ marginBottom: "16px" }}>
              <Space>
                <UserOutlined /> {selectedBlog.author}
              </Space>
              <span style={{ margin: "0 8px" }}>|</span>
              <Space>
                <CalendarOutlined /> {selectedBlog.createdAt}
              </Space>
              <span style={{ margin: "0 8px" }}>|</span>
              <Tag color="blue">{selectedBlog.category}</Tag>
            </div>

            <div style={{ marginBottom: "16px" }}>
              {selectedBlog.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>

            <div style={{ marginBottom: "24px" }}>
              <img
                src={selectedBlog.featuredImage || "https://via.placeholder.com/800x400"}
                alt={selectedBlog.title}
                style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "8px" }}
              />
            </div>

            <div style={{ whiteSpace: "pre-line", marginBottom: "24px" }}>{selectedBlog.content}</div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Space>
                <Button icon={<ReadOutlined />}>{selectedBlog.views} Views</Button>
                <Button icon={<LikeOutlined />}>{selectedBlog.likes} Likes</Button>
                <Button icon={<CommentOutlined />}>{selectedBlog.comments} Comments</Button>
              </Space>
              <Space>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setIsViewModalVisible(false)
                    handleEdit(selectedBlog)
                  }}
                >
                  Edit
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default BlogPosts
