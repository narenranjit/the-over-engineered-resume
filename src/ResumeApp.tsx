import React, { useState, useEffect } from "react";
import markdownToJSON from "./util/markdown-to-json";
import "./ResumeApp.css";
import type { Resume } from "./util/types";
import ResumeComponent from "./Resume";

const ResumePage: React.FC = () => {
  const [resumeData, setResumeData] = useState<Resume | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await fetch("/resume.md");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdown = await response.text();
        const parsedResume = markdownToJSON(markdown);
        setResumeData(parsedResume);
      } catch (error) {
        console.error("Error fetching resume data:", error);
        setError("Failed to load resume data. Please try again later.");
      }
    };

    fetchResumeData();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!resumeData) {
    return <div>Loading...</div>;
  }

  return <ResumeComponent resume={resumeData} />;
};

export default ResumePage;
