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
  Select,
  message,
  Tooltip,
  Switch,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
  Descriptions,
} from "antd"
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HistoryOutlined,
  TeamOutlined,
  UserAddOutlined,
} from "@ant-design/icons"

const { Title } = Typography
const { Option } = Select

const AccountManagement = () => {
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [searchText, setSearchText] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isRecordModalVisible, setIsRecordModalVisible] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [form] = Form.useForm()

  // Fetch accounts data
  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockAccounts = [
        {
          id: 1,
          username: "admin",
          email: "admin@genetix.com",
          phone: "0123456789",
          role: "Admin",
          status: "Active",
          createdAt: "2023-01-01",
          fullName: "Admin User",
          lastLogin: "2023-06-01 10:30:00",
          totalTests: 0,
          totalSpent: 0,
        },
        {
          id: 2,
          username: "manager1",
          email: "manager@genetix.com",
          phone: "0123456788",
          role: "Manager",
          status: "Active",
          createdAt: "2023-01-02",
          fullName: "Manager User",
          lastLogin: "2023-06-01 09:15:00",
          totalTests: 0,
          totalSpent: 0,
        },
        {
          id: 3,
          username: "staff1",
          email: "staff1@genetix.com",
          phone: "0123456787",
          role: "Staff",
          status: "Active",
          createdAt: "2023-01-03",
          fullName: "Staff User One",
          lastLogin: "2023-06-01 08:45:00",
          totalTests: 0,
          totalSpent: 0,
        },
        {
          id: 4,
          username: "customer1",
          email: "customer1@genetix.com",
          phone: "0123456786",
          role: "Customer",
          status: "Active",
          createdAt: "2023-01-04",
          fullName: "John Doe",
          lastLogin: "2023-05-30 14:20:00",
          totalTests: 3,
          totalSpent: 599.97,
        },
        {
          id: 5,
          username: "staff2",
          email: "staff2@genetix.com",
          phone: "0123456785",
          role: "Staff",
          status: "Inactive",
          createdAt: "2023-01-05",
          fullName: "Staff User Two",
          lastLogin: "2023-05-25 16:30:00",
          totalTests: 0,
          totalSpent: 0,
        },
        {
          id: 6,
          username: "customer2",
          email: "customer2@genetix.com",
          phone: "0123456784",
          role: "Customer",
          status: "Active",
          createdAt: "2023-02-01",
          fullName: "Jane Smith",
          lastLogin: "2023-06-01 11:00:00",
          totalTests: 1,
          totalSpent: 199.99,
        },
      ]

      setAccounts(mockAccounts)
      setLoading(false)
    }, 1000)
  }, [])

  // Handle account edit
  const handleEdit = (record) => {
    setEditingAccount(record)
    form.setFieldsValue({
      username: record.username,
      email: record.email,
      phone: record.phone,
      role: record.role,
      status: record.status === "Active",
      fullName: record.fullName,
    })
    setIsModalVisible(true)
  }

  // Handle account delete
  const handleDelete = (id) => {
    setAccounts(accounts.filter((account) => account.id !== id))
    message.success("Account deleted successfully")
  }

  // Handle account status toggle (Activate/Deactivate)
  const handleStatusToggle = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active"
    setAccounts(accounts.map((account) => (account.id === id ? { ...account, status: newStatus } : account)))
    message.success(`Account ${newStatus === "Active" ? "activated" : "deactivated"} successfully`)
  }

  // Handle form submission
  const handleFormSubmit = (values) => {
    if (editingAccount) {
      // Update existing account
      setAccounts(
        accounts.map((account) =>
          account.id === editingAccount.id
            ? {
                ...account,
                username: values.username,
                email: values.email,
                phone: values.phone,
                role: values.role,
                status: values.status ? "Active" : "Inactive",
                fullName: values.fullName,
              }
            : account,
        ),
      )
      message.success("Account updated successfully")
    } else {
      // Create new account
      const newAccount = {
        id: accounts.length + 1,
        username: values.username,
        email: values.email,
        phone: values.phone,
        role: values.role,
        status: values.status ? "Active" : "Inactive",
        createdAt: new Date().toISOString().split("T")[0],
        fullName: values.fullName,
        lastLogin: "Never",
        totalTests: 0,
        totalSpent: 0,
      }
      setAccounts([...accounts, newAccount])
      message.success("Account created successfully")
    }
    setIsModalVisible(false)
    form.resetFields()
    setEditingAccount(null)
  }
  // Filter accounts based on search text, role, and status
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.username.toLowerCase().includes(searchText.toLowerCase()) ||
      account.email.toLowerCase().includes(searchText.toLowerCase()) ||
      account.phone.includes(searchText) ||
      account.fullName.toLowerCase().includes(searchText.toLowerCase())

    const matchesRole = roleFilter === "" || roleFilter === "All" || account.role === roleFilter
    const matchesStatus = statusFilter === "" || account.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  // Calculate statistics
  const stats = {
    total: accounts.length,
    active: accounts.filter((acc) => acc.status === "Active").length,
    inactive: accounts.filter((acc) => acc.status === "Inactive").length,
    customers: accounts.filter((acc) => acc.role === "Customer").length,
    staff: accounts.filter((acc) => acc.role === "Staff" || acc.role === "Manager" || acc.role === "Admin").length,
  }

  // Account table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 60,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <Space>
          <MailOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => (
        <Space>
          <PhoneOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",      render: (role) => {
        let color = "blue"
        if (role === "All") color = "gold"
        if (role === "Admin") color = "red"
        if (role === "Manager") color = "purple"
        if (role === "Staff") color = "green"
        if (role === "Customer") color = "blue"
        return <Tag color={color}>{role}</Tag>
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "Active" ? "green" : "red"
        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      sorter: (a, b) => new Date(a.lastLogin) - new Date(b.lastLogin),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Account">
            <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          </Tooltip>

          <Tooltip title={record.status === "Active" ? "Deactivate" : "Activate"}>
            <Button
              type={record.status === "Active" ? "default" : "primary"}
              icon={record.status === "Active" ? <LockOutlined /> : <UnlockOutlined />}
              size="small"
              onClick={() => handleStatusToggle(record.id, record.status)}
            />
          </Tooltip>

          {record.role === "Customer" && (
            <Tooltip title="View Records">
              <Button
                type="default"
                icon={<HistoryOutlined />}
                size="small"
                onClick={() => {
                  setSelectedUser(record)
                  setIsRecordModalVisible(true)
                }}
              />
            </Tooltip>
          )}

          <Popconfirm
            title="Are you sure you want to delete this account?"
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
        <Title level={2}>Account Management</Title>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          onClick={() => {
            setEditingAccount(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
        >
          Create New Account
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Accounts" value={stats.total} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Accounts"
              value={stats.active}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Customers"
              value={stats.customers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Staff Members"
              value={stats.staff}
              prefix={<TeamOutlined />}
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
              placeholder="Search by name, email, phone, username..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6} lg={4}>            <Select
              placeholder="Filter by role"
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: "100%" }}
              allowClear
            >
              <Option value="All">All</Option>
              <Option value="Admin">Admin</Option>
              <Option value="Manager">Manager</Option>
              <Option value="Staff">Staff</Option>
              <Option value="Customer">Customer</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6} lg={4}>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              allowClear
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Accounts Table */}
      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredAccounts}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} accounts`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Account Modal */}
      <Modal
        title={editingAccount ? "Edit Account" : "Create New Account"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
          setEditingAccount(null)
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            status: true,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: "Please enter full name" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Full Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: "Please enter username" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                  { pattern: /^\d{10}$/, message: "Please enter a valid 10-digit phone number" },
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Phone" />
              </Form.Item>
            </Col>
          </Row>

          {!editingAccount && (
            <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please enter password" }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
          )}

          <Row gutter={16}>            <Col span={12}>
              <Form.Item name="role" label="Role" rules={[{ required: true, message: "Please select role" }]}>
                <Select placeholder="Select role">
                  <Option value="All">All</Option>
                  <Option value="Admin">Admin</Option>
                  <Option value="Manager">Manager</Option>
                  <Option value="Staff">Staff</Option>
                  <Option value="Customer">Customer</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large">
                {editingAccount ? "Update Account" : "Create Account"}
              </Button>
              <Button
                size="large"
                onClick={() => {
                  setIsModalVisible(false)
                  form.resetFields()
                  setEditingAccount(null)
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* User Record Details Modal */}
      <Modal
        title="Customer Record Details"
        open={isRecordModalVisible}
        onCancel={() => {
          setIsRecordModalVisible(false)
          setSelectedUser(null)
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsRecordModalVisible(false)
              setSelectedUser(null)
            }}
          >
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedUser && (
          <div>
            <Descriptions title="Customer Information" bordered column={2}>
              <Descriptions.Item label="Customer ID">
                CUST{selectedUser.id.toString().padStart(3, "0")}
              </Descriptions.Item>
              <Descriptions.Item label="Full Name">{selectedUser.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedUser.phone}</Descriptions.Item>
              <Descriptions.Item label="Total Tests">{selectedUser.totalTests}</Descriptions.Item>
              <Descriptions.Item label="Total Spent">${selectedUser.totalSpent.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Last Login">{selectedUser.lastLogin}</Descriptions.Item>
              <Descriptions.Item label="Account Created">{selectedUser.createdAt}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AccountManagement
