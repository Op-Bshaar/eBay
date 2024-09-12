import Menu from "../components/menu/Menu";


function DashBoard() {
  return (
    <div className="dashboard-container">
      <Menu />
      <div className="dashboard-content">
        {/* Content will be displayed based on the selected route */}
      </div>
    </div>
  );
}

export default DashBoard;
