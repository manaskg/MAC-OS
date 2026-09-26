import MacWindow from "./MacWindow";
import "./resume.scss";

const Resume = ({ windowName, setWindowsState }) => {
  return (
    <MacWindow width="40vw" height="60vh" windowName={windowName} setWindowsState={setWindowsState}>
      <div className="resume-window">
        <embed src="/resume.pdf" frameborder="0"></embed>
      </div>
    </MacWindow>
  );
};

export default Resume;
