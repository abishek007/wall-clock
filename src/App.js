import React from "react";
import Clock from "./components/Clock";
import "./styles.css";

const App = () => {
  return (
    <div>
      <p className="title-txt">Analog Clock</p>
      <Clock />
    </div>
  );
};

export default App;
