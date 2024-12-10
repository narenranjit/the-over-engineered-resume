import { marked } from "marked";
import type { Token, Tokens } from "marked";
import type { Resume, Education, Job, JobNew, Project, Title, Role, Tenure, PersonalProject } from "./types";

//Items between a heading and the next heading at the same depth
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
  return toReturn;
}

function retreiveListItemText(listDetailTokens: Token[]): string[] {
  if (!listDetailTokens || !listDetailTokens.length) return [];
  const list = listDetailTokens.find((token) => token.type === "list") as Tokens.List;
  return list.items.map((item) => item.text);
}
function retreiveParagraphText(tokens: Token[]): string {
  if (!tokens || !tokens.length) return "";
  const list = tokens.filter((token) => token.type === "paragraph") as Tokens.Paragraph[];
  const text = list.map((item) => item.text).join("\n");
  return text;
}

function processNestedTokens<T>(tokens: Token[], processItem: (tokens: Token[], heading: Tokens.Heading) => T): T[] {
  let remainingTokens = tokens.slice();
  const items: T[] = [];
  const depth = (tokens[0] as Tokens.Heading).depth;

  while (remainingTokens.length) {
    const headingToken = remainingTokens.find(
      (token) => token.type === "heading" && token.depth === depth,
    ) as Tokens.Heading;
    if (!headingToken) break;

    const detailTokens = getSectionItems(remainingTokens, headingToken.text);
    const item = processItem(detailTokens, headingToken);
    items.push(item);

    remainingTokens = remainingTokens.slice(detailTokens.length + 1);
  }
  return items;
}

function tenureFromDate(date: string): Tenure {
  const dateStr = date.replace("]", "").replace("[", "").trim().split("-");
  const tenure: Tenure = {
    start: +dateStr[0],
    end: dateStr[1] && dateStr[1].trim() !== "current" ? +dateStr[1] : undefined,
  };
  return tenure;
}
function extractTitleAndTenure(header: string): [string, Tenure] {
  const [title, date] = header.split("[");
  return [title.trim(), tenureFromDate(date)];
}
interface ResumeNew {
  name: string;
  contact: string[];
  summary: string;
  experience: JobNew[];
  education: Education[];
  projects: PersonalProject[];
}
function markdownToResume(markdown: string): ResumeNew {
  const tokens = marked.lexer(markdown);
  const resume: ResumeNew = {
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
  const experienceJSON = processNestedTokens<JobNew>(experienceTokens, (companyDetailTokens, companyHeadingToken) => {
    const companyName = companyHeadingToken.text;
    const roles = processNestedTokens<Title | Role>(companyDetailTokens, (roleDetailTokens, roleHeadingToken) => {
      const [title, tenure] = extractTitleAndTenure(roleHeadingToken.text);
      const role: Role = {
        title,
        tenure,
      };
      if (!roleDetailTokens.length) {
        return role;
      } else if (roleDetailTokens[0].type === "heading") {
        role.description = retreiveParagraphText(roleDetailTokens);
        role.achievements = retreiveListItemText(roleDetailTokens);
        return role;
      } else {
        const titles = processNestedTokens<Role>(roleDetailTokens, (titleDetailTokens, titleHeadingToken) => {
          const [title, tenure] = extractTitleAndTenure(titleHeadingToken.text);
          return {
            title: title,
            tenure: tenure,
            description: retreiveParagraphText(titleDetailTokens),
            achievements: retreiveListItemText(titleDetailTokens),
          };
        });
        return { name: roleHeadingToken.text.trim(), role: titles };
      }
    });
    return { companyName: companyName, titles: roles };
  });
  resume.experience = experienceJSON;
  console.log("jobs", experienceJSON);

  const educationTokens = getSectionItems(tokens, "education")![0] as Tokens.List;
  const education = educationTokens.items.map((item) => {
    const [degree, institution, date] = item.text.split(" | ");
    return { degree: degree.trim(), institution: institution.trim(), date: tenureFromDate(date) };
  });
  resume.education = education;
  // console.log("education", education);

  const ppTokens = getSectionItems(tokens, "Personal Projects");
  const ppJSON = processNestedTokens<PersonalProject>(ppTokens, (projectDetailTokens, projectHeadingToken) => {
    const techStackText = projectDetailTokens.find(
      (token) => token.type === "paragraph" && token.text.toLowerCase().indexOf("tech stack") === 0,
    ) as Tokens.Paragraph;
    const techStack =
      techStackText &&
      techStackText.text
        .replace("Tech Stack:", "")
        .split(".")
        .map((t) => t.trim())
        .filter((t) => t);

    const linkText = projectDetailTokens.find(
      (token) => token.type === "paragraph" && token.text.toLowerCase().indexOf("link:") === 0,
    ) as Tokens.Paragraph;
    const link = linkText && linkText.text.replace("Link:", "").trim();
    return {
      name: projectHeadingToken.text,
      description: "bar",
      link,
      techStack,
    };
  });
  resume.projects = ppJSON;
  // console.log(ppJSON);

  return resume;
}

export default function markdownToJSON(markdown: string): Resume {
  console.log(markdownToResume(markdown));
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
