import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React from "react";
import { itemdata } from "../../utils/itemdata";
import "./TopBar.css";

const HeroItem: React.FC<{ onCategorySelect: (categoryId: number) => void }> = ({ onCategorySelect }) => {
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

  const handleClick = (categoryName: any) => {
    onCategorySelect(categoryName);
  };

  return (
    <div>
      <Slider {...settings} className="hero-item-container">
        {itemdata.map((item) => (
          <div
            key={item.id}
            className="hero-item"
            onClick={() => handleClick(item.id)}
          >
            <div className="icon-container">{item.icon}</div>
            <span className="item-text">{item.item}</span>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroItem;
