import type { Resume } from "./util/types";
export default function ResumeComponent({ resume }: { resume: Resume }) {
  function VerticalList({ list }: { list: string[] | undefined }) {
    return (
      list && (
        <ul className="list-disc pl-4 text-sm space-y-1 marker:text-gray-400">
          {list.map((text, index) => (
            <li key={index} style={{ marginLeft: "-2px" }}>
              {text}
            </li>
          ))}
        </ul>
      )
    );
  }
  function InlineList({ list }: { list: string[] | undefined }) {
    return (
      list && (
        <ul className="flex flex-wrap justify-start space-x-2 text-sm">
          {list.map((text, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mr-2 text-gray-400">•</span>}
              {text}
            </li>
          ))}
        </ul>
      )
    );
  }
  function Date({ from, to }: { from: number; to: number | undefined }) {
    return (
      <span className="text-sm text-gray-600">
        {from} - {to || "current"}
      </span>
    );
  }
  function Heading({
    children,
    type,
  }: {
    children: React.ReactNode;
    type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  }) {
    if (type === "h1") {
      return <h1 className="text-4xl font-bold text-blue-600">{children}</h1>;
    } else if (type === "h2") {
      return <h2 className="text-xl font-bold">{children}</h2>;
    } else if (type === "h3") {
      return <h3 className="font-semibold text-lg">{children}</h3>;
    } else if (type === "h4") {
      return <h4 className="font-semibold text-base">{children}</h4>;
    } else if (type === "h5") {
      return <h5 className="font-semibold text-sm">{children}</h5>;
    } else if (type === "h6") {
      return <h6 className="font-semibold text-sm">{children}</h6>;
    }
  }

  function Section({ children, level = 1 }: { children: React.ReactNode; level?: number }) {
    const levels = ["mb-8", "mb-6", "mb-4", "mb-2"];
    return <section className={levels[level - 1]}>{children}</section>;
  }
  function Text({ children, level = 1 }: { children: React.ReactNode; level?: number }) {
    return <p className="text-sm">{children}</p>;
  }
  return (
    <div className="max-w-4xl mx-auto font-sans text-gray-800">
      <header>
        <Heading type="h1">{resume.name}</Heading>
        <InlineList list={resume.contact} />
      </header>
      <Section>
        <Text>{resume.summary}</Text>
      </Section>
      <Section>
        <Heading type="h2">Experience</Heading>
        {resume.experience.map((job, jobIndex) => (
          <Section level={2} key={jobIndex}>
            <Heading type="h3">{job.companyName}</Heading>
            {job.titles.map((title, titleIndex) => (
              <Section level={3} key={titleIndex}>
                <div className="flex justify-between">
                  <Heading type="h4">{title.name}</Heading>
                  <Date from={title.tenure.start} to={title.tenure.end} />
                </div>
                {"role" in title && (
                  <>
                    {title.role.map((role, roleIndex) => (
                      <Section level={4} key={roleIndex}>
                        <div className="flex justify-between">
                          <Heading type="h5">{role.name}</Heading>
                          <span className="text-xs text-gray-600">{role.tenure.start}</span>
                        </div>
                        <Text>{role.description}</Text>
                        <VerticalList list={role.achievements} />
                      </Section>
                    ))}
                  </>
                )}
                {!("role" in title) && (
                  <>
                    {title.description && <Text>{title.description}</Text>}
                    <VerticalList list={title.achievements} />
                  </>
                )}
              </Section>
            ))}
          </Section>
        ))}
      </Section>
      <Section>
        <Heading type="h2">Education</Heading>
        {resume.education.map((edu, index) => (
          <Section level={4} key={index}>
            <div className="flex justify-between">
              <Heading type="h4">{edu.degree}</Heading>
              <Date from={edu.date.start} to={edu.date.end} />
            </div>
            <Text>{edu.institution}</Text>
          </Section>
        ))}
      </Section>
      <Section>
        <Heading type="h2">Personal Projects</Heading>
        {resume.projects.map((project, index) => (
          <Section level={3} key={index}>
            <Heading type="h4">{project.name}</Heading>
            <Text>{project.description}</Text>
            {project.techStack && (
              <div className="flex items-center space-x-2">
                <Heading type="h6">Tech Stack:</Heading>
                <InlineList list={project.techStack} />
              </div>
            )}
          </Section>
        ))}
      </Section>
    </div>
  );
}
