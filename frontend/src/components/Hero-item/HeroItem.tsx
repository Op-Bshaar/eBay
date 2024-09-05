import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React from "react";
import { itemdata } from "../../utils/itemdata";
import "./HeroItem.css";

const HeroItem: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  const handleClick = (item:any)=>{
  alert(`hello ${item.id}`);
  }
  return (
    <div className="hero-item-container">
      <Slider {...settings}>
        {itemdata.map((item) => (
          <div key={item.id} 
          className="hero-item"
          onClick={()=>handleClick(item)}
          >
            <div className="icon-container">
              {item.icon}
            </div>
            <span className="item-text">{item.item}</span>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroItem;
