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
import "./SideBar.css";

type MenuItem = Required<MenuProps>["items"][number];

interface SideBarProps {
  categories: { id: number; name: string }[];
  onCategorySelect: (categoryId: number) => void;
}

const SideBar: React.FC<SideBarProps> = ({ categories, onCategorySelect }) => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e: { key: string }) => {
    const categoryId = Number(e.key);
    onCategorySelect(categoryId);
  };

  const items: MenuItem[] = [
    ...categories.map(category => ({
      key: category.id.toString(),
      icon: <PieChartOutlined />, // Change icon based on category if needed
      label: category.name
    })),
    { key: "sub1", label: "اكسسوارات", icon: <MailOutlined />, children: [
      { key: "5", label: "اي شي" },
      { key: "6", label: "اي شي" },
      { key: "7", label: "اي شي" },
      { key: "8", label: "اي شي" },
    ]},
    { key: "sub2", label: "ألعاب فيديو", icon: <AppstoreOutlined />, children: [
      { key: "9", label: "اي شي" },
      { key: "10", label: "اي شي" },
      { key: "sub3", label: "قطع", children: [
        { key: "11", label: "اي شي" },
        { key: "12", label: "اي شي" },
      ]}
    ]},
  ];

  return (
    <div className="side-bar">
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
        onClick={handleMenuClick}
      />
    </div>
  );
};

export default SideBar;
