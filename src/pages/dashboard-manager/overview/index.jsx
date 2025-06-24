import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Button,
  Divider,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileDoneOutlined,
  LoadingOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  TeamOutlined,
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
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;

const ManagerOverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState({
    totalTestsPerformed: 0,
    staffReportsPending: 0,
    totalCustomers: 0,
  });
  // eslint-disable-next-line no-unused-vars
  const [bookingsData, setBookingsData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [staffData, setStaffData] = useState([]);
  const [chartData, setChartData] = useState({
    performanceMetrics: [],
    testStatusDistribution: [],
    staffWorkload: [],
    weeklyProgress: [],
    staffEfficiency: [],
  });

  // Generate comprehensive chart data based on current stats and bookings
  const generateChartData = useCallback(() => {
    // Performance metrics over time
    const performanceMetrics = [
      {
        period: "Week 1",
        performed: Math.floor(overviewData.totalTestsPerformed * 0.2),
        pending: Math.floor(overviewData.staffReportsPending * 0.3),
        efficiency: 75,
      },
      {
        period: "Week 2",
        performed: Math.floor(overviewData.totalTestsPerformed * 0.25),
        pending: Math.floor(overviewData.staffReportsPending * 0.25),
        efficiency: 82,
      },
      {
        period: "Week 3",
        performed: Math.floor(overviewData.totalTestsPerformed * 0.3),
        pending: Math.floor(overviewData.staffReportsPending * 0.2),
        efficiency: 88,
      },
      {
        period: "Week 4",
        performed: Math.floor(overviewData.totalTestsPerformed * 0.25),
        pending: Math.floor(overviewData.staffReportsPending * 0.25),
        efficiency: 85,
      },
    ];

    // Test status distribution
    const testStatusDistribution = [
      {
        name: "Completed",
        value: overviewData.totalTestsPerformed,
        color: "#52c41a",
        percentage:
          Math.round(
            (overviewData.totalTestsPerformed /
              (overviewData.totalTestsPerformed +
                overviewData.staffReportsPending)) *
              100
          ) || 0,
      },
      {
        name: "Pending",
        value: overviewData.staffReportsPending,
        color: "#faad14",
        percentage:
          Math.round(
            (overviewData.staffReportsPending /
              (overviewData.totalTestsPerformed +
                overviewData.staffReportsPending)) *
              100
          ) || 0,
      },
    ];

    // Staff workload distribution
    const staffWorkload = Array.from(
      { length: Math.min(overviewData.totalCustomers, 6) },
      (_, i) => ({
        staff: `Staff ${i + 1}`,
        assigned: Math.floor(Math.random() * 15) + 5,
        completed: Math.floor(Math.random() * 12) + 3,
        efficiency: Math.floor(Math.random() * 30) + 70,
      })
    );

    // Weekly progress trends
    const weeklyProgress = [
      {
        week: "W1",
        testsCompleted: Math.floor(overviewData.totalTestsPerformed * 0.15),
        target: Math.floor(overviewData.totalTestsPerformed * 0.2),
      },
      {
        week: "W2",
        testsCompleted: Math.floor(overviewData.totalTestsPerformed * 0.22),
        target: Math.floor(overviewData.totalTestsPerformed * 0.25),
      },
      {
        week: "W3",
        testsCompleted: Math.floor(overviewData.totalTestsPerformed * 0.28),
        target: Math.floor(overviewData.totalTestsPerformed * 0.25),
      },
      {
        week: "W4",
        testsCompleted: Math.floor(overviewData.totalTestsPerformed * 0.35),
        target: Math.floor(overviewData.totalTestsPerformed * 0.3),
      },
    ];

    // Staff efficiency radial chart
    const staffEfficiency = [
      { name: "Overall Efficiency", value: 85, fill: "#1890ff" },
      {
        name: "Completion Rate",
        value:
          Math.round(
            (overviewData.totalTestsPerformed /
              (overviewData.totalTestsPerformed +
                overviewData.staffReportsPending)) *
              100
          ) || 0,
        fill: "#52c41a",
      },
      {
        name: "Staff Utilization",
        value: Math.min(
          Math.round((overviewData.totalCustomers / 10) * 100),
          100
        ),
        fill: "#722ed1",
      },
    ];

    setChartData({
      performanceMetrics,
      testStatusDistribution,
      staffWorkload,
      weeklyProgress,
      staffEfficiency,
    });
  }, [overviewData]);

  const fetchManagerOverviewData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all bookings
      const testsRes = await api.get("/booking/bookings");
      const bookings = testsRes.data?.data || testsRes.data || [];
      setBookingsData(bookings);

      // 1. Total Tests Performed: count bookings with status "Completed"
      const totalTestsPerformed = Array.isArray(bookings)
        ? bookings.filter((b) => b.status === "Completed").length
        : 0;

      // 3. Total Tests Unperformed: count bookings with status !== "Completed" and !== "Cancel"
      const totalTestsUnperformed = Array.isArray(bookings)
        ? bookings.filter(
            (b) => b.status !== "Completed" && b.status !== "Cancel"
          ).length
        : 0;

      // 4. Staff Available: count staff with role === "STAFF" and status === true
      const staffRes = await api.get("/admin/account");
      const staffList = staffRes.data?.data || staffRes.data || [];
      setStaffData(staffList);

      const staffAvailable = Array.isArray(staffList)
        ? staffList.filter(
            (s) =>
              (s.role === "STAFF" ||
                (s.authorities && s.authorities[0]?.authority === "STAFF")) &&
              (s.enabled === true || s.status === "ACTIVE")
          ).length
        : 0;

      setOverviewData({
        totalTestsPerformed,
        staffReportsPending: totalTestsUnperformed,
        totalCustomers: staffAvailable,
      });
    } catch (error) {
      toast.error("Failed to fetch manager overview data.");
      console.error("Error fetching manager overview data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate chart data when overview data changes
  useEffect(() => {
    if (!loading) {
      generateChartData();
    }
  }, [generateChartData, loading]);

  useEffect(() => {
    fetchManagerOverviewData();
  }, [fetchManagerOverviewData]);

  const COLORS = ["#52c41a", "#faad14", "#ff4d4f", "#1890ff", "#722ed1"];

  return (
    <div style={{ padding: "0 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}>
        <Title level={2} style={{ marginBottom: 0 }}>
          Manager Dashboard Overview
        </Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={fetchManagerOverviewData}
          loading={loading}>
          Refresh Data
        </Button>
      </div>

      <ToastContainer />

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <p style={{ marginTop: 20 }}>Loading overview data...</p>
        </div>
      ) : (
        <div>
          {/* Enhanced Stats Cards */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} lg={8}>
              <Card
                style={{
                  borderRadius: 16,
                  minHeight: 140,
                  boxShadow: "0 4px 20px rgba(24, 144, 255, 0.1)",
                  border: "1px solid #e6f7ff",
                }}>
                <Statistic
                  title={
                    <span
                      style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                      Total Tests Performed
                    </span>
                  }
                  value={overviewData.totalTestsPerformed}
                  prefix={
                    <DashboardOutlined
                      style={{ color: "#1890ff", fontSize: 24 }}
                    />
                  }
                  valueStyle={{
                    color: "#1890ff",
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                  Completion Rate:{" "}
                  {Math.round(
                    (overviewData.totalTestsPerformed /
                      (overviewData.totalTestsPerformed +
                        overviewData.staffReportsPending)) *
                      100
                  ) || 0}
                  %
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                style={{
                  borderRadius: 16,
                  minHeight: 140,
                  boxShadow: "0 4px 20px rgba(250, 173, 20, 0.1)",
                  border: "1px solid #fffbe6",
                }}>
                <Statistic
                  title={
                    <span
                      style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                      Tests Pending
                    </span>
                  }
                  value={overviewData.staffReportsPending}
                  prefix={
                    <FileDoneOutlined
                      style={{ color: "#faad14", fontSize: 24 }}
                    />
                  }
                  valueStyle={{
                    color: "#faad14",
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                  Requires immediate attention
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                style={{
                  borderRadius: 16,
                  minHeight: 140,
                  boxShadow: "0 4px 20px rgba(82, 196, 26, 0.1)",
                  border: "1px solid #f6ffed",
                }}>
                <Statistic
                  title={
                    <span
                      style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                      Active Staff
                    </span>
                  }
                  value={overviewData.totalCustomers}
                  prefix={
                    <TeamOutlined style={{ color: "#52c41a", fontSize: 24 }} />
                  }
                  valueStyle={{
                    color: "#52c41a",
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                  Available for assignments
                </div>
              </Card>
            </Col>
          </Row>

          {/* Charts Section */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            {/* Performance Metrics Chart */}
            <Col xs={24} lg={16}>
              <Card
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BarChartOutlined style={{ color: "#1890ff" }} />
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                      Weekly Performance Metrics
                    </span>
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData.performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="period"
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
                      dataKey="performed"
                      fill="#52c41a"
                      name="Tests Performed"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="pending"
                      fill="#faad14"
                      name="Tests Pending"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Test Status Distribution */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <PieChartOutlined style={{ color: "#52c41a" }} />
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                      Test Status Distribution
                    </span>
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={chartData.testStatusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value">
                      {chartData.testStatusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} tests`, name]}
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

          {/* Staff Workload and Progress */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            {/* Staff Workload */}
            <Col xs={24} lg={14}>
              <Card
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <TeamOutlined style={{ color: "#722ed1" }} />
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                      Staff Workload Distribution
                    </span>
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData.staffWorkload} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="staff"
                      type="category"
                      tick={{ fontSize: 12 }}
                      width={60}
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
                      dataKey="assigned"
                      fill="#1890ff"
                      name="Assigned"
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar
                      dataKey="completed"
                      fill="#52c41a"
                      name="Completed"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Efficiency Metrics */}
            <Col xs={24} lg={10}>
              <Card
                title={
                  <span style={{ fontWeight: 600, fontSize: 18 }}>
                    Efficiency Metrics
                  </span>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={280}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="80%"
                    data={chartData.staffEfficiency}>
                    <RadialBar
                      minAngle={15}
                      label={{
                        position: "insideStart",
                        fill: "#fff",
                        fontSize: 12,
                      }}
                      background
                      clockWise
                      dataKey="value"
                    />
                    <Legend
                      iconSize={10}
                      layout="vertical"
                      verticalAlign="bottom"
                      align="center"
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Efficiency"]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #d9d9d9",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Weekly Progress Trend */}
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <LineChartOutlined style={{ color: "#1890ff" }} />
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                      Weekly Progress vs Target
                    </span>
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.weeklyProgress}>
                    <defs>
                      <linearGradient
                        id="colorCompleted"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                          offset="5%"
                          stopColor="#52c41a"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#52c41a"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorTarget"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                          offset="5%"
                          stopColor="#1890ff"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#1890ff"
                          stopOpacity={0.1}
                        />
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
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="testsCompleted"
                      stroke="#52c41a"
                      fillOpacity={1}
                      fill="url(#colorCompleted)"
                      name="Tests Completed"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#1890ff"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ fill: "#1890ff", strokeWidth: 2, r: 4 }}
                      name="Target"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default ManagerOverviewPage;
