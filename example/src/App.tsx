import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import ReactComponent from "./test.md";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <ReactComponent></ReactComponent>
    </div>
  );
}

export default App;
