import React from "react"
import { useState, useEffect } from "react"
import {
  Tabs,
  Table,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tag,
  Typography,
  Tooltip,
  Modal,
  Descriptions,
  Alert,
  message,
} from "antd"
import {
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  ReloadOutlined,
  UserOutlined,
  LockOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  SafetyOutlined,
  BellOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons"

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

const SystemLogs = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("activity")

  // Data states
  const [activityLogs, setActivityLogs] = useState([])
  const [securityLogs, setSecurityLogs] = useState([])
  const [systemAlerts, setSystemAlerts] = useState([])

  // Search and filter states
  const [searchText, setSearchText] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [severityFilter, setSeverityFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [userFilter, setUserFilter] = useState("")
  const [dateRange, setDateRange] = useState(null)

  // Modal states
  const [isActivityDetailModalVisible, setIsActivityDetailModalVisible] = useState(false)
  const [isSecurityDetailModalVisible, setIsSecurityDetailModalVisible] = useState(false)
  const [isAlertDetailModalVisible, setIsAlertDetailModalVisible] = useState(false)
  const [selectedActivityLog, setSelectedActivityLog] = useState(null)
  const [selectedSecurityLog, setSelectedSecurityLog] = useState(null)
  const [selectedAlert, setSelectedAlert] = useState(null)

  // Fetch logs data
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      // Mock activity logs
      const mockActivityLogs = [
        {
          id: "ACT001",
          timestamp: "2023-06-01 10:30:00",
          user: "admin@genetix.com",
          userRole: "Admin",
          action: "User Login",
          details: "Successful login from IP: 192.168.1.100",
          type: "Authentication",
          status: "Success",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          sessionId: "sess_123456789",
        },
        {
          id: "ACT002",
          timestamp: "2023-06-01 10:35:00",
          user: "admin@genetix.com",
          userRole: "Admin",
          action: "Account Created",
          details: "Created new staff account: staff3@genetix.com",
          type: "Account Management",
          status: "Success",
          ipAddress: "192.168.1.100",
          targetUser: "staff3@genetix.com",
          changes: "Created new staff account with role: Staff",
        },
        {
          id: "ACT003",
          timestamp: "2023-06-01 11:00:00",
          user: "manager@genetix.com",
          userRole: "Manager",
          action: "Service Updated",
          details: "Updated pricing for Paternity DNA Test from $199.99 to $189.99",
          type: "Service Management",
          status: "Success",
          ipAddress: "192.168.1.105",
          serviceId: "SRV001",
          oldValue: "$199.99",
          newValue: "$189.99",
        },
        {
          id: "ACT004",
          timestamp: "2023-06-01 11:15:00",
          user: "staff1@genetix.com",
          userRole: "Staff",
          action: "Inventory Added",
          details: "Added 50 units of DNA-PAT-001 kits to Warehouse A",
          type: "Inventory Management",
          status: "Success",
          ipAddress: "192.168.1.110",
          kitCode: "DNA-PAT-001",
          quantity: 50,
          location: "Warehouse A",
        },
        {
          id: "ACT005",
          timestamp: "2023-06-01 11:30:00",
          user: "admin@genetix.com",
          userRole: "Admin",
          action: "Account Deleted",
          details: "Deleted customer account: customer5@genetix.com",
          type: "Account Management",
          status: "Success",
          ipAddress: "192.168.1.100",
          targetUser: "customer5@genetix.com",
          reason: "Account closure requested by customer",
        },
        {
          id: "ACT006",
          timestamp: "2023-06-01 12:00:00",
          user: "staff2@genetix.com",
          userRole: "Staff",
          action: "Test Result Updated",
          details: "Updated test result for order ORD-2023-001",
          type: "Test Management",
          status: "Success",
          ipAddress: "192.168.1.115",
          orderId: "ORD-2023-001",
          testStatus: "Completed",
        },
        {
          id: "ACT007",
          timestamp: "2023-06-01 14:20:00",
          user: "manager@genetix.com",
          userRole: "Manager",
          action: "Blog Post Published",
          details: "Published blog post: Understanding DNA Testing",
          type: "Content Management",
          status: "Success",
          ipAddress: "192.168.1.105",
          postId: "BLOG001",
          postTitle: "Understanding DNA Testing",
        },
        {
          id: "ACT008",
          timestamp: "2023-06-01 15:45:00",
          user: "staff1@genetix.com",
          userRole: "Staff",
          action: "Password Change Failed",
          details: "Failed password change attempt - incorrect current password",
          type: "Authentication",
          status: "Failed",
          ipAddress: "192.168.1.110",
          failureReason: "Incorrect current password",
        },
      ]

      // Mock security logs
      const mockSecurityLogs = [
        {
          id: "SEC001",
          timestamp: "2023-06-01 09:45:00",
          user: "unknown@example.com",
          action: "Failed Login Attempt",
          details: "Multiple failed login attempts from IP: 203.0.113.1",
          severity: "High",
          status: "Blocked",
          ipAddress: "203.0.113.1",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          attemptCount: 5,
          location: "Unknown",
          threatType: "Brute Force Attack",
        },
        {
          id: "SEC002",
          timestamp: "2023-06-01 10:00:00",
          user: "admin@genetix.com",
          action: "Password Changed",
          details: "Password successfully changed for admin account",
          severity: "Low",
          status: "Success",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          location: "Office Network",
          previousPasswordAge: "90 days",
        },
        {
          id: "SEC003",
          timestamp: "2023-06-01 10:15:00",
          user: "staff2@genetix.com",
          action: "Suspicious Activity",
          details: "Unusual access pattern detected - login from new location",
          severity: "Medium",
          status: "Monitoring",
          ipAddress: "198.51.100.42",
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          location: "New York, USA",
          riskScore: 75,
          previousLocation: "San Francisco, USA",
        },
        {
          id: "SEC004",
          timestamp: "2023-06-01 10:30:00",
          user: "system",
          action: "Account Locked",
          details: "Account automatically locked due to multiple failed attempts: test@example.com",
          severity: "Medium",
          status: "Locked",
          ipAddress: "203.0.113.5",
          targetAccount: "test@example.com",
          lockDuration: "30 minutes",
          attemptCount: 3,
        },
        {
          id: "SEC005",
          timestamp: "2023-06-01 11:00:00",
          user: "admin@genetix.com",
          action: "Privilege Escalation",
          details: "Admin privileges granted to manager@genetix.com",
          severity: "High",
          status: "Success",
          ipAddress: "192.168.1.100",
          targetUser: "manager@genetix.com",
          oldRole: "Manager",
          newRole: "Admin",
          approvedBy: "admin@genetix.com",
        },
        {
          id: "SEC006",
          timestamp: "2023-06-01 12:30:00",
          user: "unknown",
          action: "SQL Injection Attempt",
          details: "Malicious SQL injection attempt detected on login form",
          severity: "Critical",
          status: "Blocked",
          ipAddress: "198.51.100.100",
          userAgent: "sqlmap/1.6.12",
          attackVector: "Login Form",
          payload: "' OR '1'='1' --",
          threatType: "SQL Injection",
        },
        {
          id: "SEC007",
          timestamp: "2023-06-01 14:15:00",
          user: "staff1@genetix.com",
          action: "Data Export",
          details: "Large dataset exported - customer information",
          severity: "Medium",
          status: "Success",
          ipAddress: "192.168.1.110",
          dataType: "Customer Information",
          recordCount: 1500,
          exportFormat: "CSV",
          approvedBy: "manager@genetix.com",
        },
        {
          id: "SEC008",
          timestamp: "2023-06-01 16:45:00",
          user: "unknown",
          action: "DDoS Attack",
          details: "Distributed denial of service attack detected",
          severity: "Critical",
          status: "Mitigated",
          ipAddress: "Multiple IPs",
          attackType: "HTTP Flood",
          requestCount: 10000,
          duration: "15 minutes",
          mitigationMethod: "Rate Limiting",
        },
      ]

      // Mock system alerts
      const mockSystemAlerts = [
        {
          id: "ALT001",
          timestamp: "2023-06-01 08:00:00",
          type: "Inventory",
          title: "Low Stock Alert",
          message: "DNA-SIB-001 kits below threshold (18/20)",
          severity: "Warning",
          status: "Active",
          affectedSystem: "Inventory Management",
          threshold: 20,
          currentValue: 18,
          recommendedAction: "Restock DNA-SIB-001 kits immediately",
          priority: "Medium",
        },
        {
          id: "ALT002",
          timestamp: "2023-06-01 08:30:00",
          type: "System",
          title: "Database Backup Completed",
          message: "Daily database backup completed successfully",
          severity: "Info",
          status: "Resolved",
          affectedSystem: "Database",
          backupSize: "2.5 GB",
          duration: "15 minutes",
          location: "AWS S3 Backup",
          priority: "Low",
        },
        {
          id: "ALT003",
          timestamp: "2023-06-01 09:00:00",
          type: "Security",
          title: "Unusual Login Pattern",
          message: "Multiple login attempts from IP: 203.0.113.1",
          severity: "High",
          status: "Active",
          affectedSystem: "Authentication",
          ipAddress: "203.0.113.1",
          attemptCount: 15,
          timeWindow: "5 minutes",
          recommendedAction: "Block IP address and investigate",
          priority: "High",
        },
        {
          id: "ALT004",
          timestamp: "2023-06-01 09:30:00",
          type: "Performance",
          title: "High Server Response Time",
          message: "Server response time above normal threshold (2.5s avg)",
          severity: "Medium",
          status: "Monitoring",
          affectedSystem: "Web Server",
          threshold: "2.0s",
          currentValue: "2.5s",
          duration: "10 minutes",
          recommendedAction: "Monitor server performance and check for bottlenecks",
          priority: "Medium",
        },
        {
          id: "ALT005",
          timestamp: "2023-06-01 10:15:00",
          type: "Inventory",
          title: "Out of Stock Alert",
          message: "DNA-PRE-001 kits are completely out of stock",
          severity: "Critical",
          status: "Active",
          affectedSystem: "Inventory Management",
          threshold: 10,
          currentValue: 0,
          recommendedAction: "Emergency restock required - contact supplier immediately",
          priority: "Critical",
        },
        {
          id: "ALT006",
          timestamp: "2023-06-01 11:00:00",
          type: "System",
          title: "Disk Space Warning",
          message: "Server disk space usage at 85%",
          severity: "Warning",
          status: "Active",
          affectedSystem: "File System",
          threshold: "80%",
          currentValue: "85%",
          availableSpace: "150 GB",
          recommendedAction: "Clean up old files or expand storage",
          priority: "Medium",
        },
        {
          id: "ALT007",
          timestamp: "2023-06-01 12:30:00",
          type: "Application",
          title: "Payment Gateway Error",
          message: "Payment processing failures detected",
          severity: "High",
          status: "Investigating",
          affectedSystem: "Payment System",
          errorRate: "15%",
          affectedTransactions: 23,
          timeWindow: "30 minutes",
          recommendedAction: "Check payment gateway connection and logs",
          priority: "High",
        },
        {
          id: "ALT008",
          timestamp: "2023-06-01 14:00:00",
          type: "Security",
          title: "SSL Certificate Expiring",
          message: "SSL certificate expires in 7 days",
          severity: "Warning",
          status: "Active",
          affectedSystem: "Web Security",
          expiryDate: "2023-06-08",
          domain: "genetix.com",
          daysRemaining: 7,
          recommendedAction: "Renew SSL certificate before expiry",
          priority: "Medium",
        },
      ]

      setActivityLogs(mockActivityLogs)
      setSecurityLogs(mockSecurityLogs)
      setSystemAlerts(mockSystemAlerts)
      setLoading(false)
    }, 1000)
  }, [])

  // Handle view details
  const handleViewActivityDetails = (record) => {
    setSelectedActivityLog(record)
    setIsActivityDetailModalVisible(true)
  }

  const handleViewSecurityDetails = (record) => {
    setSelectedSecurityLog(record)
    setIsSecurityDetailModalVisible(true)
  }

  const handleViewAlertDetails = (record) => {
    setSelectedAlert(record)
    setIsAlertDetailModalVisible(true)
  }

  // Handle resolve alert
  const handleResolveAlert = (id) => {
    setSystemAlerts(systemAlerts.map((alert) => (alert.id === id ? { ...alert, status: "Resolved" } : alert)))
    message.success("Alert marked as resolved")
  }

  // Filter functions
  const filterActivityLogs = () => {
    return activityLogs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchText.toLowerCase()) ||
        log.action.toLowerCase().includes(searchText.toLowerCase()) ||
        log.details.toLowerCase().includes(searchText.toLowerCase()) ||
        log.id.toLowerCase().includes(searchText.toLowerCase())

      const matchesType = typeFilter === "" || log.type === typeFilter
      const matchesUser = userFilter === "" || log.user === userFilter

      const matchesDateRange =
        !dateRange ||
        !dateRange[0] ||
        !dateRange[1] ||
        (new Date(log.timestamp) >= dateRange[0].startOf("day").toDate() &&
          new Date(log.timestamp) <= dateRange[1].endOf("day").toDate())

      return matchesSearch && matchesType && matchesUser && matchesDateRange
    })
  }

  const filterSecurityLogs = () => {
    return securityLogs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchText.toLowerCase()) ||
        log.action.toLowerCase().includes(searchText.toLowerCase()) ||
        log.details.toLowerCase().includes(searchText.toLowerCase()) ||
        log.id.toLowerCase().includes(searchText.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchText.toLowerCase())

      const matchesSeverity = severityFilter === "" || log.severity === severityFilter
      const matchesStatus = statusFilter === "" || log.status === statusFilter

      const matchesDateRange =
        !dateRange ||
        !dateRange[0] ||
        !dateRange[1] ||
        (new Date(log.timestamp) >= dateRange[0].startOf("day").toDate() &&
          new Date(log.timestamp) <= dateRange[1].endOf("day").toDate())

      return matchesSearch && matchesSeverity && matchesStatus && matchesDateRange
    })
  }

  const filterSystemAlerts = () => {
    return systemAlerts.filter((alert) => {
      const matchesSearch =
        alert.title.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.id.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.affectedSystem.toLowerCase().includes(searchText.toLowerCase())

      const matchesType = typeFilter === "" || alert.type === typeFilter
      const matchesSeverity = severityFilter === "" || alert.severity === severityFilter
      const matchesStatus = statusFilter === "" || alert.status === statusFilter

      const matchesDateRange =
        !dateRange ||
        !dateRange[0] ||
        !dateRange[1] ||
        (new Date(alert.timestamp) >= dateRange[0].startOf("day").toDate() &&
          new Date(alert.timestamp) <= dateRange[1].endOf("day").toDate())

      return matchesSearch && matchesType && matchesSeverity && matchesStatus && matchesDateRange
    })
  }

  // Get unique users for filter
  const users = [...new Set(activityLogs.map((log) => log.user))]

  // Calculate statistics
  const activityStats = {
    totalActivities: activityLogs.length,
    successful: activityLogs.filter((log) => log.status === "Success").length,
    failed: activityLogs.filter((log) => log.status === "Failed").length,
    uniqueUsers: users.length,
  }

  const securityStats = {
    totalEvents: securityLogs.length,
    highSeverity: securityLogs.filter((log) => log.severity === "High" || log.severity === "Critical").length,
    blocked: securityLogs.filter((log) => log.status === "Blocked").length,
    critical: securityLogs.filter((log) => log.severity === "Critical").length,
  }

  const alertStats = {
    totalAlerts: systemAlerts.length,
    active: systemAlerts.filter((alert) => alert.status === "Active").length,
    critical: systemAlerts.filter((alert) => alert.severity === "Critical").length,
    resolved: systemAlerts.filter((alert) => alert.status === "Resolved").length,
  }

  // Table columns
  const activityColumns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      width: 150,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <UserOutlined />
            <Text>{text}</Text>
          </Space>
          <Tag size="small" color="blue">
            {record.userRole}
          </Tag>
        </Space>
      ),
      width: 200,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 150,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = "blue"
        if (type === "Authentication") color = "green"
        if (type === "Account Management") color = "purple"
        if (type === "Service Management") color = "orange"
        if (type === "Inventory Management") color = "cyan"
        if (type === "Test Management") color = "magenta"
        if (type === "Content Management") color = "geekblue"
        return <Tag color={color}>{type}</Tag>
      },
      filters: [
        { text: "Authentication", value: "Authentication" },
        { text: "Account Management", value: "Account Management" },
        { text: "Service Management", value: "Service Management" },
        { text: "Inventory Management", value: "Inventory Management" },
        { text: "Test Management", value: "Test Management" },
        { text: "Content Management", value: "Content Management" },
      ],
      onFilter: (value, record) => record.type === value,
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "Success" ? "green" : "red"
        const icon = status === "Success" ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        )
      },
      filters: [
        { text: "Success", value: "Success" },
        { text: "Failed", value: "Failed" },
      ],
      onFilter: (value, record) => record.status === value,
      width: 100,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewActivityDetails(record)}
          />
        </Tooltip>
      ),
      width: 80,
    },
  ]

  const securityColumns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      width: 150,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text) => (
        <Space>
          <LockOutlined />
          <Text>{text}</Text>
        </Space>
      ),
      width: 180,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 150,
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (severity) => {        let color = "blue"
        let icon = <SafetyOutlined />
        if (severity === "Critical") {
          color = "red"
          icon = <ExclamationCircleOutlined />
        } else if (severity === "High") {
          color = "orange"
          icon = <WarningOutlined />
        } else if (severity === "Medium") {
          color = "yellow"
          icon = <WarningOutlined />
        } else if (severity === "Low") {
          color = "green"
          icon = <SafetyOutlined />
        }
        return (
          <Tag color={color} icon={icon}>
            {severity}
          </Tag>
        )
      },
      filters: [
        { text: "Critical", value: "Critical" },
        { text: "High", value: "High" },
        { text: "Medium", value: "Medium" },
        { text: "Low", value: "Low" },
      ],
      onFilter: (value, record) => record.severity === value,
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue"
        if (status === "Blocked") color = "red"
        if (status === "Success") color = "green"
        if (status === "Monitoring") color = "orange"
        if (status === "Locked") color = "purple"
        if (status === "Mitigated") color = "cyan"
        return <Tag color={color}>{status}</Tag>
      },
      filters: [
        { text: "Blocked", value: "Blocked" },
        { text: "Success", value: "Success" },
        { text: "Monitoring", value: "Monitoring" },
        { text: "Locked", value: "Locked" },
        { text: "Mitigated", value: "Mitigated" },
      ],
      onFilter: (value, record) => record.status === value,
      width: 120,
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 130,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewSecurityDetails(record)}
          />
        </Tooltip>
      ),
      width: 80,
    },
  ]

  const alertColumns = [
    {
      title: "Alert ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      width: 150,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = "blue"
        if (type === "Security") color = "red"
        if (type === "Inventory") color = "orange"
        if (type === "System") color = "green"
        if (type === "Performance") color = "purple"
        if (type === "Application") color = "cyan"
        return <Tag color={color}>{type}</Tag>
      },
      filters: [
        { text: "Security", value: "Security" },
        { text: "Inventory", value: "Inventory" },
        { text: "System", value: "System" },
        { text: "Performance", value: "Performance" },
        { text: "Application", value: "Application" },
      ],
      onFilter: (value, record) => record.type === value,
      width: 120,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.affectedSystem}
          </Text>
        </Space>
      ),
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (severity) => {
        let color = "blue"
        let icon = <BellOutlined />
        if (severity === "Critical") {
          color = "red"
          icon = <ExclamationCircleOutlined />
        } else if (severity === "High") {
          color = "orange"
          icon = <WarningOutlined />
        } else if (severity === "Warning" || severity === "Medium") {
          color = "yellow"
          icon = <WarningOutlined />
        } else if (severity === "Info") {
          color = "green"
          icon = <CheckCircleOutlined />
        }
        return (
          <Tag color={color} icon={icon}>
            {severity}
          </Tag>
        )
      },
      filters: [
        { text: "Critical", value: "Critical" },
        { text: "High", value: "High" },
        { text: "Warning", value: "Warning" },
        { text: "Medium", value: "Medium" },
        { text: "Info", value: "Info" },
      ],
      onFilter: (value, record) => record.severity === value,
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue"
        let icon = <ClockCircleOutlined />
        if (status === "Active") {
          color = "red"
          icon = <ExclamationCircleOutlined />
        } else if (status === "Resolved") {
          color = "green"
          icon = <CheckCircleOutlined />
        } else if (status === "Monitoring") {
          color = "orange"
          icon = <ClockCircleOutlined />
        } else if (status === "Investigating") {
          color = "purple"
          icon = <ClockCircleOutlined />
        }
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        )
      },
      filters: [
        { text: "Active", value: "Active" },
        { text: "Resolved", value: "Resolved" },
        { text: "Monitoring", value: "Monitoring" },
        { text: "Investigating", value: "Investigating" },
      ],
      onFilter: (value, record) => record.status === value,
      width: 120,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => {
        let color = "blue"
        if (priority === "Critical") color = "red"
        if (priority === "High") color = "orange"
        if (priority === "Medium") color = "yellow"
        if (priority === "Low") color = "green"
        return <Tag color={color}>{priority}</Tag>
      },
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="primary" icon={<EyeOutlined />} size="small" onClick={() => handleViewAlertDetails(record)} />
          </Tooltip>
          {record.status === "Active" && (
            <Tooltip title="Mark as Resolved">
              <Button
                type="default"
                icon={<CheckCircleOutlined />}
                size="small"
                onClick={() => handleResolveAlert(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
      width: 120,
    },
  ]

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={2}>System Logs & Monitoring</Title>
        <Space>
          <Button icon={<DownloadOutlined />}>Export</Button>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => {
              setLoading(true)
              setTimeout(() => setLoading(false), 1000)
            }}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Critical alerts banner */}
      {alertStats.critical > 0 && (
        <Alert
          message="Critical System Alerts"
          description={`${alertStats.critical} critical alerts require immediate attention.`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" danger onClick={() => setActiveTab("alerts")}>
              View Critical
            </Button>
          }
        />
      )}

      {securityStats.critical > 0 && (
        <Alert
          message="Critical Security Events Detected"
          description={`${securityStats.critical} critical security events require immediate attention.`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" danger onClick={() => setActiveTab("security")}>
              View Security Events
            </Button>
          }
        />
      )}

      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        {/* Activity Logs Tab */}
        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              Activity Logs
            </span>
          }
          key="activity"
        >
          {/* Activity Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Activities"
                  value={activityStats.totalActivities}
                  prefix={<HistoryOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Successful"
                  value={activityStats.successful}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Failed"
                  value={activityStats.failed}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic title="Unique Users" value={activityStats.uniqueUsers} prefix={<UserOutlined />} />
              </Card>
            </Col>
          </Row>

          {/* Activity Filters */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8}>
                <Input
                  placeholder="Search activity logs..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={6}>
                <Select
                  placeholder="Filter by type"
                  value={typeFilter}
                  onChange={setTypeFilter}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="Authentication">Authentication</Option>
                  <Option value="Account Management">Account Management</Option>
                  <Option value="Service Management">Service Management</Option>
                  <Option value="Inventory Management">Inventory Management</Option>
                  <Option value="Test Management">Test Management</Option>
                  <Option value="Content Management">Content Management</Option>
                </Select>
              </Col>
              <Col xs={24} sm={6}>
                <Select
                  placeholder="Filter by user"
                  value={userFilter}
                  onChange={setUserFilter}
                  style={{ width: "100%" }}
                  allowClear
                >
                  {users.map((user) => (
                    <Option key={user} value={user}>
                      {user}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <RangePicker
                  style={{ width: "100%" }}
                  onChange={(dates) => setDateRange(dates)}
                  placeholder={["Start", "End"]}
                />
              </Col>
            </Row>
          </Card>

          {/* Activity Logs Table */}
          <Card>
            <Table
              loading={loading}
              columns={activityColumns}
              dataSource={filterActivityLogs()}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} logs`,
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>

        {/* Security Logs Tab */}
        <TabPane
          tab={
            <span>
              <LockOutlined />
              Security Logs
            </span>
          }
          key="security"
        >
          {/* Security Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic title="Total Events" value={securityStats.totalEvents} prefix={<LockOutlined />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="High Severity"
                  value={securityStats.highSeverity}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Blocked"
                  value={securityStats.blocked}
                  prefix={<LockOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Critical"
                  value={securityStats.critical}
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Security Filters */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8}>
                <Input
                  placeholder="Search security logs..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={6}>
                <Select
                  placeholder="Filter by severity"
                  value={severityFilter}
                  onChange={setSeverityFilter}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="Critical">Critical</Option>
                  <Option value="High">High</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Low">Low</Option>
                </Select>
              </Col>
              <Col xs={24} sm={6}>
                <Select
                  placeholder="Filter by status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="Blocked">Blocked</Option>
                  <Option value="Success">Success</Option>
                  <Option value="Monitoring">Monitoring</Option>
                  <Option value="Locked">Locked</Option>
                  <Option value="Mitigated">Mitigated</Option>
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <RangePicker
                  style={{ width: "100%" }}
                  onChange={(dates) => setDateRange(dates)}
                  placeholder={["Start", "End"]}
                />
              </Col>
            </Row>
          </Card>

          {/* Security Logs Table */}
          <Card>
            <Table
              loading={loading}
              columns={securityColumns}
              dataSource={filterSecurityLogs()}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} logs`,
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>

        {/* System Alerts Tab */}
        <TabPane
          tab={
            <span>
              <WarningOutlined />
              System Alerts
            </span>
          }
          key="alerts"
        >
          {/* Alert Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic title="Total Alerts" value={alertStats.totalAlerts} prefix={<BellOutlined />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Active Alerts"
                  value={alertStats.active}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Critical Alerts"
                  value={alertStats.critical}
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Resolved"
                  value={alertStats.resolved}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Alert Filters */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={6}>
                <Input
                  placeholder="Search alerts..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={4}>
                <Select
                  placeholder="Type"
                  value={typeFilter}
                  onChange={setTypeFilter}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="Security">Security</Option>
                  <Option value="Inventory">Inventory</Option>
                  <Option value="System">System</Option>
                  <Option value="Performance">Performance</Option>
                  <Option value="Application">Application</Option>
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <Select
                  placeholder="Severity"
                  value={severityFilter}
                  onChange={setSeverityFilter}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="Critical">Critical</Option>
                  <Option value="High">High</Option>
                  <Option value="Warning">Warning</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Info">Info</Option>
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <Select
                  placeholder="Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="Active">Active</Option>
                  <Option value="Resolved">Resolved</Option>
                  <Option value="Monitoring">Monitoring</Option>
                  <Option value="Investigating">Investigating</Option>
                </Select>
              </Col>
              <Col xs={24} sm={6}>
                <RangePicker
                  style={{ width: "100%" }}
                  onChange={(dates) => setDateRange(dates)}
                  placeholder={["Start Date", "End Date"]}
                />
              </Col>
            </Row>
          </Card>

          {/* System Alerts Table */}
          <Card>
            <Table
              loading={loading}
              columns={alertColumns}
              dataSource={filterSystemAlerts()}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} alerts`,
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <div>
                    <p style={{ margin: 0 }}>
                      <Text strong>Message:</Text> {record.message}
                    </p>
                    {record.recommendedAction && (
                      <p style={{ margin: "8px 0 0 0" }}>
                        <Text strong>Recommended Action:</Text> {record.recommendedAction}
                      </p>
                    )}
                  </div>
                ),
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Activity Log Details Modal */}
      <Modal
        title="Activity Log Details"
        open={isActivityDetailModalVisible}
        onCancel={() => {
          setIsActivityDetailModalVisible(false)
          setSelectedActivityLog(null)
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsActivityDetailModalVisible(false)
              setSelectedActivityLog(null)
            }}
          >
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedActivityLog && (
          <Descriptions title="Log Information" bordered column={2}>
            <Descriptions.Item label="Log ID">{selectedActivityLog.id}</Descriptions.Item>
            <Descriptions.Item label="Timestamp">{selectedActivityLog.timestamp}</Descriptions.Item>
            <Descriptions.Item label="User">{selectedActivityLog.user}</Descriptions.Item>
            <Descriptions.Item label="User Role">
              <Tag color="blue">{selectedActivityLog.userRole}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Action">{selectedActivityLog.action}</Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color="purple">{selectedActivityLog.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedActivityLog.status === "Success" ? "green" : "red"}>{selectedActivityLog.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="IP Address">{selectedActivityLog.ipAddress}</Descriptions.Item>
            <Descriptions.Item label="Details" span={2}>
              {selectedActivityLog.details}
            </Descriptions.Item>

            {/* Additional fields based on log type */}
            {selectedActivityLog.sessionId && (
              <Descriptions.Item label="Session ID">{selectedActivityLog.sessionId}</Descriptions.Item>
            )}
            {selectedActivityLog.targetUser && (
              <Descriptions.Item label="Target User">{selectedActivityLog.targetUser}</Descriptions.Item>
            )}
            {selectedActivityLog.serviceId && (
              <Descriptions.Item label="Service ID">{selectedActivityLog.serviceId}</Descriptions.Item>
            )}
            {selectedActivityLog.oldValue && (
              <Descriptions.Item label="Old Value">{selectedActivityLog.oldValue}</Descriptions.Item>
            )}
            {selectedActivityLog.newValue && (
              <Descriptions.Item label="New Value">{selectedActivityLog.newValue}</Descriptions.Item>
            )}
            {selectedActivityLog.kitCode && (
              <Descriptions.Item label="Kit Code">{selectedActivityLog.kitCode}</Descriptions.Item>
            )}
            {selectedActivityLog.quantity && (
              <Descriptions.Item label="Quantity">{selectedActivityLog.quantity}</Descriptions.Item>
            )}
            {selectedActivityLog.location && (
              <Descriptions.Item label="Location">{selectedActivityLog.location}</Descriptions.Item>
            )}
            {selectedActivityLog.orderId && (
              <Descriptions.Item label="Order ID">{selectedActivityLog.orderId}</Descriptions.Item>
            )}
            {selectedActivityLog.postId && (
              <Descriptions.Item label="Post ID">{selectedActivityLog.postId}</Descriptions.Item>
            )}
            {selectedActivityLog.failureReason && (
              <Descriptions.Item label="Failure Reason" span={2}>
                {selectedActivityLog.failureReason}
              </Descriptions.Item>
            )}
            {selectedActivityLog.userAgent && (
              <Descriptions.Item label="User Agent" span={2}>
                {selectedActivityLog.userAgent}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Security Log Details Modal */}
      <Modal
        title="Security Log Details"
        open={isSecurityDetailModalVisible}
        onCancel={() => {
          setIsSecurityDetailModalVisible(false)
          setSelectedSecurityLog(null)
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsSecurityDetailModalVisible(false)
              setSelectedSecurityLog(null)
            }}
          >
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedSecurityLog && (
          <Descriptions title="Security Event Information" bordered column={2}>
            <Descriptions.Item label="Event ID">{selectedSecurityLog.id}</Descriptions.Item>
            <Descriptions.Item label="Timestamp">{selectedSecurityLog.timestamp}</Descriptions.Item>
            <Descriptions.Item label="User">{selectedSecurityLog.user}</Descriptions.Item>
            <Descriptions.Item label="Action">{selectedSecurityLog.action}</Descriptions.Item>
            <Descriptions.Item label="Severity">
              <Tag
                color={
                  selectedSecurityLog.severity === "Critical"
                    ? "red"
                    : selectedSecurityLog.severity === "High"
                      ? "orange"
                      : selectedSecurityLog.severity === "Medium"
                        ? "yellow"
                        : "green"
                }
              >
                {selectedSecurityLog.severity}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedSecurityLog.status === "Blocked"
                    ? "red"
                    : selectedSecurityLog.status === "Success"
                      ? "green"
                      : selectedSecurityLog.status === "Monitoring"
                        ? "orange"
                        : "blue"
                }
              >
                {selectedSecurityLog.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="IP Address">{selectedSecurityLog.ipAddress}</Descriptions.Item>
            <Descriptions.Item label="Location">{selectedSecurityLog.location}</Descriptions.Item>
            <Descriptions.Item label="Details" span={2}>
              {selectedSecurityLog.details}
            </Descriptions.Item>

            {/* Additional fields based on log type */}
            {selectedSecurityLog.threatType && (
              <Descriptions.Item label="Threat Type">{selectedSecurityLog.threatType}</Descriptions.Item>
            )}
            {selectedSecurityLog.attemptCount && (
              <Descriptions.Item label="Attempt Count">{selectedSecurityLog.attemptCount}</Descriptions.Item>
            )}
            {selectedSecurityLog.riskScore && (
              <Descriptions.Item label="Risk Score">{selectedSecurityLog.riskScore}</Descriptions.Item>
            )}
            {selectedSecurityLog.targetAccount && (
              <Descriptions.Item label="Target Account">{selectedSecurityLog.targetAccount}</Descriptions.Item>
            )}
            {selectedSecurityLog.lockDuration && (
              <Descriptions.Item label="Lock Duration">{selectedSecurityLog.lockDuration}</Descriptions.Item>
            )}
            {selectedSecurityLog.targetUser && (
              <Descriptions.Item label="Target User">{selectedSecurityLog.targetUser}</Descriptions.Item>
            )}
            {selectedSecurityLog.oldRole && (
              <Descriptions.Item label="Old Role">{selectedSecurityLog.oldRole}</Descriptions.Item>
            )}
            {selectedSecurityLog.newRole && (
              <Descriptions.Item label="New Role">{selectedSecurityLog.newRole}</Descriptions.Item>
            )}
            {selectedSecurityLog.attackVector && (
              <Descriptions.Item label="Attack Vector">{selectedSecurityLog.attackVector}</Descriptions.Item>
            )}
            {selectedSecurityLog.payload && (
              <Descriptions.Item label="Payload" span={2}>
                <code>{selectedSecurityLog.payload}</code>
              </Descriptions.Item>
            )}
            {selectedSecurityLog.dataType && (
              <Descriptions.Item label="Data Type">{selectedSecurityLog.dataType}</Descriptions.Item>
            )}
            {selectedSecurityLog.recordCount && (
              <Descriptions.Item label="Record Count">{selectedSecurityLog.recordCount}</Descriptions.Item>
            )}
            {selectedSecurityLog.attackType && (
              <Descriptions.Item label="Attack Type">{selectedSecurityLog.attackType}</Descriptions.Item>
            )}
            {selectedSecurityLog.requestCount && (
              <Descriptions.Item label="Request Count">{selectedSecurityLog.requestCount}</Descriptions.Item>
            )}
            {selectedSecurityLog.duration && (
              <Descriptions.Item label="Duration">{selectedSecurityLog.duration}</Descriptions.Item>
            )}
            {selectedSecurityLog.mitigationMethod && (
              <Descriptions.Item label="Mitigation Method">{selectedSecurityLog.mitigationMethod}</Descriptions.Item>
            )}
            {selectedSecurityLog.userAgent && (
              <Descriptions.Item label="User Agent" span={2}>
                {selectedSecurityLog.userAgent}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Alert Details Modal */}
      <Modal
        title="System Alert Details"
        open={isAlertDetailModalVisible}
        onCancel={() => {
          setIsAlertDetailModalVisible(false)
          setSelectedAlert(null)
        }}
        footer={[
          <Button
            key="resolve"
            type="primary"
            onClick={() => {
              if (selectedAlert && selectedAlert.status === "Active") {
                handleResolveAlert(selectedAlert.id)
              }
              setIsAlertDetailModalVisible(false)
              setSelectedAlert(null)
            }}
            disabled={selectedAlert?.status !== "Active"}
          >
            Mark as Resolved
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setIsAlertDetailModalVisible(false)
              setSelectedAlert(null)
            }}
          >
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedAlert && (
          <Descriptions title="Alert Information" bordered column={2}>
            <Descriptions.Item label="Alert ID">{selectedAlert.id}</Descriptions.Item>
            <Descriptions.Item label="Timestamp">{selectedAlert.timestamp}</Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color="blue">{selectedAlert.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Severity">
              <Tag
                color={
                  selectedAlert.severity === "Critical"
                    ? "red"
                    : selectedAlert.severity === "High"
                      ? "orange"
                      : selectedAlert.severity === "Warning" || selectedAlert.severity === "Medium"
                        ? "yellow"
                        : "green"
                }
              >
                {selectedAlert.severity}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedAlert.status === "Active" ? "red" : selectedAlert.status === "Resolved" ? "green" : "orange"
                }
              >
                {selectedAlert.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Priority">
              <Tag
                color={
                  selectedAlert.priority === "Critical"
                    ? "red"
                    : selectedAlert.priority === "High"
                      ? "orange"
                      : selectedAlert.priority === "Medium"
                        ? "yellow"
                        : "green"
                }
              >
                {selectedAlert.priority}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Affected System">{selectedAlert.affectedSystem}</Descriptions.Item>
            <Descriptions.Item label="Title">{selectedAlert.title}</Descriptions.Item>
            <Descriptions.Item label="Message" span={2}>
              {selectedAlert.message}
            </Descriptions.Item>

            {/* Conditional fields based on alert type */}
            {selectedAlert.threshold && (
              <Descriptions.Item label="Threshold">{selectedAlert.threshold}</Descriptions.Item>
            )}
            {selectedAlert.currentValue && (
              <Descriptions.Item label="Current Value">{selectedAlert.currentValue}</Descriptions.Item>
            )}
            {selectedAlert.ipAddress && (
              <Descriptions.Item label="IP Address">{selectedAlert.ipAddress}</Descriptions.Item>
            )}
            {selectedAlert.attemptCount && (
              <Descriptions.Item label="Attempt Count">{selectedAlert.attemptCount}</Descriptions.Item>
            )}
            {selectedAlert.timeWindow && (
              <Descriptions.Item label="Time Window">{selectedAlert.timeWindow}</Descriptions.Item>
            )}
            {selectedAlert.duration && <Descriptions.Item label="Duration">{selectedAlert.duration}</Descriptions.Item>}
            {selectedAlert.backupSize && (
              <Descriptions.Item label="Backup Size">{selectedAlert.backupSize}</Descriptions.Item>
            )}
            {selectedAlert.location && <Descriptions.Item label="Location">{selectedAlert.location}</Descriptions.Item>}
            {selectedAlert.errorRate && (
              <Descriptions.Item label="Error Rate">{selectedAlert.errorRate}</Descriptions.Item>
            )}
            {selectedAlert.affectedTransactions && (
              <Descriptions.Item label="Affected Transactions">{selectedAlert.affectedTransactions}</Descriptions.Item>
            )}
            {selectedAlert.expiryDate && (
              <Descriptions.Item label="Expiry Date">{selectedAlert.expiryDate}</Descriptions.Item>
            )}
            {selectedAlert.domain && <Descriptions.Item label="Domain">{selectedAlert.domain}</Descriptions.Item>}
            {selectedAlert.daysRemaining && (
              <Descriptions.Item label="Days Remaining">{selectedAlert.daysRemaining}</Descriptions.Item>
            )}
            {selectedAlert.availableSpace && (
              <Descriptions.Item label="Available Space">{selectedAlert.availableSpace}</Descriptions.Item>
            )}

            {selectedAlert.recommendedAction && (
              <Descriptions.Item label="Recommended Action" span={2}>
                <Text strong style={{ color: "#1890ff" }}>
                  {selectedAlert.recommendedAction}
                </Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default SystemLogs
