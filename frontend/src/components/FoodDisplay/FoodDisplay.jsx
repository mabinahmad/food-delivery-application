import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { FoodItem } from "../FoodItem/FoodItem";
import "./FoodDisplay.css";
//=============================================================

// The FoodDisplay component renders a list of food items based on the selected category and search input.
//---------------------------------------------------------------------------------------------------------
export const FoodDisplay = ({ category }) => {
  const { foodList, searchedFoodList, searchInputValue } =
    useContext(StoreContext);

  // Determine which list to display based on the search input
  const displayList = searchInputValue ? searchedFoodList : foodList;

  return (
    <div className="food-display">
      <div className="food-display-list">
        {displayList.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image.secureUrl}
              />
            );
          }
        })}
      </div>
    </div>
  );
};
