import React from "react"
import { useState, useEffect } from "react"
import { Row, Col, Card, Statistic, Typography, Table, Tag, Button, DatePicker, Divider } from "antd"
import { UserOutlined, MedicineBoxOutlined, DollarOutlined, CheckCircleOutlined } from "@ant-design/icons"
import { Line, Column, Pie } from "@ant-design/plots"

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

  // Simulate data fetching
  useEffect(() => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock data
      setStats({
        totalUsers: 124,
        completedTests: 87,
        revenue: 15680,
        kitsSold: 95,
      })

      setRevenueData([
        { month: "Jan", revenue: 3500 },
        { month: "Feb", revenue: 4200 },
        { month: "Mar", revenue: 3800 },
        { month: "Apr", revenue: 5100 },
        { month: "May", revenue: 5800 },
        { month: "Jun", revenue: 7200 },
        { month: "Jul", revenue: 6800 },
        { month: "Aug", revenue: 7500 },
        { month: "Sep", revenue: 8200 },
        { month: "Oct", revenue: 9100 },
        { month: "Nov", revenue: 9800 },
        { month: "Dec", revenue: 10500 },
      ])

      setKitSalesData([
        { week: "Week 1", sales: 12 },
        { week: "Week 2", sales: 19 },
        { week: "Week 3", sales: 15 },
        { week: "Week 4", sales: 25 },
        { week: "Week 5", sales: 22 },
      ])

      setServiceDistribution([
        { type: "Paternity Test", value: 45 },
        { type: "Maternity Test", value: 25 },
        { type: "Sibling Test", value: 15 },
        { type: "Ancestry Test", value: 10 },
        { type: "Other Tests", value: 5 },
      ])

      setRecentBookings([
        {
          key: "1",
          id: "BK-001",
          customer: "John Doe",
          service: "Paternity Test",
          date: "2023-06-01",
          status: "Completed",
        },
        {
          key: "2",
          id: "BK-002",
          customer: "Jane Smith",
          service: "Maternity Test",
          date: "2023-06-02",
          status: "In Progress",
        },
        {
          key: "3",
          id: "BK-003",
          customer: "Robert Johnson",
          service: "Sibling Test",
          date: "2023-06-03",
          status: "Pending",
        },
        {
          key: "4",
          id: "BK-004",
          customer: "Emily Davis",
          service: "Ancestry Test",
          date: "2023-06-04",
          status: "Completed",
        },
        {
          key: "5",
          id: "BK-005",
          customer: "Michael Wilson",
          service: "Paternity Test",
          date: "2023-06-05",
          status: "Cancelled",
        },
      ])

      setLoading(false)
    }, 1000)
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
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
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
        return <Tag color={color}>{status}</Tag>
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
        <RangePicker onChange={(dates) => setDateRange(dates)} format="YYYY-MM-DD" />
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
            <Line {...revenueConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Weekly Kit Sales" loading={loading} extra={<Button type="link">View Details</Button>}>
            <Column {...kitSalesConfig} height={300} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Service Distribution" loading={loading} extra={<Button type="link">View Details</Button>}>
            <Pie {...serviceDistributionConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Bookings" loading={loading} extra={<Button type="link">View All</Button>}>
            <Table dataSource={recentBookings} columns={columns} pagination={false} size="small" />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Overview
