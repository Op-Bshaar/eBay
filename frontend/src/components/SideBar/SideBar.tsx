import React from "react";
import "./SideBar.css"; 
import { Category } from "../../utils/Category";

interface SideBarProps {
  onCategorySelect: (category: Category) => void;
  categories: Category[];
}

const SideBar: React.FC<SideBarProps> = ({ onCategorySelect,categories }) => {
 

    const handleClick = (category: Category) => {
    onCategorySelect(category);
  };

  return (
    <div className="side-bar">
      <div className="sidebar-container">
        {categories.map((category) => (
          <div
            key={category.id}
            className="sidebar-item"
            onClick={() => handleClick(category)}
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
