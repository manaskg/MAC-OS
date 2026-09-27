import MacWindow from "./MacWindow";
import "./resume.scss";

const Resume = ({ windowName, setWindowsState }) => {
  return (
    <MacWindow
      width="35vw"
      height="70vh"
      x="500"
      y="75"
      windowName={windowName}
      setWindowsState={setWindowsState}
    >
      <div className="resume-window">
        <embed src="/resume.pdf" frameborder="0"></embed>
      </div>
    </MacWindow>
  );
};

export default Resume;
