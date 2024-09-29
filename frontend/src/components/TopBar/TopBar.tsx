import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./TopBar.css";
import { Category } from "../../utils/Category";


interface HeroItemProps {
  categories: Category[];
  onCategorySelect: (category: Category) => void;
}

const HeroItem: React.FC<HeroItemProps> = ({ categories,onCategorySelect }) => {




  const settings = {
    infinite: false,
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

  const handleClick = (category: Category) => {
      onCategorySelect(category);
  };

  return (
    <div>
      <Slider {...settings} className="hero-item-container">
        {categories.map((category) => (
          <span
            key={category.id}
            className="hero-item"
            onClick={() => handleClick(category)}
          >
            <span className="icon-container">
              <img
                src={category.icon}
                style={{ width: 50, height: 50 }}
              />
            </span>
            <span className="item-text">{category.name}</span>
          </span>
        ))}
      </Slider>
    </div>
  );
};

export default HeroItem;
