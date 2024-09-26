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
  onCategorySelect: (categoryId: string) => void;
}

const HeroItem: React.FC<HeroItemProps> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/categories")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error(
            "Error: Categories data is not an array",
            response.data
          );
          setCategories([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

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
              {/* Assuming icon is a URL */}
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
