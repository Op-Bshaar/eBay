import React, { useState } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import "./SideBar.css";
import { Category } from "../../utils/Category";

type MenuItem = Required<MenuProps>["items"][number];

interface SideBarProps {
    categories: Category[];
    onCategorySelect: (categoryId: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ categories, onCategorySelect }) => {
    const [collapsed, setCollapsed] = useState(true);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handleMenuClick = (e: { key: string }) => {
        const categoryId = e.key;
        onCategorySelect(categoryId);
    };

    const items: MenuItem[] =
        categories.map(category => ({
            key: category.id,
            icon: <PieChartOutlined />, // Change icon based on category if needed
            label: category.name
        }));

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
