import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Table,
  Tag,
  Button,
  DatePicker,
  Divider,
} from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [stats, setStats] = useState({
    totalCustomer: 0,
    completedTests: 0,
    revenue: 0,
    kitsSold: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [chartData, setChartData] = useState({
    monthlyStats: [],
    statusDistribution: [],
    weeklyTrends: [],
  });

  // Generate chart data based on current stats and bookings
  const generateChartData = useCallback(() => {
    // Monthly stats simulation based on current data
    const monthlyStats = [
      {
        month: "Jan",
        customers: Math.floor(stats.totalCustomer * 0.15),
        tests: Math.floor(stats.completedTests * 0.12),
        kits: Math.floor(stats.kitsSold * 0.18),
      },
      {
        month: "Feb",
        customers: Math.floor(stats.totalCustomer * 0.18),
        tests: Math.floor(stats.completedTests * 0.16),
        kits: Math.floor(stats.kitsSold * 0.14),
      },
      {
        month: "Mar",
        customers: Math.floor(stats.totalCustomer * 0.22),
        tests: Math.floor(stats.completedTests * 0.2),
        kits: Math.floor(stats.kitsSold * 0.16),
      },
      {
        month: "Apr",
        customers: Math.floor(stats.totalCustomer * 0.16),
        tests: Math.floor(stats.completedTests * 0.18),
        kits: Math.floor(stats.kitsSold * 0.2),
      },
      {
        month: "May",
        customers: Math.floor(stats.totalCustomer * 0.19),
        tests: Math.floor(stats.completedTests * 0.22),
        kits: Math.floor(stats.kitsSold * 0.18),
      },
      {
        month: "Jun",
        customers: Math.floor(stats.totalCustomer * 0.1),
        tests: Math.floor(stats.completedTests * 0.12),
        kits: Math.floor(stats.kitsSold * 0.14),
      },
    ];

    // Status distribution based on recent bookings
    const statusCounts = recentBookings.reduce((acc, booking) => {
      const status = booking.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusDistribution = Object.entries(statusCounts).map(
      ([status, count]) => ({
        name: status,
        value: count,
        color:
          status === "Completed"
            ? "#52c41a"
            : status === "Pending"
            ? "#faad14"
            : status === "Cancelled"
            ? "#ff4d4f"
            : "#1890ff",
      })
    );

    // Weekly trends simulation
    const weeklyTrends = [
      {
        week: "Week 1",
        bookings: Math.floor(recentBookings.length * 0.2),
        revenue: Math.floor(stats.revenue * 0.15),
      },
      {
        week: "Week 2",
        bookings: Math.floor(recentBookings.length * 0.3),
        revenue: Math.floor(stats.revenue * 0.25),
      },
      {
        week: "Week 3",
        bookings: Math.floor(recentBookings.length * 0.25),
        revenue: Math.floor(stats.revenue * 0.3),
      },
      {
        week: "Week 4",
        bookings: Math.floor(recentBookings.length * 0.25),
        revenue: Math.floor(stats.revenue * 0.3),
      },
    ];

    setChartData({
      monthlyStats,
      statusDistribution,
      weeklyTrends,
    });
  }, [stats, recentBookings]);

  // Main function to fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    // Move getDateParams and fetchRecentBookings inside useCallback to avoid dependency warning
    const getDateParams = () => ({
      startDate: dateRange[0]?.format("YYYY-MM-DD"),
      endDate: dateRange[1]?.format("YYYY-MM-DD"),
    });

    const fetchRecentBookings = async () => {
      try {
        const response = await api.get("/booking/bookings", {
          params: { limit: 5 },
        });
        console.log("Recent bookings response:", response);

        const bookingsData = response.data?.data || response.data || [];
        setRecentBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching recent bookings:", error);
        let errorMessage = "Error fetching recent bookings";
        if (error.response?.data?.data) {
          errorMessage = error.response.data.data;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
        throw error;
      }
    };

    const fetchTotalCustomers = async () => {
      try {
        const response = await api.get("/admin/dashboard/customers", {
          params: getDateParams(),
        });
        console.log("Total customers response:", response);

        const customerData = response.data || {};
        setStats((prev) => ({
          ...prev,
          totalCustomer: customerData.totalCustomer || 0,
        }));
      } catch (error) {
        console.error("Error fetching total customers:", error);
        let errorMessage = "Error fetching total customers";
        if (error.response?.data?.data) {
          errorMessage = error.response.data.data;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
        throw error;
      }
    };

    const fetchCompletedTests = async () => {
      try {
        const response = await api.get("/booking/bookings", {
          params: getDateParams(),
        });
        console.log("Completed tests response:", response);

        const bookings = response.data?.data || response.data || [];
        const completedCount = Array.isArray(bookings)
          ? bookings.filter((b) => b.status === "Completed").length
          : 0;
        setStats((prev) => ({
          ...prev,
          completedTests: completedCount,
        }));
      } catch (error) {
        console.error("Error fetching completed tests:", error);
        let errorMessage = "Error fetching completed tests";
        if (error.response?.data?.data) {
          errorMessage = error.response.data.data;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
        throw error;
      }
    };

    const fetchKitsSold = async () => {
      try {
        const response = await api.get("/admin/kitInventory/available", {
          params: getDateParams(),
        });
        console.log("Kits sold response:", response);

        const kitsData = response.data?.data || response.data || [];
        const totalKitSold = Array.isArray(kitsData)
          ? kitsData.reduce((sum, kit) => sum + (kit.isSelled || 0), 0)
          : 0;
        setStats((prev) => ({
          ...prev,
          kitsSold: totalKitSold,
        }));
      } catch (error) {
        console.error("Error fetching kits sold:", error);
        let errorMessage = "Error fetching kits sold";
        if (error.response?.data?.data) {
          errorMessage = error.response.data.data;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
        throw error;
      }
    };

    try {
      setLoading(true);
      await Promise.all([
        fetchTotalCustomers(),
        fetchCompletedTests(),
        fetchKitsSold(),
        fetchRecentBookings(),
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      let errorMessage = "Failed to fetch dashboard data";
      if (error.response?.data?.data) {
        errorMessage = error.response.data.data;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // Generate chart data when stats or bookings change
  useEffect(() => {
    if (!loading) {
      generateChartData();
    }
  }, [generateChartData, loading]);

  // Fetch data on component mount and when date range changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Table columns for Recent Bookings
  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
    },
    {
      title: "Customer ID",
      dataIndex: "customerID",
      key: "customerID",
    },
    {
      title: "Service Type",
      dataIndex: "bookingType",
      key: "bookingType",
    },
    {
      title: "Request Date",
      dataIndex: "request_date",
      key: "request_date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue";
        if (status === "Completed") color = "green";
        if (status === "Pending") color = "orange";
        if (status === "Cancelled") color = "red";
        return <Tag color={color}>{status || "Unknown"}</Tag>;
      },
    },
  ];

  const COLORS = ["#52c41a", "#faad14", "#ff4d4f", "#1890ff", "#722ed1"];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}>
        <Title level={2}>Dashboard Overview</Title>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <RangePicker
            onChange={(dates) => setDateRange(dates)}
            format="YYYY-MM-DD"
          />
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchDashboardData}
            loading={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} justify="center" style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            loading={loading}
            style={{
              borderRadius: 16,
              minHeight: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(24, 144, 255, 0.1)",
              border: "1px solid #e6f7ff",
            }}>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                  Total Customers
                </span>
              }
              value={stats.totalCustomer}
              prefix={
                <UserOutlined style={{ color: "#1890ff", fontSize: 24 }} />
              }
              valueStyle={{
                color: "#1890ff",
                fontSize: 28,
                fontWeight: 700,
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            loading={loading}
            style={{
              borderRadius: 16,
              minHeight: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(82, 196, 26, 0.1)",
              border: "1px solid #f6ffed",
            }}>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                  Completed Tests
                </span>
              }
              value={stats.completedTests}
              prefix={
                <CheckCircleOutlined
                  style={{ color: "#52c41a", fontSize: 24 }}
                />
              }
              valueStyle={{
                color: "#52c41a",
                fontSize: 28,
                fontWeight: 700,
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            loading={loading}
            style={{
              borderRadius: 16,
              minHeight: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(235, 47, 150, 0.1)",
              border: "1px solid #fff0f6",
            }}>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                  Kits Sold
                </span>
              }
              value={stats.kitsSold}
              prefix={
                <MedicineBoxOutlined
                  style={{ color: "#eb2f96", fontSize: 24 }}
                />
              }
              valueStyle={{
                color: "#eb2f96",
                fontSize: 28,
                fontWeight: 700,
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            loading={loading}
            style={{
              borderRadius: 16,
              minHeight: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(250, 173, 20, 0.1)",
              border: "1px solid #fffbe6",
            }}>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                  Revenue
                </span>
              }
              value={stats.revenue}
              prefix="$"
              valueStyle={{
                color: "#faad14",
                fontSize: 28,
                fontWeight: 700,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {/* Monthly Performance Chart */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BarChartOutlined style={{ color: "#1890ff" }} />
                <span style={{ fontWeight: 600, fontSize: 18 }}>
                  Monthly Performance
                </span>
              </div>
            }
            loading={loading}
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: "#d9d9d9" }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: "#d9d9d9" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="customers"
                  fill="#1890ff"
                  name="Customers"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="tests"
                  fill="#52c41a"
                  name="Tests"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="kits"
                  fill="#eb2f96"
                  name="Kits"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Status Distribution Chart */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PieChartOutlined style={{ color: "#52c41a" }} />
                <span style={{ fontWeight: 600, fontSize: 18 }}>
                  Booking Status
                </span>
              </div>
            }
            loading={loading}
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value">
                  {chartData.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Weekly Trends Chart */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24}>
          <Card
            title={
              <span style={{ fontWeight: 600, fontSize: 18 }}>
                Weekly Trends
              </span>
            }
            loading={loading}
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData.weeklyTrends}>
                <defs>
                  <linearGradient
                    id="colorBookings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#52c41a" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: "#d9d9d9" }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: "#d9d9d9" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#1890ff"
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                  name="Bookings"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#52c41a"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Recent Bookings Table */}
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24}>
          <Card
            title={
              <span style={{ fontWeight: 600, fontSize: 18 }}>
                Recent Bookings
              </span>
            }
            loading={loading}
            extra={<Button type="link">View All</Button>}
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}>
            <Table
              dataSource={recentBookings}
              columns={columns}
              pagination={false}
              size="middle"
              locale={{
                emptyText: "No recent bookings available",
              }}
              style={{ minHeight: 300 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
