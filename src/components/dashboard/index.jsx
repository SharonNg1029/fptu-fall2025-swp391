import React from "react"
import { useState, useEffect } from "react"
import {
  UserOutlined,
  DashboardOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  InboxOutlined,
  SafetyOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from "@ant-design/icons"
import { Layout, Menu, theme, Avatar, Dropdown, Badge, Input, Space, Typography, Breadcrumb, Button } from "antd"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"

const { Header, Content, Footer, Sider } = Layout
const { Title, Text } = Typography
const { Search } = Input

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: children ? label : <Link to={`/dashboard/${key}`}>{label}</Link>,
  }
}

const items = [
  getItem("Dashboard", "overview", <DashboardOutlined />),
  getItem("Account Management", "accounts", <UserOutlined />),
  getItem("Services", "services", <MedicineBoxOutlined />),
  getItem("Content Management", "cm", <FileTextOutlined />, [
    getItem("Blog Posts", "cm/blog"),
    getItem("FAQs", "cm/faqs"),
  ]),
  getItem("Test Kit Inventory", "inventory", <InboxOutlined />, ),
  getItem("System Logs", "logs", <SafetyOutlined />, ),
]

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const location = useLocation()
  const navigate = useNavigate()

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  // Update breadcrumbs based on current location
  useEffect(() => {
    const pathSnippets = location.pathname.split("/").filter((i) => i)
    const breadcrumbItems = pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`
      return {
        title: snippet.charAt(0).toUpperCase() + snippet.slice(1),
        path: url,
      }
    })

    setBreadcrumbs(breadcrumbItems)
  }, [location])

  // User dropdown menu
  const userMenu = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
      onClick: () => navigate("/dashboard/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => {
        // Handle logout logic here
        navigate("/login")
      },
    },
  ]

  // Notification dropdown menu
  const notificationMenu = [
    {
      key: "1",
      label: "New user registered",
      onClick: () => console.log("Notification 1 clicked"),
    },
    {
      key: "2",
      label: "System alert: Low kit inventory",
      onClick: () => console.log("Notification 2 clicked"),
    },
    {
      key: "3",
      label: "New test results available",
      onClick: () => console.log("Notification 3 clicked"),
    },
    {
      type: "divider",
    },
    {
      key: "all",
      label: "View all notifications",
      onClick: () => navigate("/dashboard/notifications"),
    },
  ]

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={260}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <img src="/images/logo.png" alt="Genetix Logo" style={{ height: 32, marginRight: collapsed ? 0 : 8 }} />
          {!collapsed && (
            <div>
              <Title level={4} style={{ margin: 0, color: "#fff", lineHeight: 1.2 }}>
                Genetix System
              </Title>
              <Text style={{ color: "#8c8c8c", fontSize: "12px" }}>DNA Testing</Text>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          defaultSelectedKeys={["overview"]}
          mode="inline"
          items={items}
          selectedKeys={[location.pathname.split("/").slice(1, 3).join("/")]}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: "all 0.2s" }}>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
            position: "sticky",
            top: 0,
            zIndex: 999,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />

          <Space size={24}>
            <Search placeholder="Search..." style={{ width: 250 }} />

            <Dropdown menu={{ items: notificationMenu }} placement="bottomRight" arrow>
              <Badge count={3}>
                <Avatar
                  icon={<BellOutlined />}
                  style={{ backgroundColor: "#f0f2f5", color: "#1890ff", cursor: "pointer" }}
                />
              </Badge>
            </Dropdown>

            <Dropdown menu={{ items: userMenu }} placement="bottomRight" arrow>
              <Space style={{ cursor: "pointer" }}>
                <Avatar style={{ backgroundColor: "#1890ff" }} icon={<UserOutlined />} />
                <span className="hide-on-small">Admin User</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: "16px 16px 0", overflow: "initial" }}>
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item>
              <Link to="/dashboard">Dashboard</Link>
            </Breadcrumb.Item>
            {breadcrumbs.slice(1).map((breadcrumb, index) => (
              <Breadcrumb.Item key={index}>
                <Link to={breadcrumb.path}>{breadcrumb.title}</Link>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>

          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: "calc(100vh - 184px)",
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center", padding: "12px 50px" }}>
          DNA Testing Service Management System ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  )
}

export default Dashboard
