
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from "./components/menu/Menu";
function App() {
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

export default App;
