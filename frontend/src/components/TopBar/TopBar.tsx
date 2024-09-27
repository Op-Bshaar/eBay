import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./TopBar.css";
import api from "../../helpers/api";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface HeroItemProps {
  categories: Category[];
  onCategorySelect: (categoryId: string) => void;
}

const HeroItem: React.FC<HeroItemProps> = ({ categories,onCategorySelect }) => {




  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    rtl: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
    ],
  };

  const handleClick = (categoryId: number) => {
    onCategorySelect(categoryId.toString());
  };

  return (
    <div>
      <Slider {...settings} className="hero-item-container">
        {categories.map((category) => (
          <div
            key={category.id}
            className="hero-item"
            onClick={() => handleClick(category.id)}
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
      </Slider>
    </div>
  );
};

export default HeroItem;
