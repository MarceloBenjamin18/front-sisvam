// src/components/ScrollStack/ScrollStack.jsx
import React, { useEffect, useState } from "react";
import "./ScrollStack.css";

const ScrollStack = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY;
      if (top > 150) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`scroll-stack-container ${visible ? "show" : ""}`}>
      <div className="panel">Panel A</div>
      <div className="panel">Panel B</div>
    </div>
  );
};

export default ScrollStack;
