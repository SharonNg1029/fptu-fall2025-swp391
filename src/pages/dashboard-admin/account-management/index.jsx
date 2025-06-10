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
  ReloadOutlined,
} from "@ant-design/icons"
import api from "../../../configs/axios"

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

  // Fetch accounts data from API
  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const response = await api.get("/admin/accounts")
      console.log("Accounts response:", response)

      const accountsData = response.data?.data || response.data || []
      setAccounts(accountsData)
    } catch (error) {
      console.error("Error fetching accounts:", error)
      message.error("Failed to fetch accounts: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  // Handle account edit
  const handleEdit = (record) => {
    setEditingAccount(record)
    form.setFieldsValue({
      username: record.username,
      email: record.email,
      phone: record.phone,
      role: record.role,
      status: record.status === "ACTIVE",
      fullName: record.fullName,
    })
    setIsModalVisible(true)
  }

  // Handle account delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/accounts/${id}`)
      message.success("Account deleted successfully")
      fetchAccounts() // Refresh the list
    } catch (error) {
      console.error("Error deleting account:", error)
      message.error("Failed to delete account: " + (error.response?.data?.message || error.message))
    }
  }

  // Handle account status toggle
  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      await api.put(`/admin/accounts/${id}/status`, { status: newStatus })
      message.success(`Account ${newStatus === "ACTIVE" ? "activated" : "deactivated"} successfully`)
      fetchAccounts() // Refresh the list
    } catch (error) {
      console.error("Error updating account status:", error)
      message.error("Failed to update account status: " + (error.response?.data?.message || error.message))
    }
  }

  // Handle form submission
  const handleFormSubmit = async (values) => {
    try {
      const accountData = {
        username: values.username,
        email: values.email,
        phone: values.phone,
        role: values.role,
        status: values.status ? "ACTIVE" : "INACTIVE",
        fullName: values.fullName,
      }

      if (editingAccount) {
        // Update existing account
        await api.put(`/admin/accounts/${editingAccount.id}`, accountData)
        message.success("Account updated successfully")
      } else {
        // Create new account
        if (values.password) {
          accountData.password = values.password
        }
        await api.post("/admin/accounts", accountData)
        message.success("Account created successfully")
      }

      setIsModalVisible(false)
      form.resetFields()
      setEditingAccount(null)
      fetchAccounts() // Refresh the list
    } catch (error) {
      console.error("Error saving account:", error)
      message.error("Failed to save account: " + (error.response?.data?.message || error.message))
    }
  }

  // Filter accounts based on search text, role, and status
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      account.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      account.phone?.includes(searchText) ||
      account.fullName?.toLowerCase().includes(searchText.toLowerCase())

    const matchesRole = roleFilter === "" || roleFilter === "All" || account.role === roleFilter
    const matchesStatus = statusFilter === "" || account.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  // Calculate statistics
  const stats = {
    total: accounts.length,
    active: accounts.filter((acc) => acc.status === "ACTIVE").length,
    inactive: accounts.filter((acc) => acc.status === "INACTIVE").length,
    customers: accounts.filter((acc) => acc.role === "CUSTOMER").length,
    staff: accounts.filter((acc) => ["STAFF", "MANAGER", "ADMIN"].includes(acc.role)).length,
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
          {text || "N/A"}
        </Space>
      ),
      sorter: (a, b) => (a.fullName || "").localeCompare(b.fullName || ""),
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
          {text || "N/A"}
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        let color = "blue"
        if (role === "ADMIN") color = "red"
        if (role === "MANAGER") color = "purple"
        if (role === "STAFF") color = "green"
        if (role === "CUSTOMER") color = "blue"
        return <Tag color={color}>{role}</Tag>
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "ACTIVE" ? "green" : "red"
        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Account">
            <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          </Tooltip>

          <Tooltip title={record.status === "ACTIVE" ? "Deactivate" : "Activate"}>
            <Button
              type={record.status === "ACTIVE" ? "default" : "primary"}
              icon={record.status === "ACTIVE" ? <LockOutlined /> : <UnlockOutlined />}
              size="small"
              onClick={() => handleStatusToggle(record.id, record.status)}
            />
          </Tooltip>

          {record.role === "CUSTOMER" && (
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
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchAccounts} loading={loading}>
            Refresh
          </Button>
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
        </Space>
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
          <Col xs={24} sm={6} lg={4}>
            <Select
              placeholder="Filter by role"
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: "100%" }}
              allowClear
            >
              <Option value="ADMIN">Admin</Option>
              <Option value="MANAGER">Manager</Option>
              <Option value="STAFF">Staff</Option>
              <Option value="CUSTOMER">Customer</Option>
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
              <Option value="ACTIVE">Active</Option>
              <Option value="INACTIVE">Inactive</Option>
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="role" label="Role" rules={[{ required: true, message: "Please select role" }]}>
                <Select placeholder="Select role">
                  <Option value="ADMIN">Admin</Option>
                  <Option value="MANAGER">Manager</Option>
                  <Option value="STAFF">Staff</Option>
                  <Option value="CUSTOMER">Customer</Option>
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
              <Descriptions.Item label="Full Name">{selectedUser.fullName || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedUser.phone || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Total Tests">{selectedUser.totalTests || 0}</Descriptions.Item>
              <Descriptions.Item label="Total Spent">${(selectedUser.totalSpent || 0).toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Last Login">{selectedUser.lastLogin || "Never"}</Descriptions.Item>
              <Descriptions.Item label="Account Created">
                {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AccountManagement
