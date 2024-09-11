import { useState } from 'react'
import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './AdminDashBoard.css'
import '../../data'


import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from "../components/menu/Menu";
function dashboard() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/menu" element={<Menu />} />
      </Routes>
      <h1>بشار</h1>
    </BrowserRouter>
    </>
    

  );
}

export default dashboard;


