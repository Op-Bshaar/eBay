import React, {ReactNode} from "react";
const Editpopup: React.FC<Editpopup> = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;
  
    return (
      <div className="popupoverlay">
        <div className="popupcontent">
          <button className="popupclose" onClick={onClose}>
            Close
          </button>
          {children}
        </div>
      </div>
    );
  };
  interface Editpopup {
    isVisible: boolean;
    onClose: () => void;
    children: ReactNode;
  }
  export default Editpopup