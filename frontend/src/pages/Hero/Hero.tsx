import React, { useState } from "react";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  { key: "1", icon: <PieChartOutlined />, label: "جوالات" },
  { key: "2", icon: <DesktopOutlined />, label: "لابتوبات" },
  { key: "3", icon: <ContainerOutlined />, label: "أجهزة منزليه" },
  {
    key: "sub1",
    label: "اكسسوارات",
    icon: <MailOutlined />,
    children: [
      { key: "5", label: "اي شي" },
      { key: "6", label: "اي شي" },
      { key: "7", label: "اي شي" },
      { key: "8", label: "اي شي" },
    ],
  },
  {
    key: "sub2",
    label: "ألعاب فيديو",
    icon: <AppstoreOutlined />,
    children: [
      { key: "9", label: "اي شي" },
      { key: "10", label: "اي شي" },
      {
        key: "sub3",
        label: "قطع",
        children: [
          { key: "11", label: "اي شي" },
          { key: "12", label: "اي شي" },
        ],
      },
    ],
  },
  { key: "13", icon: <PieChartOutlined />, label: "جوالات" },
  { key: "14", icon: <DesktopOutlined />, label: "لابتوبات" },
  { key: "15", icon: <ContainerOutlined />, label: "أجهزة منزليه" },
  { key: "1", icon: <PieChartOutlined />, label: "جوالات" },
  { key: "2", icon: <DesktopOutlined />, label: "لابتوبات" },
  { key: "3", icon: <ContainerOutlined />, label: "أجهزة منزليه" },
  { key: "3", icon: <ContainerOutlined />, label: "أجهزة منزليه" },
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{ width: 256 }}>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};

export default App;
