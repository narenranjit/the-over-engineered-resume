import React, { useState, useEffect } from "react";
import { marked } from "marked";

interface Job {
  company: string;
  roles: {
    title: string;
    date: string;
    description: string;
    achievements: string[];
  }[];
}

interface Education {
  degree: string;
  institution: string;
  date: string;
}

interface Project {
  name: string;
  description: string;
  techStack?: string;
}

interface Resume {
  name: string;
  contact: string[];
  summary: string;
  experience: Job[];
  education: Education[];
  projects: Project[];
}

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
      } else if (currentRole) {
        currentRole.description = token.text;
      } else if (currentSection === "education") {
        const [degree, institution, date] = token.text.split(" | ");
        resume.education.push({ degree, institution, date });
      } else if (currentProject) {
        if (token.text.startsWith("Tech Stack:")) {
          currentProject.techStack = token.text.replace("Tech Stack:", "").trim();
        } else {
          currentProject.description += (currentProject.description ? "\n" : "") + token.text;
        }
      }
    } else if (token.type === "list" && currentRole) {
      currentRole.achievements = token.items.map((item: any) => item.text);
    }
  }

  return resume;
}

const ResumeComponent: React.FC<{ resume: Resume }> = ({ resume }) => {
  return (
    <div className="max-w-4xl mx-auto p-8 font-sans text-gray-800">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-[#0066cc] mb-2">{resume.name}</h1>
        <ul className="flex flex-wrap justify-start space-x-2 text-sm">
          {resume.contact.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mr-2 text-gray-400">•</span>}
              {item}
            </li>
          ))}
        </ul>
      </header>

      <section className="mb-8">
        <p className="text-sm leading-6">{resume.summary}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Experience</h2>
        {resume.experience.map((job, jobIndex) => (
          <div key={jobIndex} className="mb-8">
            <div className="flex items-start">
              <div className="flex-grow">
                <h3 className="font-bold text-xl mb-4">{job.company}</h3>
                {job.roles.map((role, roleIndex) => (
                  <div key={roleIndex} className="mb-6 border-l-4 border-blue-500">
                    <div className="pl-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-semibold text-lg">{role.title}</h4>
                        <span className="text-sm text-gray-600">{role.date}</span>
                      </div>
                      <p className="text-sm mb-2">{role.description}</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {role.achievements.map((achievement, achievementIndex) => (
                          <li key={achievementIndex}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Education</h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">{edu.degree}</h3>
              <span className="text-sm">{edu.date}</span>
            </div>
            <p className="text-sm">{edu.institution}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Personal Projects</h2>
        {resume.projects.map((project, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <p className="text-sm mt-2 whitespace-pre-line">{project.description}</p>
            {project.techStack && <p className="text-sm mt-2 italic text-gray-600">Tech Stack: {project.techStack}</p>}
          </div>
        ))}
      </section>
    </div>
  );
};

const Resume: React.FC = () => {
  const [resumeData, setResumeData] = useState<Resume | null>(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        // In a real application, you would fetch this from an API
        const markdown = `# Naren Ranjit

(415) 935-1432 • narendran.ranjit@gmail.com • linkedin.com/in/narenranjit

## Summary

I thrive at the intersection of product and engineering, leading teams in crafting products so seamless they feel invisible. I've helped launch multiple 0-1 products, bridging vision and execution by shipping fast and iterating often. I've scaled organizations through explosive growth and guided them during downturns, with a constant focus on resilience and adaptability. I foster engineering cultures that thrive on curiosity, speed, and purpose, where teams take initiative, act with clarity, and embrace risks, knowing that learning fuels growth.

## Experience

### Course Hero

#### Senior Director of Engineering [2022 - current]

Lead cross-functional ML and engineering org during a challenging phase as LLMs disrupted the EdTech landscape. Focused on launching innovative products to secure product-market fit.

- Transitioned ML strategy from in-house to foundational models, improving scalability and accelerating time-to-market.
- Fostered a customer-centric culture connecting engineers with users, with 70% of ICs engaging in at least 1 monthly customer interaction.
- Promoted a learning-driven development cycle, increasing AB-tests by 50% to drive rapid hypothesis validation and product iteration.

#### Director of Engineering [2021 - 2022]

Owned engineering for the Question-and-Answer platform, one of our primary lines of business, generating ~$40M annually.

- Piloted our first offshore team, creating onboarding and collaboration frameworks now integral to our operational strategies.
- Proactively formed a volunteer-led team to improve Developer Experience, achieving 40% faster test runs and 35% CI speed improvement, resulting in a 80% engagement lift. Secured funding for a full-time team based on this success.

### Frontpage.to

#### Founder [2017 - 2019]

Frontpage.to was a customizable content aggregation tool for creating personalized dashboards integrating email, social media, and blogs. Initially built for personal use, founded the company after validating market demand.

- Scaled to 10K Daily Active Users through organic marketing and community-building.
- Engaged directly with users to gather feedback, iterating on features to achieve a 50% Day-30 retention rate.
- Owned every aspect of the product - from customer research to design and development — ensuring a cohesive vision that led to sustained engagement and growth.

## Education

Master of Science (Computer Science) | North Carolina State University | 2005 - 2007
Bachelor of Technology (Information Technology) | Anna University, India | 2001 - 2005

## Projects

### Chandrian

A semantic syntax highlighting theme for VSCode, designed to make scanning large codebases easier and to highlight errors more effectively. Fully accessible, meeting "AA" WCAG standards. I created this for personal use, addressing frustrations I had with existing options, and has since gained traction with over 3,000 active users.

### Feelings.earth

A visualization of emotions on Twitter across the globe, mapping tweets in real-time to explore how sentiment changes by time of day and location. Originally built last Christmas out of curiosity about what people around the world were wishing for, it has since expanded to identify and handle a wider range of emotions.

Tech Stack: Typescript. ThreeJS. React. NextJS. Cloudflare Workers.

### SpellWhiz

A word-based collaborative real-time multiplayer card game. This was an attempt to recreate a nostalgic game I enjoyed in my childhood, now adapted as a multiplayer digital version to play with my own kids (temporarily offline).

Tech Stack: Typescript. React. Firebase. Tailwind. Vite.`;

        const parsedResume = await parseMarkdown(markdown);
        setResumeData(parsedResume);
      } catch (error) {
        console.error("Error fetching resume data:", error);
      }
    };

    fetchResumeData();
  }, []);

  if (!resumeData) {
    return <div>Loading...</div>;
  }

  return <ResumeComponent resume={resumeData} />;
};

export default Resume;
