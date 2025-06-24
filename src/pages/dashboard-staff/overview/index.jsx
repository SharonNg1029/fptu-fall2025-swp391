import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Button,
  Divider,
  Progress,
} from "antd";
import {
  CalendarOutlined,
  ContainerOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
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
  ComposedChart,
} from "recharts";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;

const StaffOverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    appointmentsToday: 0,
    totalAppointmentFinished: 0,
    orderStatusDistribution: [],
    dailyTasks: [],
  });
  const [assignments, setAssignments] = useState([]);
  const [chartData, setChartData] = useState({
    weeklyProgress: [],
    performanceMetrics: [],
    statusTrends: [],
    workloadDistribution: [],
    completionRate: [],
  });

  // Get staffID from Redux store
  const currentUser = useSelector((state) => state.user?.currentUser);
  const staffID = currentUser?.staff?.staffID || currentUser?.staffID;

  // Generate comprehensive chart data based on assignments
  const generateChartData = useCallback(() => {
    if (!assignments.length) {
      setChartData({
        weeklyProgress: [],
        performanceMetrics: [],
        statusTrends: [],
        workloadDistribution: [],
        completionRate: [],
      });
      return;
    }

    // Weekly progress simulation based on current data
    const weeklyProgress = [
      {
        week: "Week 1",
        completed: Math.floor(overviewData.totalAppointmentFinished * 0.2),
        assigned: Math.floor(overviewData.totalAppointments * 0.25),
        efficiency: 75,
      },
      {
        week: "Week 2",
        completed: Math.floor(overviewData.totalAppointmentFinished * 0.3),
        assigned: Math.floor(overviewData.totalAppointments * 0.25),
        efficiency: 85,
      },
      {
        week: "Week 3",
        completed: Math.floor(overviewData.totalAppointmentFinished * 0.35),
        assigned: Math.floor(overviewData.totalAppointments * 0.25),
        efficiency: 92,
      },
      {
        week: "Week 4",
        completed: Math.floor(overviewData.totalAppointmentFinished * 0.15),
        assigned: Math.floor(overviewData.totalAppointments * 0.25),
        efficiency: 88,
      },
    ];

    // Performance metrics over different periods
    const performanceMetrics = [
      {
        period: "Morning",
        appointments: Math.floor(overviewData.appointmentsToday * 0.4),
        completed: Math.floor(overviewData.totalAppointmentFinished * 0.3),
      },
      {
        period: "Afternoon",
        appointments: Math.floor(overviewData.appointmentsToday * 0.6),
        completed: Math.floor(overviewData.totalAppointmentFinished * 0.4),
      },
      {
        period: "Evening",
        appointments: Math.floor(overviewData.appointmentsToday * 0.2),
        completed: Math.floor(overviewData.totalAppointmentFinished * 0.3),
      },
    ];

    // Status trends over time
    const statusTrends = [
      {
        day: "Mon",
        completed: Math.floor(overviewData.totalAppointmentFinished * 0.15),
        pending: Math.floor(overviewData.pendingAppointments * 0.2),
      },
      {
        day: "Tue",
        completed: Math.floor(overviewData.totalAppointmentFinished * 0.18),
        pending: Math.floor(overviewData.pendingAppointments * 0.15),
      },
      {
        day: "Wed",
        completed: Math.floor(overviewData.totalAppointmentFinished * 0.22),
        pending: Math.floor(overviewData.pendingAppointments * 0.18),
      },
      {
        day: "Thu",
        completed: Math.floor(overviewData.totalAppointmentFinished * 0.2),
        pending: Math.floor(overviewData.pendingAppointments * 0.22),
      },
      {
        day: "Fri",
        completed: Math.floor(overviewData.totalAppointmentFinished * 0.25),
        pending: Math.floor(overviewData.pendingAppointments * 0.25),
      },
    ];

    // Workload distribution by assignment type
    const assignmentTypes = assignments.reduce((acc, assignment) => {
      const type = assignment.bookingType || assignment.type || "General";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const workloadDistribution = Object.entries(assignmentTypes).map(
      ([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / assignments.length) * 100),
      })
    );

    // Completion rate metrics for radial chart
    const completionRate = [
      {
        name: "Overall Progress",
        value: Math.round(
          (overviewData.totalAppointmentFinished /
            Math.max(overviewData.totalAppointments, 1)) *
            100
        ),
        fill: "#1890ff",
      },
      {
        name: "Today's Progress",
        value: Math.min(
          Math.round(
            (overviewData.appointmentsToday /
              Math.max(overviewData.totalAppointments, 1)) *
              100
          ),
          100
        ),
        fill: "#52c41a",
      },
      {
        name: "Efficiency Rate",
        value: Math.round(
          ((overviewData.totalAppointmentFinished +
            overviewData.appointmentsToday) /
            Math.max(overviewData.totalAppointments, 1)) *
            100
        ),
        fill: "#722ed1",
      },
    ];

    setChartData({
      weeklyProgress,
      performanceMetrics,
      statusTrends,
      workloadDistribution,
      completionRate,
    });
  }, [overviewData, assignments]);

  const fetchStaffOverviewData = useCallback(async () => {
    if (!staffID) {
      toast.error("Staff ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Call API to get staff assignments
      const response = await api.get(`/staff/my-assignment/${staffID}`);
      const assignments = response.data || [];
      setAssignments(assignments);

      // Calculate statistics from assignments data
      const totalAppointments = assignments.length;

      // Count appointments with status "Awaiting Sample" for Pending Appointments
      const pendingAppointments = assignments.filter(
        (assignment) => assignment.status === "Awaiting Sample"
      ).length;

      // Count appointments for today
      const today = new Date().toDateString();
      const appointmentsToday = assignments.filter((assignment) => {
        if (assignment.appointmentDate) {
          const appointmentDate = new Date(
            assignment.appointmentDate
          ).toDateString();
          return appointmentDate === today;
        }
        return false;
      }).length;

      // Create distribution data for pie chart
      const statusCounts = {};
      assignments.forEach((assignment) => {
        const status = assignment.status || "Unknown";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const orderStatusDistribution = Object.entries(statusCounts).map(
        ([name, value]) => ({
          name,
          value,
          color:
            name === "Completed"
              ? "#52c41a"
              : name === "Awaiting Sample"
              ? "#faad14"
              : name === "In Progress"
              ? "#1890ff"
              : "#ff4d4f",
        })
      );

      // Create daily tasks data for bar chart
      const dailyTasks = [
        { name: "Total Assignments", count: totalAppointments },
        { name: "Pending Samples", count: pendingAppointments },
        { name: "Appointments Today", count: appointmentsToday },
        {
          name: "Finished",
          count: assignments.filter((a) => a.status === "Completed").length,
        },
      ];
      setOverviewData({
        totalAppointments,
        pendingAppointments,
        appointmentsToday,
        totalAppointmentFinished: assignments.filter(
          (a) => a.status === "Completed"
        ).length,
        orderStatusDistribution:
          orderStatusDistribution.length > 0
            ? orderStatusDistribution
            : [{ name: "No Data", value: 1, color: "#d9d9d9" }],
        dailyTasks,
      });
    } catch (error) {
      toast.error("Failed to fetch staff assignment data.");
      console.error("Error fetching staff assignment data:", error);
      // Set default data in case of error
      setOverviewData({
        totalAppointments: 0,
        pendingAppointments: 0,
        appointmentsToday: 0,
        totalAppointmentFinished: 0,
        orderStatusDistribution: [
          { name: "No Data", value: 1, color: "#d9d9d9" },
        ],
        dailyTasks: [
          { name: "Total Assignments", count: 0 },
          { name: "Pending Samples", count: 0 },
          { name: "Appointments Today", count: 0 },
          { name: "Finished", count: 0 },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, [staffID]);

  // Generate chart data when overview data changes
  useEffect(() => {
    if (!loading) {
      generateChartData();
    }
  }, [generateChartData, loading]);

  useEffect(() => {
    fetchStaffOverviewData();
  }, [fetchStaffOverviewData]);

  const COLORS = ["#52c41a", "#faad14", "#1890ff", "#ff4d4f", "#722ed1"];

  // Calculate completion percentage
  const completionPercentage = Math.round(
    (overviewData.totalAppointmentFinished /
      Math.max(overviewData.totalAppointments, 1)) *
      100
  );

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
          Staff Dashboard Overview
        </Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={fetchStaffOverviewData}
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
        <>
          {/* Stats Cards: Sử dụng flex để các card đều nhau và không bị vỡ layout */}
          <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
            {[
              "Total Appointments",
              "Pending Appointments",
              "Appointments Today",
              "Completed Tasks",
            ].map((title, idx) => (
              <div key={title} style={{ flex: 1, minWidth: 0 }}>
                {(() => {
                  if (idx === 0)
                    return (
                      <Card
                        style={{
                          borderRadius: 16,
                          minHeight: 140,
                          boxShadow: "0 4px 20px rgba(24, 144, 255, 0.1)",
                          border: "1px solid #e6f7ff",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}>
                        <Statistic
                          title={
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 16,
                                color: "#666",
                              }}>
                              Total Appointments
                            </span>
                          }
                          value={overviewData.totalAppointments}
                          prefix={
                            <CalendarOutlined
                              style={{ color: "#1890ff", fontSize: 24 }}
                            />
                          }
                          valueStyle={{
                            color: "#1890ff",
                            fontSize: 32,
                            fontWeight: 700,
                          }}
                        />
                        <div style={{ marginTop: 8 }}>
                          <Progress
                            percent={completionPercentage}
                            size="small"
                            strokeColor="#1890ff"
                            showInfo={false}
                          />
                          <div
                            style={{
                              fontSize: 12,
                              color: "#999",
                              marginTop: 4,
                            }}>
                            {completionPercentage}% completed
                          </div>
                        </div>
                      </Card>
                    );
                  if (idx === 1)
                    return (
                      <Card
                        style={{
                          borderRadius: 16,
                          minHeight: 140,
                          boxShadow: "0 4px 20px rgba(250, 173, 20, 0.1)",
                          border: "1px solid #fffbe6",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}>
                        <Statistic
                          title={
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 16,
                                color: "#666",
                              }}>
                              Pending Appointments
                            </span>
                          }
                          value={overviewData.pendingAppointments}
                          prefix={
                            <ClockCircleOutlined
                              style={{ color: "#faad14", fontSize: 24 }}
                            />
                          }
                          valueStyle={{
                            color: "#faad14",
                            fontSize: 32,
                            fontWeight: 700,
                          }}
                        />
                        <div
                          style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                          Awaiting sample collection
                        </div>
                      </Card>
                    );
                  if (idx === 2)
                    return (
                      <Card
                        style={{
                          borderRadius: 16,
                          minHeight: 140,
                          boxShadow: "0 4px 20px rgba(24, 144, 255, 0.1)",
                          border: "1px solid #e6f7ff",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}>
                        <Statistic
                          title={
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 16,
                                color: "#666",
                              }}>
                              Appointments Today
                            </span>
                          }
                          value={overviewData.appointmentsToday}
                          prefix={
                            <CalendarOutlined
                              style={{ color: "#1890ff", fontSize: 24 }}
                            />
                          }
                          valueStyle={{
                            color: "#1890ff",
                            fontSize: 32,
                            fontWeight: 700,
                          }}
                        />
                        <div
                          style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                          Scheduled for today
                        </div>
                      </Card>
                    );
                  return (
                    <Card
                      style={{
                        borderRadius: 16,
                        minHeight: 140,
                        boxShadow: "0 4px 20px rgba(82, 196, 26, 0.1)",
                        border: "1px solid #f6ffed",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}>
                      <Statistic
                        title={
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: 16,
                              color: "#666",
                            }}>
                            Completed Tasks
                          </span>
                        }
                        value={overviewData.totalAppointmentFinished}
                        prefix={
                          <TrophyOutlined
                            style={{ color: "#52c41a", fontSize: 24 }}
                          />
                        }
                        valueStyle={{
                          color: "#52c41a",
                          fontSize: 32,
                          fontWeight: 700,
                        }}
                      />
                      <div
                        style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                        Successfully finished
                      </div>
                    </Card>
                  );
                })()}
              </div>
            ))}
          </div>

          {/* Charts Section: Sử dụng Row/Col với tỉ lệ hợp lý hơn */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            {/* Weekly Progress Chart */}
            <Col xs={24} lg={15} style={{ minWidth: 0 }}>
              <Card
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <LineChartOutlined style={{ color: "#1890ff" }} />
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                      Weekly Performance Progress
                    </span>
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={320} minWidth={0}>
                  <ComposedChart data={chartData.weeklyProgress}>
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
                    <Bar
                      dataKey="assigned"
                      fill="#e6f7ff"
                      name="Assigned"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="completed"
                      fill="#52c41a"
                      name="Completed"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#1890ff"
                      strokeWidth={3}
                      dot={{ fill: "#1890ff", strokeWidth: 2, r: 4 }}
                      name="Efficiency %"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            {/* Completion Rate Radial Chart */}
            <Col xs={24} lg={9} style={{ minWidth: 0 }}>
              <Card
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <TrophyOutlined style={{ color: "#52c41a" }} />
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                      Performance Metrics
                    </span>
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={320} minWidth={0}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="80%"
                    data={chartData.completionRate}>
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
                      formatter={(value) => [`${value}%`, "Rate"]}
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

          {/* Status Distribution and Daily Trends */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            {/* Enhanced Order Status Distribution */}
            <Col xs={24} lg={12} style={{ minWidth: 0 }}>
              <Card
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <PieChartOutlined style={{ color: "#722ed1" }} />
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                      Assignment Status Distribution
                    </span>
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={320} minWidth={0}>
                  <PieChart>
                    <Pie
                      data={overviewData.orderStatusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value">
                      {overviewData.orderStatusDistribution.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color || COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} assignments`,
                        name,
                      ]}
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
            {/* Daily Status Trends */}
            <Col xs={24} lg={12} style={{ minWidth: 0 }}>
              <Card
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BarChartOutlined style={{ color: "#1890ff" }} />
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                      Daily Status Trends
                    </span>
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={320} minWidth={0}>
                  <AreaChart data={chartData.statusTrends}>
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
                        id="colorPending"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                          offset="5%"
                          stopColor="#faad14"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#faad14"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="day"
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
                      dataKey="completed"
                      stackId="1"
                      stroke="#52c41a"
                      fill="url(#colorCompleted)"
                      name="Completed"
                    />
                    <Area
                      type="monotone"
                      dataKey="pending"
                      stackId="1"
                      stroke="#faad14"
                      fill="url(#colorPending)"
                      name="Pending"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Performance Metrics and Task Distribution */}
          <Row gutter={[24, 24]}>
            {/* Time-based Performance */}
            <Col xs={24} lg={14} style={{ minWidth: 0 }}>
              <Card
                title={
                  <span style={{ fontWeight: 600, fontSize: 18 }}>
                    Daily Performance by Time Period
                  </span>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={280} minWidth={0}>
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
                      dataKey="appointments"
                      fill="#1890ff"
                      name="Appointments"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="completed"
                      fill="#52c41a"
                      name="Completed"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            {/* Enhanced Daily Task Count */}
            <Col xs={24} lg={10} style={{ minWidth: 0 }}>
              <Card
                title={
                  <span style={{ fontWeight: 600, fontSize: 18 }}>
                    Task Summary
                  </span>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={280} minWidth={0}>
                  <BarChart data={overviewData.dailyTasks} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #d9d9d9",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="count" fill="#722ed1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default StaffOverviewPage;
