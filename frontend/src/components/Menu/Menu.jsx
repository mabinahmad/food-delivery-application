import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Menu.css";
//===============================================

// Menu Component - Displays a list of categories for the menu
//--------------------------------------------------------------
export const Menu = ({ category, setCategory, menuRef }) => {
  const { foodCategoryList } = useContext(StoreContext);
  return (
    <div ref={menuRef} className="menu">
      <h2 className="explore-menu-title">Explore Menu</h2>

      <div className="menu-list">
        {foodCategoryList.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.category ? "All" : item.category
                )
              }
              key={index}
              className={`menu-list-item ${
                category === item.category ? "active" : ""
              }`}
            >
              <img src={item.image.secureUrl} alt="" />

              <b>{item.category}</b>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};
