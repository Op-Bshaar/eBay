import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React, { useRef } from "react";
import { itemdata } from "../../utils/itemdata";
import "./TopBar.css";

const HeroItem: React.FC = () => {
    const sliderRef = useRef<Slider | null>(null);
    const settings = {
        ref:sliderRef,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        rtl: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 768, // For mobile devices
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 1024, // For tablets or small laptops
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            }
        ]
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClick = (item: any) => {
        alert(`hello ${item.id}`);
    };
    return (
        <div>
            <Slider {...settings} className="hero-item-container">
                {itemdata.map((item) => (
                    <div
                        key={item.id}
                        className="hero-item"
                        onClick={() => handleClick(item)}
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

