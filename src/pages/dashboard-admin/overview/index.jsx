import React from "react"
import { useState, useEffect } from "react"
import { Row, Col, Card, Statistic, Typography, Table, Tag, Button, DatePicker, Divider, message } from "antd"
import {
  UserOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons"
import { Line, Column, Pie } from "@ant-design/plots"
import api from "../../../configs/axios"

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const Overview = () => {
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState([null, null])
  const [stats, setStats] = useState({
    totalUsers: 0,
    completedTests: 0,
    revenue: 0,
    kitsSold: 0,
  })
  const [revenueData, setRevenueData] = useState([])
  const [kitSalesData, setKitSalesData] = useState([])
  const [serviceDistribution, setServiceDistribution] = useState([])
  const [recentBookings, setRecentBookings] = useState([])

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch dashboard statistics
      const statsResponse = await api.get("/admin/dashboard/stats", {
        params: {
          startDate: dateRange[0]?.format("YYYY-MM-DD"),
          endDate: dateRange[1]?.format("YYYY-MM-DD"),
        },
      })
      console.log("Dashboard stats response:", statsResponse)

      const statsData = statsResponse.data?.data || statsResponse.data || {}
      setStats({
        totalUsers: statsData.totalUsers || 0,
        completedTests: statsData.completedTests || 0,
        revenue: statsData.revenue || 0,
        kitsSold: statsData.kitsSold || 0,
      })

      // Fetch revenue chart data
      const revenueResponse = await api.get("/admin/dashboard/revenue-chart", {
        params: {
          startDate: dateRange[0]?.format("YYYY-MM-DD"),
          endDate: dateRange[1]?.format("YYYY-MM-DD"),
        },
      })
      console.log("Revenue chart response:", revenueResponse)

      const revenueChartData = revenueResponse.data?.data || revenueResponse.data || []
      setRevenueData(revenueChartData)

      // Fetch kit sales chart data
      const kitSalesResponse = await api.get("/admin/dashboard/kit-sales-chart", {
        params: {
          startDate: dateRange[0]?.format("YYYY-MM-DD"),
          endDate: dateRange[1]?.format("YYYY-MM-DD"),
        },
      })
      console.log("Kit sales chart response:", kitSalesResponse)

      const kitSalesChartData = kitSalesResponse.data?.data || kitSalesResponse.data || []
      setKitSalesData(kitSalesChartData)

      // Fetch service distribution data
      const serviceDistResponse = await api.get("/admin/dashboard/service-distribution")
      console.log("Service distribution response:", serviceDistResponse)

      const serviceDistData = serviceDistResponse.data?.data || serviceDistResponse.data || []
      setServiceDistribution(serviceDistData)

      // Fetch recent bookings
      const bookingsResponse = await api.get("/admin/dashboard/recent-bookings", {
        params: { limit: 5 },
      })
      console.log("Recent bookings response:", bookingsResponse)

      const bookingsData = bookingsResponse.data?.data || bookingsResponse.data || []
      setRecentBookings(bookingsData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      message.error("Failed to fetch dashboard data: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on component mount and when date range changes
  useEffect(() => {
    fetchDashboardData()
  }, [dateRange])

  // Revenue chart config
  const revenueConfig = {
    data: revenueData,
    xField: "month",
    yField: "revenue",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
    smooth: true,
    lineStyle: {
      stroke: "#1890ff",
      lineWidth: 3,
    },
    areaStyle: {
      fill: "l(270) 0:#ffffff 0.5:#1890ff 1:#1890ff",
      fillOpacity: 0.2,
    },
  }

  // Kit sales chart config
  const kitSalesConfig = {
    data: kitSalesData,
    xField: "week",
    yField: "sales",
    columnWidthRatio: 0.6,
    color: "#1890ff",
    label: {
      position: "top",
      style: {
        fill: "#1890ff",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  }

  // Service distribution chart config
  const serviceDistributionConfig = {
    data: serviceDistribution,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name}: {percentage}",
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  }

  // Table columns
  const columns = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => customer || "N/A",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      render: (service) => service || "N/A",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue"
        if (status === "Completed") color = "green"
        if (status === "Pending") color = "orange"
        if (status === "Cancelled") color = "red"
        return <Tag color={color}>{status || "Unknown"}</Tag>
      },
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Button type="link" size="small">
          View Details
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={2}>Dashboard Overview</Title>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <RangePicker onChange={(dates) => setDateRange(dates)} format="YYYY-MM-DD" />
          <Button type="primary" icon={<ReloadOutlined />} onClick={fetchDashboardData} loading={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
              suffix={<Tag color="blue">+12%</Tag>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Completed Tests"
              value={stats.completedTests}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
              suffix={<Tag color="green">+8%</Tag>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Revenue"
              value={stats.revenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#faad14" }}
              suffix={<Tag color="orange">+15%</Tag>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Kits Sold"
              value={stats.kitsSold}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: "#eb2f96" }}
              suffix={<Tag color="purple">+5%</Tag>}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Monthly Revenue" loading={loading} extra={<Button type="link">View Details</Button>}>
            {revenueData.length > 0 ? (
              <Line {...revenueConfig} height={300} />
            ) : (
              <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Text type="secondary">No revenue data available</Text>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Weekly Kit Sales" loading={loading} extra={<Button type="link">View Details</Button>}>
            {kitSalesData.length > 0 ? (
              <Column {...kitSalesConfig} height={300} />
            ) : (
              <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Text type="secondary">No kit sales data available</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Service Distribution" loading={loading} extra={<Button type="link">View Details</Button>}>
            {serviceDistribution.length > 0 ? (
              <Pie {...serviceDistributionConfig} height={300} />
            ) : (
              <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Text type="secondary">No service distribution data available</Text>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Bookings" loading={loading} extra={<Button type="link">View All</Button>}>
            <Table
              dataSource={recentBookings}
              columns={columns}
              pagination={false}
              size="small"
              locale={{
                emptyText: "No recent bookings available",
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Overview
