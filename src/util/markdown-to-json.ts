import { marked } from "marked";
import type { Token, Tokens } from "marked";
import type { Resume, Job, Project } from "./types";

const resume2: Resume = {
  name: "",
  contact: [],
  summary: "",
  experience: [],
  education: [],
  projects: [],
};

function getSectionItems(list: Token[], heading: string) {
  const headerToken = list.find(
    (token) => token.type === "heading" && token.text.toLowerCase() === heading.toLowerCase(),
  ) as Tokens.Heading;
  if (!headerToken) return [];

  const startDepth = headerToken.depth;
  const startIndex = list.indexOf(headerToken);

  const endIndex = list
    .slice(startIndex + 1)
    .findIndex((token) => token.type === "heading" && token.depth === startDepth);
  const toReturn = list.slice(startIndex + 1, endIndex === -1 ? undefined : endIndex + startIndex);
  // console.log("getSectionItems", heading, toReturn);
  return toReturn;
}

function markdownToJSON2(markdown: string) {
  const tokens = marked.lexer(markdown);
  const resume: Resume = {
    name: "",
    contact: [],
    summary: "",
    experience: [],
    education: [],
    projects: [],
  };

  const nameToken = tokens.find((token) => token.type === "heading" && token.depth === 1)! as Tokens.Heading;
  resume.name = nameToken.text;

  const contact = tokens.find(
    (token) => token.type === "paragraph" && token.text.toLowerCase().indexOf("linkedin") !== -1,
  )! as Tokens.Paragraph;
  resume.contact = contact.text.split(" • ");

  const summaryHeaderIndex = tokens.findIndex(
    (token) => token.type === "heading" && token.text.toLowerCase() === "summary",
  )!;
  const summaryText = tokens[summaryHeaderIndex + 1] as Tokens.Paragraph;
  resume.summary = summaryText.text;

  const experienceTokens = getSectionItems(tokens, "experience");
  // console.log(experienceTokens);

  let remainingExperienceTokens = experienceTokens.slice();
  const firstCompany = experienceTokens[0] as Tokens.Heading;
  const jobs = [];
  while (remainingExperienceTokens.length) {
    const companyHeadingToken = remainingExperienceTokens.find(
      (token) => token.type === "heading" && token.depth === firstCompany.depth,
    ) as Tokens.Heading;
    if (!companyHeadingToken) break;

    const companyDetailTokens = getSectionItems(remainingExperienceTokens, companyHeadingToken.text);
    const companyName = companyHeadingToken.text;

    let remainingRoleTokens = companyDetailTokens.slice();
    const firstRole = companyDetailTokens[0] as Tokens.Heading;
    const roles = [];
    while (remainingRoleTokens.length) {
      const roleHeadingToken = remainingRoleTokens.find(
        (token) => token.type === "heading" && token.depth === firstRole.depth,
      ) as Tokens.Heading;
      if (!roleHeadingToken) break;

      const roleDetailTokens = getSectionItems(remainingRoleTokens, roleHeadingToken.text);
      const [title, date] = roleHeadingToken.text.split("[");
      const role = {
        title: title.trim(),
        date: date ? date.replace("]", "").trim() : "",
        // description: roleGroup[0].text,
        // achievements: roleGroup.slice(1).map((token) => token.text),
      };
      roles.push(role);
      remainingRoleTokens = remainingRoleTokens.slice(roleDetailTokens.length + 1);
    }

    jobs.push({ company: companyName, roles });
    remainingExperienceTokens = remainingExperienceTokens.slice(companyDetailTokens.length + 1);
  }
  console.log("jobs", jobs);
  // resume.experience

  // export interface Job {
  //   company: string;
  //   roles: {
  //     title: string;
  //     date: string;
  //     description: string;
  //     achievements: string[];
  //   }[];
  // }
}

export default function markdownToJSON(markdown: string): Resume {
  markdownToJSON2(markdown);
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

  const nameToken = tokens.find((token) => token.type === "heading" && token.depth === 1)! as Tokens.Heading;
  resume.name = nameToken.text;

  const contact = tokens.find(
    (token) => token.type === "paragraph" && token.text.indexOf("linkedin") !== -1,
  )! as Tokens.Paragraph;
  resume.contact = contact.text.split(" • ");

  const summaryHeaderIndex = tokens.findIndex((token) => token.type === "heading" && token.text === "Summary")!;
  const summaryText = tokens[summaryHeaderIndex + 1] as Tokens.Paragraph;
  resume.summary = summaryText.text;

  for (const token of tokens) {
    if (token.type === "heading") {
      if (token.depth === 2) {
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
      if (currentProject) {
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
