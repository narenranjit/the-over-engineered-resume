import React, { useState, useEffect } from "react";
import { marked, Token } from "marked";
import "./App.css";
import type { Resume, Job, Project } from "./types";
import ResumeComponent from "./resume";

async function parseMarkdown(markdown: string): Promise<Resume> {
  const tokens = marked.lexer(markdown);

  const resume: Resume = {
    name: "",
    contact: [],
    summary: "",
    experience: [],
    education: [],
    projects: [],
  };

  let currentSection: keyof Resume | "" = "";
  let currentJob: Job | null = null;
  let currentRole: Job["roles"][0] | null = null;
  let currentProject: Project | null = null;

  for (const token of tokens) {
    if (token.type === "heading") {
      if (token.depth === 1) {
        resume.name = token.text;
      } else if (token.depth === 2) {
        currentSection = token.text.toLowerCase() as keyof Resume;
        if (currentSection === "experience") resume.experience = [];
        if (currentSection === "education") resume.education = [];
        if (currentSection === "projects") resume.projects = [];
      } else if (token.depth === 3 && currentSection === "experience") {
        currentJob = { company: token.text, roles: [] };
        resume.experience.push(currentJob);
      } else if (token.depth === 4 && currentJob) {
        const [title, date] = token.text.split("[");
        currentRole = {
          title: title.trim(),
          date: date ? date.replace("]", "").trim() : "",
          description: "",
          achievements: [],
        };
        currentJob.roles.push(currentRole);
      } else if (token.depth === 3 && currentSection === "projects") {
        currentProject = { name: token.text, description: "", techStack: "" };
        resume.projects.push(currentProject);
      }
    } else if (token.type === "paragraph") {
      if (currentSection === "") {
        resume.contact = token.text.split(" • ");
      } else if (currentSection === "summary") {
        resume.summary = token.text;
      } else if (currentProject) {
        if (token.text.startsWith("Tech Stack:")) {
          currentProject.techStack = token.text.replace("Tech Stack:", "").trim();
        } else {
          currentProject.description += (currentProject.description ? "\n" : "") + token.text;
        }
      }
    } else if (token.type === "list") {
      if (currentSection === "education") {
        token.items.forEach((item) => {
          const [degree, institution, date] = item.text.split(" | ");
          if (degree && institution && date) {
            resume.education.push({ degree: degree.trim(), institution: institution.trim(), date: date.trim() });
          }
        });
      } else if (currentRole) {
        currentRole.achievements = token.items.map((item: any) => item.text);
      }
    }
  }

  return resume;
}

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
        const parsedResume = await parseMarkdown(markdown);
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
