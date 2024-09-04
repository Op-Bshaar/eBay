import React, { useState } from "react";
import "./Hero.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function Hero() {
  const [showmenu, setshowmenu] = useState(false);
  const [activemenu, setactivemenu] = useState<null | number>(null);

  const handlemouseEnter = () => {
    setshowmenu(true);
  };

  const handlemouseLeave = () => {
    setshowmenu(false);
    setactivemenu(null);
  };

  const handlesubmouseEnter = (index: number) => {
    setactivemenu(index);
  };

  const handlesubmouseLeave = () => {
    setactivemenu(null);
  };

  return (
    <div className="hero-container">
      <div className="hero-content">
        <div
          className="icon-text-style"
          onMouseEnter={handlemouseEnter}
          onMouseLeave={handlemouseLeave}
        >
          <FontAwesomeIcon icon={faBars} className="hamburger-icon" />
          <span className="hero-text" style={{ marginRight: 10 }}>
            التصنيفات
          </span>
        </div>
        {showmenu && (
          <div className="menu">
            {["أجهزة منزلية", "لابتوبات", "جوالات"].map((item, index) => (
              <div
                key={index}
                className="menu-item"
                onMouseEnter={() => handlesubmouseEnter(index)}
                onMouseLeave={handlesubmouseLeave}
              >
                <p>{item}</p>
                {activemenu === index && (
                  <div className="sub-menu">
                    <p>تفاصيل</p>
                    <p>تفاصيل</p>
                    <p>تفاصيل</p>
                    <p>تفاصيل</p>
                    <p>تفاصيل</p>
                    <p>تفاصيل</p>
                    <p>تفاصيل</p>
                    <p>تفاصيل</p>
                    <p>تفاصيل</p>
                    <p>تفاصيل</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Hero;
