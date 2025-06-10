import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Modal, Button, message, Space, Typography } from "antd"
import { LogoutOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import api from "../../configs/axios"
import { clearUser } from "../../redux/features/userSlice"

const { Text } = Typography

const LogOut = ({
  trigger = "button", // "button" | "modal" | "function"
  buttonText = "Đăng xuất",
  buttonType = "default",
  buttonSize = "middle",
  showIcon = true,
  showConfirmation = true,
  onLogoutSuccess,
  onLogoutError,
  className,
  style,
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Main logout function - No API call, just clear local data
  const performLogout = async () => {
    try {
      setIsLoggingOut(true)

      // Get current user info before clearing (for logging purposes)
      const currentUser = localStorage.getItem("user")
      const userInfo = currentUser ? JSON.parse(currentUser) : null

      console.log("Logging out user:", userInfo?.username || "Unknown user")

      // Clear Redux state
      dispatch(clearUser())

      // Clear all authentication data from localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      localStorage.removeItem("userRole")
      localStorage.removeItem("permissions")

      // Clear any other app-specific data
      localStorage.removeItem("sidebar:state")
      localStorage.removeItem("theme")
      localStorage.removeItem("language")

      // Clear sessionStorage as well
      sessionStorage.clear()

      // Reset axios default headers
      delete api.defaults.headers.common["Authorization"]

      // Show success message
      message.success("Đăng xuất thành công!")

      // Call success callback if provided
      if (onLogoutSuccess) {
        onLogoutSuccess()
      }

      // Small delay for better UX
      setTimeout(() => {
        // Redirect to home page instead of login
        navigate("/", { replace: true })

        // Force page reload to clear any remaining state
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error("Logout error:", error)
      message.error("Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại!")

      // Call error callback if provided
      if (onLogoutError) {
        onLogoutError(error)
      }
    } finally {
      setIsLoggingOut(false)
      setIsModalVisible(false)
    }
  }

  // Handle logout with confirmation
  const handleLogoutClick = () => {
    if (showConfirmation) {
      setIsModalVisible(true)
    } else {
      performLogout()
    }
  }

  // Handle confirmation modal
  const handleConfirmLogout = () => {
    performLogout()
  }

  const handleCancelLogout = () => {
    setIsModalVisible(false)
  }

  // Emergency logout without confirmation (for error cases)
  const forceLogout = () => {
    try {
      // Get current user info before clearing
      const currentUser = localStorage.getItem("user")
      const userInfo = currentUser ? JSON.parse(currentUser) : null

      console.log("Force logging out user:", userInfo?.username || "Unknown user")

      // Clear Redux state
      dispatch(clearUser())

      // Clear all storage
      localStorage.clear()
      sessionStorage.clear()

      // Reset axios headers
      delete api.defaults.headers.common["Authorization"]

      // Redirect to home page immediately
      navigate("/", { replace: true })
      window.location.reload()
    } catch (error) {
      console.error("Force logout error:", error)
      // Fallback: redirect to home page
      window.location.href = "/"
    }
  }

  // Quick logout without confirmation (for programmatic use)
  const quickLogout = () => {
    try {
      // Get current user info
      const currentUser = localStorage.getItem("user")
      const userInfo = currentUser ? JSON.parse(currentUser) : null

      console.log("Quick logout for user:", userInfo?.username || "Unknown user")

      // Clear Redux state
      dispatch(clearUser())

      // Clear authentication data
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      localStorage.removeItem("userRole")
      localStorage.removeItem("permissions")

      // Clear app-specific data
      localStorage.removeItem("sidebar:state")
      localStorage.removeItem("theme")
      localStorage.removeItem("language")

      // Clear session storage
      sessionStorage.clear()

      // Reset axios headers
      delete api.defaults.headers.common["Authorization"]

      // Show message and redirect
      message.success("Đã đăng xuất!")
      navigate("/", { replace: true })
    } catch (error) {
      console.error("Quick logout error:", error)
      window.location.href = "/"
    }
  }

  // Expose logout functions for external use
  LogOut.performLogout = performLogout
  LogOut.forceLogout = forceLogout
  LogOut.quickLogout = quickLogout

  // If trigger is "function", don't render anything
  if (trigger === "function") {
    return null
  }

  // Render logout button
  const LogoutButton = (
    <Button
      type={buttonType}
      size={buttonSize}
      icon={showIcon ? <LogoutOutlined /> : null}
      onClick={handleLogoutClick}
      loading={isLoggingOut}
      disabled={isLoggingOut}
      className={className}
      style={{
        ...(buttonType === "default" && {
          borderColor: "#ff4d4f",
          color: "#ff4d4f",
        }),
        ...style,
      }}
      danger={buttonType === "primary"}
    >
      {isLoggingOut ? "Đang đăng xuất..." : buttonText}
    </Button>
  )

  return (
    <>
      {LogoutButton}

      {/* Confirmation Modal */}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: "#faad14" }} />
            Xác nhận đăng xuất
          </Space>
        }
        open={isModalVisible}
        onOk={handleConfirmLogout}
        onCancel={handleCancelLogout}
        okText="Đăng xuất"
        cancelText="Hủy"
        okButtonProps={{
          danger: true,
          loading: isLoggingOut,
          disabled: isLoggingOut,
        }}
        cancelButtonProps={{
          disabled: isLoggingOut,
        }}
        closable={!isLoggingOut}
        maskClosable={!isLoggingOut}
        width={400}
        centered
      >
        <div style={{ padding: "16px 0" }}>
          <Text>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Bạn sẽ được chuyển về trang chủ và cần đăng nhập lại để sử dụng các tính năng quản trị.
          </Text>
        </div>
      </Modal>
    </>
  )
}

export default LogOut
