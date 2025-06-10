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
  Progress,
  Alert,
  Modal,
  Form,
  InputNumber,
  Upload,
  Tooltip,
  Descriptions,
  Divider,
  message,
} from "antd"
import {
  InboxOutlined,
  PlusOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  HistoryOutlined,
  BarChartOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SwapOutlined,
} from "@ant-design/icons"

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input
const { Dragger } = Upload
const { TabPane } = Tabs

const Inventory = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Inventory data
  const [inventory, setInventory] = useState([])
  const [transactions, setTransactions] = useState([])
  const [inventoryStats, setInventoryStats] = useState({
    totalKits: 0,
    availableKits: 0,
    lowStockKits: 0,
    outOfStockKits: 0,
    totalValue: 0,
  })

  // Search and filter states
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [dateRange, setDateRange] = useState(null)

  // Modal states
  const [isAddStockModalVisible, setIsAddStockModalVisible] = useState(false)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [isTransactionDetailModalVisible, setIsTransactionDetailModalVisible] = useState(false)
  const [selectedKit, setSelectedKit] = useState(null)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  // Form states
  const [form] = Form.useForm()
  const [addInventoryForm] = Form.useForm()
  const [batchItems, setBatchItems] = useState([])
  const [addMode, setAddMode] = useState("single")

  // Fetch data
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      // Mock inventory data
      const mockInventory = [
        {
          id: "KIT001",
          code: "DNA-PAT-001",
          name: "Paternity Test Kit",
          quantity: 45,
          threshold: 20,
          status: "In Stock",
          unitPrice: 89.99,
          location: "Warehouse A",
          lastRestocked: "2023-05-15",
          expiryDate: "2024-05-15",
          supplier: "BioGenetics Inc.",
          batchNumber: "BG2023001",
        },
        {
          id: "KIT002",
          code: "DNA-MAT-001",
          name: "Maternity Test Kit",
          quantity: 32,
          threshold: 15,
          status: "In Stock",
          unitPrice: 89.99,
          location: "Warehouse A",
          lastRestocked: "2023-05-20",
          expiryDate: "2024-05-20",
          supplier: "BioGenetics Inc.",
          batchNumber: "BG2023002",
        },
        {
          id: "KIT003",
          code: "DNA-SIB-001",
          name: "Sibling Test Kit",
          quantity: 18,
          threshold: 20,
          status: "Low Stock",
          unitPrice: 109.99,
          location: "Warehouse B",
          lastRestocked: "2023-05-10",
          expiryDate: "2024-05-10",
          supplier: "GeneTech Solutions",
          batchNumber: "GT2023001",
        },
        {
          id: "KIT004",
          code: "DNA-ANC-001",
          name: "Ancestry Test Kit",
          quantity: 56,
          threshold: 25,
          status: "In Stock",
          unitPrice: 129.99,
          location: "Warehouse A",
          lastRestocked: "2023-05-25",
          expiryDate: "2024-05-25",
          supplier: "Heritage Genetics",
          batchNumber: "HG2023001",
        },
        {
          id: "KIT005",
          code: "DNA-PRE-001",
          name: "Prenatal Test Kit",
          quantity: 0,
          threshold: 10,
          status: "Out of Stock",
          unitPrice: 249.99,
          location: "Warehouse C",
          lastRestocked: "2023-04-15",
          expiryDate: "2024-04-15",
          supplier: "MedGen Labs",
          batchNumber: "MG2023001",
        },
      ]

      // Mock transactions data
      const mockTransactions = [
        {
          id: "TXN001",
          date: "2023-06-01 10:30:00",
          type: "Stock In",
          kitCode: "DNA-PAT-001",
          kitName: "Paternity Test Kit",
          quantity: 50,
          unitPrice: 89.99,
          totalValue: 4499.5,
          location: "Warehouse A",
          performedBy: "Admin User",
          supplier: "BioGenetics Inc.",
          batchNumber: "BG2023001",
          notes: "Monthly stock replenishment",
          status: "Completed",
        },
        {
          id: "TXN002",
          date: "2023-06-01 14:15:00",
          type: "Stock Out",
          kitCode: "DNA-PAT-001",
          kitName: "Paternity Test Kit",
          quantity: -5,
          unitPrice: 89.99,
          totalValue: -449.95,
          location: "Warehouse A",
          performedBy: "Staff User",
          orderNumber: "ORD-2023-001",
          customerName: "John Doe",
          notes: "Customer order fulfillment",
          status: "Completed",
        },
        {
          id: "TXN003",
          date: "2023-06-02 09:00:00",
          type: "Stock In",
          kitCode: "DNA-ANC-001",
          kitName: "Ancestry Test Kit",
          quantity: 30,
          unitPrice: 129.99,
          totalValue: 3899.7,
          location: "Warehouse A",
          performedBy: "Manager User",
          supplier: "Heritage Genetics",
          batchNumber: "HG2023002",
          notes: "New product line introduction",
          status: "Completed",
        },
        {
          id: "TXN004",
          date: "2023-06-02 11:30:00",
          type: "Transfer",
          kitCode: "DNA-SIB-001",
          kitName: "Sibling Test Kit",
          quantity: 10,
          unitPrice: 109.99,
          totalValue: 1099.9,
          fromLocation: "Warehouse A",
          toLocation: "Warehouse B",
          performedBy: "Staff User",
          notes: "Inventory redistribution",
          status: "Completed",
        },
        {
          id: "TXN005",
          date: "2023-06-03 08:45:00",
          type: "Adjustment",
          kitCode: "DNA-PRE-001",
          kitName: "Prenatal Test Kit",
          quantity: -2,
          unitPrice: 249.99,
          totalValue: -499.98,
          location: "Warehouse C",
          performedBy: "Admin User",
          reason: "Damaged items",
          notes: "Items damaged during handling",
          status: "Completed",
        },
      ]

      setInventory(mockInventory)
      setTransactions(mockTransactions)

      // Calculate stats
      const totalKits = mockInventory.reduce((sum, kit) => sum + kit.quantity, 0)
      const availableKits = mockInventory.filter((kit) => kit.quantity > 0).length
      const lowStockKits = mockInventory.filter((kit) => kit.quantity > 0 && kit.quantity <= kit.threshold).length
      const outOfStockKits = mockInventory.filter((kit) => kit.quantity === 0).length
      const totalValue = mockInventory.reduce((sum, kit) => sum + kit.quantity * kit.unitPrice, 0)

      setInventoryStats({
        totalKits,
        availableKits,
        lowStockKits,
        outOfStockKits,
        totalValue,
      })

      setLoading(false)
    }, 1000)
  }, [])

  // Handle add stock
  const handleAddStock = (values) => {
    const updatedInventory = inventory.map((kit) =>
      kit.id === selectedKit.id
        ? {
            ...kit,
            quantity: kit.quantity + values.quantity,
            status:
              kit.quantity + values.quantity > kit.threshold
                ? "In Stock"
                : kit.quantity + values.quantity > 0
                  ? "Low Stock"
                  : "Out of Stock",
            lastRestocked: new Date().toISOString().split("T")[0],
          }
        : kit,
    )

    setInventory(updatedInventory)

    // Add transaction record
    const newTransaction = {
      id: `TXN${String(transactions.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().replace("T", " ").split(".")[0],
      type: "Stock In",
      kitCode: selectedKit.code,
      kitName: selectedKit.name,
      quantity: values.quantity,
      unitPrice: selectedKit.unitPrice,
      totalValue: values.quantity * selectedKit.unitPrice,
      location: selectedKit.location,
      performedBy: "Current User",
      notes: values.notes || "Manual stock addition",
      status: "Completed",
    }

    setTransactions([newTransaction, ...transactions])

    // Update stats
    const totalKits = updatedInventory.reduce((sum, kit) => sum + kit.quantity, 0)
    const availableKits = updatedInventory.filter((kit) => kit.quantity > 0).length
    const lowStockKits = updatedInventory.filter((kit) => kit.quantity > 0 && kit.quantity <= kit.threshold).length
    const outOfStockKits = updatedInventory.filter((kit) => kit.quantity === 0).length
    const totalValue = updatedInventory.reduce((sum, kit) => sum + kit.quantity * kit.unitPrice, 0)

    setInventoryStats({
      totalKits,
      availableKits,
      lowStockKits,
      outOfStockKits,
      totalValue,
    })

    message.success(`Added ${values.quantity} units to ${selectedKit.name}`)
    setIsAddStockModalVisible(false)
    form.resetFields()
    setSelectedKit(null)
  }

  // Handle single item form submission
  const handleSingleSubmit = async (values) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newKit = {
        id: `KIT${String(inventory.length + 1).padStart(3, "0")}`,
        code: values.kitCode,
        name: values.kitName,
        quantity: values.quantity,
        threshold: values.threshold,
        status: values.quantity > values.threshold ? "In Stock" : values.quantity > 0 ? "Low Stock" : "Out of Stock",
        unitPrice: values.unitPrice,
        location: values.location,
        lastRestocked: new Date().toISOString().split("T")[0],
        expiryDate: values.expiryDate?.format("YYYY-MM-DD") || null,
        supplier: values.supplier,
        batchNumber: values.batchNumber || `BATCH${Date.now()}`,
      }

      setInventory([...inventory, newKit])

      // Add transaction record
      const newTransaction = {
        id: `TXN${String(transactions.length + 1).padStart(3, "0")}`,
        date: new Date().toISOString().replace("T", " ").split(".")[0],
        type: "Stock In",
        kitCode: newKit.code,
        kitName: newKit.name,
        quantity: newKit.quantity,
        unitPrice: newKit.unitPrice,
        totalValue: newKit.quantity * newKit.unitPrice,
        location: newKit.location,
        performedBy: "Current User",
        supplier: newKit.supplier,
        batchNumber: newKit.batchNumber,
        notes: values.notes || "New inventory item added",
        status: "Completed",
      }

      setTransactions([newTransaction, ...transactions])

      message.success("Inventory item added successfully!")
      addInventoryForm.resetFields()
    } catch (error) {
      message.error("Failed to add inventory item")
    } finally {
      setLoading(false)
    }
  }

  // Add item to batch
  const addToBatch = () => {
    addInventoryForm
      .validateFields()
      .then((values) => {
        const newItem = {
          id: Date.now(),
          ...values,
          totalValue: values.quantity * values.unitPrice,
        }
        setBatchItems([...batchItems, newItem])
        addInventoryForm.resetFields()
        message.success("Item added to batch")
      })
      .catch((error) => {
        console.log("Validation failed:", error)
      })
  }

  // Remove item from batch
  const removeFromBatch = (id) => {
    setBatchItems(batchItems.filter((item) => item.id !== id))
    message.success("Item removed from batch")
  }

  // Submit batch
  const submitBatch = async () => {
    if (batchItems.length === 0) {
      message.warning("No items in batch to submit")
      return
    }

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newKits = batchItems.map((item, index) => ({
        id: `KIT${String(inventory.length + index + 1).padStart(3, "0")}`,
        code: item.kitCode,
        name: item.kitName,
        quantity: item.quantity,
        threshold: item.threshold || 10,
        status: item.quantity > (item.threshold || 10) ? "In Stock" : item.quantity > 0 ? "Low Stock" : "Out of Stock",
        unitPrice: item.unitPrice,
        location: item.location,
        lastRestocked: new Date().toISOString().split("T")[0],
        expiryDate: null,
        supplier: item.supplier || "Unknown",
        batchNumber: `BATCH${Date.now()}_${index}`,
      }))

      setInventory([...inventory, ...newKits])

      // Add transaction records
      const newTransactions = batchItems.map((item, index) => ({
        id: `TXN${String(transactions.length + index + 1).padStart(3, "0")}`,
        date: new Date().toISOString().replace("T", " ").split(".")[0],
        type: "Stock In",
        kitCode: item.kitCode,
        kitName: item.kitName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalValue: item.totalValue,
        location: item.location,
        performedBy: "Current User",
        notes: "Batch inventory addition",
        status: "Completed",
      }))

      setTransactions([...newTransactions, ...transactions])

      message.success(`Successfully added ${batchItems.length} inventory items!`)
      setBatchItems([])
    } catch (error) {
      message.error("Failed to submit batch")
    } finally {
      setLoading(false)
    }
  }

  // Filter functions
  const filteredInventory = inventory.filter((kit) => {
    const matchesSearch =
      kit.name.toLowerCase().includes(searchText.toLowerCase()) ||
      kit.code.toLowerCase().includes(searchText.toLowerCase()) ||
      kit.id.toLowerCase().includes(searchText.toLowerCase()) ||
      kit.supplier.toLowerCase().includes(searchText.toLowerCase())

    const matchesStatus = statusFilter === "" || kit.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.kitCode.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.kitName.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.performedBy.toLowerCase().includes(searchText.toLowerCase())

    const matchesType = typeFilter === "" || transaction.type === typeFilter

    const matchesDateRange =
      !dateRange ||
      !dateRange[0] ||
      !dateRange[1] ||
      (new Date(transaction.date) >= dateRange[0].startOf("day").toDate() &&
        new Date(transaction.date) <= dateRange[1].endOf("day").toDate())

    return matchesSearch && matchesType && matchesDateRange
  })

  // Table columns
  const inventoryColumns = [
    {
      title: "Kit ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "green"
        let icon = <CheckCircleOutlined />

        if (status === "Low Stock") {
          color = "orange"
          icon = <WarningOutlined />
        } else if (status === "Out of Stock") {
          color = "red"
          icon = <ExclamationCircleOutlined />
        }

        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        )
      },
      filters: [
        { text: "In Stock", value: "In Stock" },
        { text: "Low Stock", value: "Low Stock" },
        { text: "Out of Stock", value: "Out of Stock" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Stock Level",
      key: "stockLevel",
      render: (_, record) => {
        let color = "#52c41a"

        if (record.quantity === 0) {
          color = "#ff4d4f"
        } else if (record.quantity <= record.threshold) {
          color = "#faad14"
        }

        const percent = Math.min(100, Math.round((record.quantity / record.threshold) * 100))

        return (
          <Progress percent={percent} strokeColor={color} format={() => `${record.quantity}/${record.threshold}`} />
        )
      },
    },
    {
      title: "Value",
      key: "value",
      render: (_, record) => `$${(record.quantity * record.unitPrice).toFixed(2)}`,
      sorter: (a, b) => a.quantity * a.unitPrice - b.quantity * b.unitPrice,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Add Stock">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="small"
              onClick={() => {
                setSelectedKit(record)
                setIsAddStockModalVisible(true)
              }}
            />
          </Tooltip>
          <Tooltip title="View Details">
            <Button
              type="default"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => {
                setSelectedKit(record)
                setIsDetailModalVisible(true)
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const transactionColumns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = "blue"
        let icon = <SwapOutlined />

        if (type === "Stock In") {
          color = "green"
          icon = <ArrowUpOutlined />
        } else if (type === "Stock Out") {
          color = "red"
          icon = <ArrowDownOutlined />
        } else if (type === "Transfer") {
          color = "purple"
          icon = <SwapOutlined />
        } else if (type === "Adjustment") {
          color = "orange"
          icon = <HistoryOutlined />
        }

        return (
          <Tag color={color} icon={icon}>
            {type}
          </Tag>
        )
      },
      filters: [
        { text: "Stock In", value: "Stock In" },
        { text: "Stock Out", value: "Stock Out" },
        { text: "Transfer", value: "Transfer" },
        { text: "Adjustment", value: "Adjustment" },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Kit Code",
      dataIndex: "kitCode",
      key: "kitCode",
    },
    {
      title: "Kit Name",
      dataIndex: "kitName",
      key: "kitName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => (
        <Text style={{ color: quantity > 0 ? "#52c41a" : "#ff4d4f" }}>
          {quantity > 0 ? "+" : ""}
          {quantity}
        </Text>
      ),
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Total Value",
      dataIndex: "totalValue",
      key: "totalValue",
      render: (value) => (
        <Text style={{ color: value > 0 ? "#52c41a" : "#ff4d4f" }}>${Math.abs(value).toFixed(2)}</Text>
      ),
      sorter: (a, b) => a.totalValue - b.totalValue,
    },
    {
      title: "Performed By",
      dataIndex: "performedBy",
      key: "performedBy",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "Completed" ? "green" : "orange"
        return <Tag color={color}>{status}</Tag>
      },
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
            onClick={() => {
              setSelectedTransaction(record)
              setIsTransactionDetailModalVisible(true)
            }}
          />
        </Tooltip>
      ),
    },
  ]

  const batchColumns = [
    {
      title: "Kit Code",
      dataIndex: "kitCode",
      key: "kitCode",
    },
    {
      title: "Kit Name",
      dataIndex: "kitName",
      key: "kitName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Total Value",
      dataIndex: "totalValue",
      key: "totalValue",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" danger icon={<DeleteOutlined />} onClick={() => removeFromBatch(record.id)}>
          Remove
        </Button>
      ),
    },
  ]

  // Handle batch upload
  const handleBatchUpload = {
    name: "file",
    multiple: false,
    accept: ".csv,.xlsx,.xls",
    beforeUpload: (file) => {
      const isValidType = file.type === "text/csv" || file.type.includes("sheet")
      if (!isValidType) {
        message.error("Please upload a CSV or Excel file!")
        return false
      }
      return false
    },
    onChange: (info) => {
      console.log("File info:", info)
    },
  }

  // Calculate transaction stats
  const transactionStats = {
    totalTransactions: transactions.length,
    stockIn: transactions.filter((t) => t.type === "Stock In").length,
    stockOut: transactions.filter((t) => t.type === "Stock Out").length,
    transfers: transactions.filter((t) => t.type === "Transfer").length,
    adjustments: transactions.filter((t) => t.type === "Adjustment").length,
    totalValue: transactions.reduce((sum, t) => sum + Math.abs(t.totalValue), 0),
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={2}>Test Kit Inventory Management</Title>
        <Space>
          <Button icon={<FileExcelOutlined />}>Export</Button>
          <Button icon={<PrinterOutlined />}>Print</Button>
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

      {/* Alerts */}
      {inventoryStats.lowStockKits > 0 && (
        <Alert
          message="Low Stock Alert"
          description={`${inventoryStats.lowStockKits} kit types are running low on stock. Please restock soon.`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" type="primary">
              View Details
            </Button>
          }
        />
      )}

      {inventoryStats.outOfStockKits > 0 && (
        <Alert
          message="Out of Stock Alert"
          description={`${inventoryStats.outOfStockKits} kit types are out of stock. Please restock immediately.`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" danger>
              View Details
            </Button>
          }
        />
      )}

      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        {/* Stock Overview Tab */}
        <TabPane
          tab={
            <span>
              <InboxOutlined />
              Stock Overview
            </span>
          }
          key="overview"
        >
          {/* Stats Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Kits"
                  value={inventoryStats.totalKits}
                  prefix={<InboxOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Kit Types"
                  value={inventory.length}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Low Stock Items"
                  value={inventoryStats.lowStockKits}
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Inventory Value"
                  value={inventoryStats.totalValue}
                  prefix="$"
                  precision={2}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} lg={8}>
                <Input
                  placeholder="Search by name, code, ID..."
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
                  <Option value="In Stock">In Stock</Option>
                  <Option value="Low Stock">Low Stock</Option>
                  <Option value="Out of Stock">Out of Stock</Option>
                </Select>
              </Col>
            </Row>
          </Card>

          {/* Inventory Table */}
          <Card>
            <Table
              loading={loading}
              columns={inventoryColumns}
              dataSource={filteredInventory}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <div>
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <Text strong>Unit Price:</Text> ${record.unitPrice.toFixed(2)}
                      </Col>
                      <Col span={8}>
                        <Text strong>Location:</Text> {record.location}
                      </Col>
                      <Col span={8}>
                        <Text strong>Supplier:</Text> {record.supplier}
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
                      <Col span={8}>
                        <Text strong>Last Restocked:</Text> {record.lastRestocked}
                      </Col>
                      <Col span={8}>
                        <Text strong>Expiry Date:</Text> {record.expiryDate}
                      </Col>
                      <Col span={8}>
                        <Text strong>Batch Number:</Text> {record.batchNumber}
                      </Col>
                    </Row>
                  </div>
                ),
              }}
            />
          </Card>
        </TabPane>

        {/* Add Inventory Tab */}
        <TabPane
          tab={
            <span>
              <PlusOutlined />
              Add Inventory
            </span>
          }
          key="add"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <Title level={3}>Add Inventory</Title>
            <Space>
              <Button type={addMode === "single" ? "primary" : "default"} onClick={() => setAddMode("single")}>
                Single Item
              </Button>
              <Button type={addMode === "batch" ? "primary" : "default"} onClick={() => setAddMode("batch")}>
                Batch Add
              </Button>
            </Space>
          </div>

          {addMode === "single" ? (
            // Single Item Form
            <Card title="Add Single Inventory Item">
              <Form
                form={addInventoryForm}
                layout="vertical"
                onFinish={handleSingleSubmit}
                initialValues={{
                  threshold: 10,
                  location: "Warehouse A",
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                      name="kitCode"
                      label="Kit Code"
                      rules={[{ required: true, message: "Please enter kit code" }]}
                    >
                      <Input placeholder="e.g., DNA-PAT-001" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} lg={16}>
                    <Form.Item
                      name="kitName"
                      label="Kit Name"
                      rules={[{ required: true, message: "Please enter kit name" }]}
                    >
                      <Input placeholder="e.g., Paternity Test Kit" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="quantity"
                      label="Quantity"
                      rules={[{ required: true, message: "Please enter quantity" }]}
                    >
                      <InputNumber min={1} style={{ width: "100%" }} placeholder="Enter quantity" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="unitPrice"
                      label="Unit Price ($)"
                      rules={[{ required: true, message: "Please enter unit price" }]}
                    >
                      <InputNumber min={0} step={0.01} precision={2} style={{ width: "100%" }} placeholder="0.00" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="threshold"
                      label="Low Stock Threshold"
                      rules={[{ required: true, message: "Please enter threshold" }]}
                    >
                      <InputNumber min={1} style={{ width: "100%" }} placeholder="Enter threshold" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="location"
                      label="Storage Location"
                      rules={[{ required: true, message: "Please select location" }]}
                    >
                      <Select placeholder="Select storage location">
                        <Option value="Warehouse A">Warehouse A</Option>
                        <Option value="Warehouse B">Warehouse B</Option>
                        <Option value="Warehouse C">Warehouse C</Option>
                        <Option value="Cold Storage">Cold Storage</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="supplier"
                      label="Supplier"
                      rules={[{ required: true, message: "Please enter supplier" }]}
                    >
                      <Input placeholder="Enter supplier name" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="expiryDate" label="Expiry Date">
                      <DatePicker style={{ width: "100%" }} placeholder="Select expiry date" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="batchNumber" label="Batch Number">
                      <Input placeholder="Enter batch number" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="notes" label="Notes">
                  <TextArea rows={3} placeholder="Additional notes about this inventory item" />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                      Add Inventory Item
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={() => addInventoryForm.resetFields()}>
                      Reset Form
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          ) : (
            // Batch Add Mode
            <div>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="Add Items to Batch" style={{ height: "100%" }}>
                    <Form
                      form={addInventoryForm}
                      layout="vertical"
                      initialValues={{
                        threshold: 10,
                        location: "Warehouse A",
                      }}
                    >
                      <Form.Item
                        name="kitCode"
                        label="Kit Code"
                        rules={[{ required: true, message: "Please enter kit code" }]}
                      >
                        <Input placeholder="e.g., DNA-PAT-001" />
                      </Form.Item>

                      <Form.Item
                        name="kitName"
                        label="Kit Name"
                        rules={[{ required: true, message: "Please enter kit name" }]}
                      >
                        <Input placeholder="e.g., Paternity Test Kit" />
                      </Form.Item>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="quantity"
                            label="Quantity"
                            rules={[{ required: true, message: "Please enter quantity" }]}
                          >
                            <InputNumber min={1} style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="unitPrice"
                            label="Unit Price ($)"
                            rules={[{ required: true, message: "Please enter unit price" }]}
                          >
                            <InputNumber min={0} step={0.01} precision={2} style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        name="location"
                        label="Location"
                        rules={[{ required: true, message: "Please select location" }]}
                      >
                        <Select placeholder="Select location">
                          <Option value="Warehouse A">Warehouse A</Option>
                          <Option value="Warehouse B">Warehouse B</Option>
                          <Option value="Warehouse C">Warehouse C</Option>
                        </Select>
                      </Form.Item>

                      <Button type="primary" onClick={addToBatch} icon={<PlusOutlined />} block>
                        Add to Batch
                      </Button>
                    </Form>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  <Card title="Upload from File" style={{ height: "100%" }}>
                    <Dragger {...handleBatchUpload}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Click or drag file to this area to upload</p>
                      <p className="ant-upload-hint">
                        Support for CSV and Excel files. Upload a file with columns: Kit Code, Kit Name, Quantity, Unit
                        Price, Location, Supplier, etc.
                      </p>
                    </Dragger>

                    <Divider />

                    <Button type="link" icon={<UploadOutlined />}>
                      Download Template File
                    </Button>
                  </Card>
                </Col>
              </Row>

              {batchItems.length > 0 && (
                <Card
                  title={`Batch Items (${batchItems.length})`}
                  style={{ marginTop: 16 }}
                  extra={
                    <Space>
                      <Text>Total Value: ${batchItems.reduce((sum, item) => sum + item.totalValue, 0).toFixed(2)}</Text>
                      <Button type="primary" onClick={submitBatch} loading={loading} icon={<SaveOutlined />}>
                        Submit Batch
                      </Button>
                    </Space>
                  }
                >
                  <Table columns={batchColumns} dataSource={batchItems} rowKey="id" pagination={false} size="small" />
                </Card>
              )}
            </div>
          )}
        </TabPane>

        {/* Kit Transactions Tab */}
        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              Kit Transactions
            </span>
          }
          key="transactions"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <Title level={3}>Kit Transactions</Title>
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

          {/* Transaction Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Transactions"
                  value={transactionStats.totalTransactions}
                  prefix={<HistoryOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Stock In"
                  value={transactionStats.stockIn}
                  prefix={<ArrowUpOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Stock Out"
                  value={transactionStats.stockOut}
                  prefix={<ArrowDownOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Value"
                  value={transactionStats.totalValue}
                  prefix="$"
                  precision={2}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Transaction Filters */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8}>
                <Input
                  placeholder="Search transactions..."
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
                  <Option value="Stock In">Stock In</Option>
                  <Option value="Stock Out">Stock Out</Option>
                  <Option value="Transfer">Transfer</Option>
                  <Option value="Adjustment">Adjustment</Option>
                </Select>
              </Col>
              <Col xs={24} sm={10}>
                <RangePicker
                  style={{ width: "100%" }}
                  onChange={(dates) => setDateRange(dates)}
                  placeholder={["Start Date", "End Date"]}
                />
              </Col>
            </Row>
          </Card>

          {/* Transactions Table */}
          <Card>
            <Table
              loading={loading}
              columns={transactionColumns}
              dataSource={filteredTransactions}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`,
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Add Stock Modal */}
      <Modal
        title="Add Stock"
        open={isAddStockModalVisible}
        onCancel={() => {
          setIsAddStockModalVisible(false)
          form.resetFields()
          setSelectedKit(null)
        }}
        footer={null}
      >
        {selectedKit && (
          <Form form={form} layout="vertical" onFinish={handleAddStock}>
            <Form.Item label="Kit Information">
              <Card size="small">
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text strong>ID:</Text> {selectedKit.id}
                  </Col>
                  <Col span={12}>
                    <Text strong>Code:</Text> {selectedKit.code}
                  </Col>
                  <Col span={24}>
                    <Text strong>Name:</Text> {selectedKit.name}
                  </Col>
                  <Col span={12}>
                    <Text strong>Current Stock:</Text> {selectedKit.quantity}
                  </Col>
                  <Col span={12}>
                    <Text strong>Threshold:</Text> {selectedKit.threshold}
                  </Col>
                </Row>
              </Card>
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Quantity to Add"
              rules={[
                { required: true, message: "Please enter quantity" },
                { type: "number", min: 1, message: "Quantity must be at least 1" },
              ]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="notes" label="Notes">
              <TextArea rows={3} placeholder="Optional notes about this stock addition" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Add Stock
                </Button>
                <Button
                  onClick={() => {
                    setIsAddStockModalVisible(false)
                    form.resetFields()
                    setSelectedKit(null)
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Kit Details Modal */}
      <Modal
        title="Kit Details"
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false)
          setSelectedKit(null)
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsDetailModalVisible(false)
              setSelectedKit(null)
            }}
          >
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedKit && (
          <Descriptions title="Kit Information" bordered column={2}>
            <Descriptions.Item label="Kit ID">{selectedKit.id}</Descriptions.Item>
            <Descriptions.Item label="Kit Code">{selectedKit.code}</Descriptions.Item>
            <Descriptions.Item label="Kit Name" span={2}>
              {selectedKit.name}
            </Descriptions.Item>
            <Descriptions.Item label="Current Quantity">{selectedKit.quantity}</Descriptions.Item>
            <Descriptions.Item label="Threshold">{selectedKit.threshold}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedKit.status === "In Stock" ? "green" : selectedKit.status === "Low Stock" ? "orange" : "red"
                }
              >
                {selectedKit.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Unit Price">${selectedKit.unitPrice.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Total Value">
              ${(selectedKit.quantity * selectedKit.unitPrice).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Location">{selectedKit.location}</Descriptions.Item>
            <Descriptions.Item label="Supplier">{selectedKit.supplier}</Descriptions.Item>
            <Descriptions.Item label="Batch Number">{selectedKit.batchNumber}</Descriptions.Item>
            <Descriptions.Item label="Last Restocked">{selectedKit.lastRestocked}</Descriptions.Item>
            <Descriptions.Item label="Expiry Date">{selectedKit.expiryDate || "N/A"}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        title="Transaction Details"
        open={isTransactionDetailModalVisible}
        onCancel={() => {
          setIsTransactionDetailModalVisible(false)
          setSelectedTransaction(null)
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsTransactionDetailModalVisible(false)
              setSelectedTransaction(null)
            }}
          >
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedTransaction && (
          <Descriptions title="Transaction Information" bordered column={2}>
            <Descriptions.Item label="Transaction ID">{selectedTransaction.id}</Descriptions.Item>
            <Descriptions.Item label="Date & Time">{selectedTransaction.date}</Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag
                color={
                  selectedTransaction.type === "Stock In"
                    ? "green"
                    : selectedTransaction.type === "Stock Out"
                      ? "red"
                      : selectedTransaction.type === "Transfer"
                        ? "purple"
                        : "orange"
                }
              >
                {selectedTransaction.type}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedTransaction.status === "Completed" ? "green" : "orange"}>
                {selectedTransaction.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Kit Code">{selectedTransaction.kitCode}</Descriptions.Item>
            <Descriptions.Item label="Kit Name">{selectedTransaction.kitName}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{selectedTransaction.quantity}</Descriptions.Item>
            <Descriptions.Item label="Unit Price">${selectedTransaction.unitPrice.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Total Value">${selectedTransaction.totalValue.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Performed By">{selectedTransaction.performedBy}</Descriptions.Item>

            {selectedTransaction.location && (
              <Descriptions.Item label="Location">{selectedTransaction.location}</Descriptions.Item>
            )}
            {selectedTransaction.fromLocation && (
              <Descriptions.Item label="From Location">{selectedTransaction.fromLocation}</Descriptions.Item>
            )}
            {selectedTransaction.toLocation && (
              <Descriptions.Item label="To Location">{selectedTransaction.toLocation}</Descriptions.Item>
            )}
            {selectedTransaction.supplier && (
              <Descriptions.Item label="Supplier">{selectedTransaction.supplier}</Descriptions.Item>
            )}
            {selectedTransaction.batchNumber && (
              <Descriptions.Item label="Batch Number">{selectedTransaction.batchNumber}</Descriptions.Item>
            )}
            {selectedTransaction.orderNumber && (
              <Descriptions.Item label="Order Number">{selectedTransaction.orderNumber}</Descriptions.Item>
            )}
            {selectedTransaction.customerName && (
              <Descriptions.Item label="Customer">{selectedTransaction.customerName}</Descriptions.Item>
            )}
            {selectedTransaction.reason && (
              <Descriptions.Item label="Reason">{selectedTransaction.reason}</Descriptions.Item>
            )}
            {selectedTransaction.notes && (
              <Descriptions.Item label="Notes" span={2}>
                {selectedTransaction.notes}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default Inventory
