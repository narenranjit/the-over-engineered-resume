import { marked } from "marked";
import type { Token, Tokens } from "marked";
import type { Resume, Job, Title, Role, Tenure, PersonalProject } from "./types";

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
  const text = list.map((item) => item.text).join("\n\n");
  return text;
}

function processNestedTokens<T>(
  tokens: Token[],
  processItem: (tokens: Token[], heading: Tokens.Heading) => T,
): T[] {
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

function extractContactInfo(text: string) {
  //(415) 935-1432 | narendran.ranjit@gmail.com | linkedin.com/in/narenranjit
  const phoneMatch = text.match(/\(\d{3}\) \d{3}-\d{4}/);
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[A-Za-z0-9-]+/);

  return {
    phone: phoneMatch ? phoneMatch[0] : "",
    email: emailMatch ? emailMatch[0] : "",
    linkedin: linkedinMatch ? linkedinMatch[0] : "",
  };
}
export default function markdownToResume(markdown: string): Resume {
  const tokens = marked.lexer(markdown);
  const resume: Resume = {
    name: { first: "", last: "" },
    contact: { linkedin: "", email: "", phone: "" },
    summary: { description: "", achievements: [] },
    experience: [],
    education: [],
    projects: [],
  };

  const nameToken = tokens.find(
    (token) => token.type === "heading" && token.depth === 1,
  )! as Tokens.Heading;
  const [first, last] = nameToken.text.split(" ");
  resume.name.first = first;
  resume.name.last = last;

  const contact = tokens.find(
    (token) => token.type === "paragraph" && token.text.toLowerCase().indexOf("linkedin") !== -1,
  )! as Tokens.Paragraph;
  resume.contact = extractContactInfo(contact.text);

  const summaryTokens = getSectionItems(tokens, "summary");
  const summaryText = retreiveParagraphText(summaryTokens);
  resume.summary = {
    description: summaryText,
    achievements: retreiveListItemText(summaryTokens),
  };
  const experienceTokens = getSectionItems(tokens, "experience");
  const experienceJSON = processNestedTokens<Job>(
    experienceTokens,
    (companyDetailTokens, companyHeadingToken) => {
      const companyName = companyHeadingToken.text;
      const roles = processNestedTokens<Title | Role>(
        companyDetailTokens,
        (roleDetailTokens, roleHeadingToken) => {
          const [name, tenure] = extractTitleAndTenure(roleHeadingToken.text);
          const role: Role = {
            name,
            tenure,
          };
          if (!roleDetailTokens.length) {
            return role;
          } else if (roleDetailTokens[0].type !== "heading") {
            role.description = retreiveParagraphText(roleDetailTokens);
            role.achievements = retreiveListItemText(roleDetailTokens);
            return role;
          } else {
            const titles = processNestedTokens<Role>(
              roleDetailTokens,
              (titleDetailTokens, titleHeadingToken) => {
                const [name, tenure] = extractTitleAndTenure(titleHeadingToken.text);
                return {
                  name,
                  tenure,
                  description: retreiveParagraphText(titleDetailTokens),
                  achievements: retreiveListItemText(titleDetailTokens),
                };
              },
            );
            const [name, tenure] = extractTitleAndTenure(roleHeadingToken.text);
            return { name, tenure, role: titles };
          }
        },
      );
      return { companyName: companyName, titles: roles };
    },
  );
  resume.experience = experienceJSON;
  // console.log("jobs", experienceJSON);

  const educationTokens = getSectionItems(tokens, "education")![0] as Tokens.List;
  const education = educationTokens.items.map((item) => {
    const [degree, institution, date] = item.text.split(" | ");
    const [degreeName, major] = degree.split(",");
    return {
      degree: degreeName,
      major,
      institution: institution.trim(),
      date: tenureFromDate(date),
    };
  });
  resume.education = education;
  // console.log("education", education);

  const ppTokens = getSectionItems(tokens, "Personal Projects");
  const ppJSON = processNestedTokens<PersonalProject>(
    ppTokens,
    (projectDetailTokens, projectHeadingToken) => {
      const techStackText = projectDetailTokens.find(
        (token) =>
          token.type === "paragraph" && token.text.toLowerCase().indexOf("tech stack") === 0,
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

      const description = (projectDetailTokens[0]! as Tokens.Paragraph).text;
      return {
        name: projectHeadingToken.text,
        description,
        link,
        techStack,
      };
    },
  );
  resume.projects = ppJSON;
  console.log("resume", resume);

  return resume;
}
