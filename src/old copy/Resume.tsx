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
  function Heading({ children, type }: { children: React.ReactNode; type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }) {
    if (type === "h1") {
      return <h1 className="text-4xl font-bold text-blue-600">{children}</h1>;
    } else if (type === "h2") {
      return <h2 className="text-2xl font-bold">{children}</h2>;
    } else if (type === "h3") {
      return <h3 className="font-semibold text-lg">{children}</h3>;
    } else if (type === "h4") {
      return <h4 className="font-semibold text-md">{children}</h4>;
    } else if (type === "h5") {
      return <h5 className="font-semibold text-base">{children}</h5>;
    } else if (type === "h6") {
      return <h6 className="font-semibold text-sm">{children}</h6>;
    }
  }

  return (
    <div className="max-w-4xl mx-auto font-sans text-gray-800">
      <header className="mb-4">
        <div className="mb-2">
          <Heading type="h1">{resume.name}</Heading>
        </div>
        <InlineList list={resume.contact} />
      </header>
      <section className="mb-6">
        <p className="text-sm">{resume.summary}</p>
      </section>
      <section className="mb-6">
        <Heading type="h2">Experience</Heading>
        {resume.experience.map((job, jobIndex) => (
          <div key={jobIndex} className="mb-2">
            <Heading type="h3">{job.companyName}</Heading>
            {job.titles.map((title, titleIndex) => (
              <div key={titleIndex} className="mb-6">
                <div className="flex justify-between mb-2">
                  <Heading type="h4">{title.name}</Heading>
                  <Date from={title.tenure.start} to={title.tenure.end} />
                </div>
                {"role" in title && (
                  <>
                    {title.role.map((role, roleIndex) => (
                      <div key={roleIndex} className="mb-4">
                        <Heading type="h5">{role.name}</Heading>
                        <p className="text-sm mt-2">{role.description}</p>
                        <VerticalList list={role.achievements} />
                      </div>
                    ))}
                  </>
                )}
                {!("role" in title) && (
                  <>
                    {title.description && <p className="text-sm mb-2">{title.description}</p>}
                    <VerticalList list={title.achievements} />
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Education</h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <Heading type="h4">{edu.degree}</Heading>
              <Date from={edu.date.start} to={edu.date.end} />
            </div>
            <p className="text-sm">{edu.institution}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Personal Projects</h2>
        {resume.projects.map((project, index) => (
          <div key={index} className="mb-4">
            <Heading type="h4">{project.name}</Heading>
            <p className="text-sm mt-2">{project.description}</p>
            {project.techStack && (
              <div className="flex items-center space-x-2">
                <Heading type="h6">Tech Stack:</Heading>
                <InlineList list={project.techStack} />
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
