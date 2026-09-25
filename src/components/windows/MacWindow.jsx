import { Rnd } from "react-rnd";
import "./window.scss";

const MacWindow = ({ children, width = "30vw", height = "50vh" }) => {
  return (
    <Rnd
      default={{
        width: width,
        height: height,
        x: 300,
        y: 200,
      }}
    >
      <div className="window">
        <div className="nav">
          <div className="dots">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
          </div>

          <div className="title">
            <p>manaskumarghosh - zsh</p>
          </div>
        </div>
        <div className="main-content">{children}</div>
      </div>
    </Rnd>
  );
};

export default MacWindow;
