import React from "react";
import Hero from "../../components/Hero/Hero";
import HeroItem from "../../components/Hero-item/HeroItem";


function Home() {

  return (
    <>
      <div style={{display:"flex",fontFamily:""}}>
        <Hero />
        <HeroItem />
      </div>
    </>
  );
}

export default Home;
