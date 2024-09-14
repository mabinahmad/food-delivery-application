import { useContext, useRef } from "react";
import { useState } from "react";
import { AppDownload } from "../../components/AppDownload/AppDownload";
import { FoodDisplay } from "../../components/FoodDisplay/FoodDisplay";
import { Hero } from "../../components/Hero/Hero";
import { Menu } from "../../components/Menu/Menu";
import { PickupFromStore } from "../../components/PickupFromStore/PickupFromStore";
import { StoreContext } from "../../context/StoreContext";
import { OrderSuccessModal } from "./Modal";
import "./Home.css";
//==================================================================================

export const Home = () => {
  // State to manage the selected food category
  const [category, setCategory] = useState("All");
  const { searchInputValue, foodDisplayRef, menuRef } =
    useContext(StoreContext);

  const scrollToFoodDisplay = () => {
    if (foodDisplayRef.current) {
      const offset = -350;
      const top =
        foodDisplayRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="home-page">
      <OrderSuccessModal />
      {!searchInputValue && <Hero />}

      <div>
        <Menu menuRef={menuRef} category={category} setCategory={setCategory} />
      </div>

      <div ref={foodDisplayRef}>
        <FoodDisplay category={category} />
      </div>

      <div className="app-download-and-order-online">
        <AppDownload />
        <PickupFromStore scrollToFoodDisplay={scrollToFoodDisplay} />
      </div>
    </div>
  );
};
