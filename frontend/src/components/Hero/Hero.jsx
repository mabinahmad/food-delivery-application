import { useEffect, useState } from "react";
import { hero_images } from "../../assets/assets";
import "./Hero.css";
//===================================================

export const Hero = () => {
  // State to keep track of the current slide index
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Set up an interval to automatically change slides every 3 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % hero_images.length);
    }, 3000);
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Function to render slides based on currentSlide state
  //-------------------------------------------------------
  const renderSlides = () => {
    return hero_images.map((images, index) => {
      return (
        <div
          key={index}
          className={index === currentSlide ? "slide active" : "slide"}
        >
          <img src={images.hero_image} alt="" />
        </div>
      );
    });
  };

  return (
    <div className="hero">
      <div className="left-contents">
        <div className="quotes">
          <h1>
            Fastest Delivery &<br /> Easy Pickup
          </h1>
        </div>
      </div>
      <div className="slider">{renderSlides()}</div>
    </div>
  );
};
