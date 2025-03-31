import markdownToJSON from "./util/markdown-to-json";
import "./ResumeApp.css";
import ResumeComponent from "./Resume";

import ResumeMD from "/resume.md?raw";

const ResumePage: React.FC = () => {
  const rawMarkdown = ResumeMD;
  const parsedResume = markdownToJSON(rawMarkdown);

  return <ResumeComponent resume={parsedResume} />;
};

export default ResumePage;
