import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React from "react";
import { itemdata } from "../../utils/itemdata";
import "./HeroItem.css";

const HeroItem: React.FC = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3
  };
  return (
    <div className="hero-item-container">
      <Slider {...settings}>
        {itemdata.map((item, index) => (
          <div key={index} className="hero-item">
            <div className="icon-container">{item.icon}</div>
            <span className="item-text">{item.item}</span>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroItem;
