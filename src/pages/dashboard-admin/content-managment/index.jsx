import React from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Card, Tabs, Typography } from "antd"
import { FileTextOutlined, QuestionCircleOutlined } from "@ant-design/icons"

const { Title } = Typography
const { TabPane } = Tabs

const ContentManagement = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Get active tab from current path
  const getActiveTab = () => {
    const path = location.pathname
    if (path.includes("/blog")) return "blog"
    if (path.includes("/faqs")) return "faqs"
    return "blog" // default
  }

  const handleTabChange = (key) => {
    navigate(`/dashboard/cm/${key}`)
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Content Management
      </Title>

      <Card>
        <Tabs activeKey={getActiveTab()} onChange={handleTabChange} type="card">
          <TabPane
            tab={
              <span>
                <FileTextOutlined />
                Blog Posts
              </span>
            }
            key="blog"
          />
          <TabPane
            tab={
              <span>
                <QuestionCircleOutlined />
                FAQs
              </span>
            }
            key="faqs"
          />
        </Tabs>

        <div style={{ marginTop: 16 }}>
          <Outlet />
        </div>
      </Card>
    </div>
  )
}

export default ContentManagement
