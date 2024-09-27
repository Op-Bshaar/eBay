import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SideBar.css"; 
import { Category } from "../../utils/Category";

interface SideBarProps {
  onCategorySelect: (categoryId: string) => void;
  categories: Category[];
}

const SideBar: React.FC<SideBarProps> = ({ onCategorySelect,categories }) => {
 

  const handleClick = (categoryId: number) => {
    onCategorySelect(categoryId.toString());
  };

  return (
    <div className="side-bar">
      <div className="sidebar-container">
        {categories.map((category) => (
          <div
            key={category.id}
            className="sidebar-item"
            onClick={() => handleClick(Number(category.id))}
          >
            <div className="icon-container">
              <img
                src={category.icon}
                alt={category.name}
                style={{ width: 50, height: 50 }}
              />
            </div>
            <span className="item-text">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
