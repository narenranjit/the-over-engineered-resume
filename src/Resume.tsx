import type { Resume } from "./util/types";
import { marked } from "marked";
import "./resume.css";
function Date({ from, to }: { from: number; to: number | undefined }) {
  return (
    <span className=" text-xs px-2 py-1 rounded-md bg-slate-200 text-slate-600 leading-none">
      {from} &ndash; {to || "Present"}
    </span>
  );
}

function VerticalList({ list }: { list: string[] | undefined }) {
  if (!list) return null;
  const parsed = list.map((item) => marked.parseInline(item));
  return (
    <ul className="list-disc pl-4 mt-2 space-y-1 text-sm marker:text-slate-400">
      {parsed.map((text, index) => (
        <li
          className="print:ml-[1px] ml-[-2px]"
          key={index}
          dangerouslySetInnerHTML={{ __html: text }}
        ></li>
      ))}
    </ul>
  );
}
function Section({
  children,
  level = 1,
  ...others
}: { children: React.ReactNode; level?: number } & React.HTMLAttributes<HTMLDivElement>) {
  const levels = ["mb-8 print:mb-5", "mb-4", "mb-2"];
  return (
    <section className={levels[level - 1]} {...others}>
      {children}
    </section>
  );
}
function Heading({
  children,
  type,
  className = "",
}: {
  children: React.ReactNode;
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
} & React.HTMLAttributes<HTMLHeadingElement>) {
  if (type === "h1") {
    return (
      <h1 className={`text-4xl font-bold text-foreground mb-4 text-slate-800 ${className}`}>
        {children}
      </h1>
    );
  } else if (type === "h2") {
    return (
      <h2
        className={`text-xl font-black uppercase text-slate-600 mb-4 mt-4 text-right border-b-2 border-slate-400 ${className}`}
      >
        {children}
      </h2>
    );
  } else if (type === "h3") {
    return (
      <h3
        className={`py-1 px-3 mb-2 bg-slate-400 text-white font-semibold first-of-type:-mt-4 ${className}`}
      >
        {children}
      </h3>
    );
  } else if (type === "h4") {
    return <h4 className={`font-bold text-lg text-slate-800 ${className}`}>{children}</h4>;
  } else if (type === "h5") {
    return <h5 className={`text-sm text-muted-foreground mb-2 ${className}`}>{children}</h5>;
  } else if (type === "h6") {
    return <h6 className={`text-sm font-semibold ${className}`}>{children}</h6>;
  }
}

function Text({ children, multiline = false }: { children: string; multiline?: boolean }) {
  const parsed = (multiline ? marked.parse(children) : marked.parseInline(children)) as string;
  return (
    <div
      className="text-sm [&>p]:mb-2 text-muted-foreground"
      dangerouslySetInnerHTML={{ __html: parsed }}
    ></div>
  );
}
function InlineList({ list }: { list: string[] | undefined }) {
  if (!list) return null;
  const parsed = list.map((item) => marked.parseInline(item));
  return (
    <ul className="flex flex-wrap justify-start space-x-2 text-sm marker:text-muted-foreground">
      {parsed.map((text, index) => (
        <li key={index} className="flex items-center">
          {index > 0 && <span className="mr-2 text-gray-400">•</span>}
          <span dangerouslySetInnerHTML={{ __html: text }}></span>
        </li>
      ))}
    </ul>
  );
}
function sanitizeText(text: string) {
  return text.toLowerCase().replace(/[\s/.]/g, "-");
}
function Logo({ company }: { company: string }) {
  return (
    <img
      src={`assets/${sanitizeText(company)}.png`}
      alt={company}
      className="h-3 w-3 inline-block mr-2 align-baseline contrast-75"
    />
  );
}

function ContactItem({ href, text }: { href: string; text: string }) {
  return (
    <p className="text-muted-foreground text-sm mb-2 leading-tight">
      <a href={href} className="hover:underline">
        {text}
      </a>
    </p>
  );
}
export default function ResumeComponent({ resume }: { resume: Resume }) {
  return (
    <div className="max-w-4xl p-8 mx-auto bg-white leading-snug shadow-lg my-3 print:shadow-none print:p-0 print:m-0">
      <header className="mb-6">
        <div className="flex justify-between items-start gap-6">
          <div className="text-right">
            <Heading type="h1">
              <span className="text-slate-800 font-extrabold">{resume.name.first}</span>&nbsp;
              <span className="text-slate-600">{resume.name.last}</span>
            </Heading>
            <ContactItem href={`mailto:${resume.contact.email}`} text={resume.contact.email} />
            <ContactItem
              href={`https://${resume.contact.linkedin}`}
              text={resume.contact.linkedin}
            />
            <ContactItem href={`tel:${resume.contact.phone}`} text={resume.contact.phone} />
          </div>
          <div
            className="flex-1 border-l-4 border-slate-300 pl-6 pr-3 text-muted-foreground"
            id="summary"
          >
            <Text multiline>{resume.summary.description}</Text>
            <VerticalList list={resume.summary.achievements} />
          </div>
        </div>
      </header>
      {/* <header>
        <Heading type="h1">{resume.name}</Heading>

        <div className="border-l-2 border-gray-300 px-4  mt-4 mb-4 italic text-muted-foreground">
          <Text multiline>{resume.summary.description}</Text>
          <VerticalList list={resume.summary.achievements} />
        </div>
      </header> */}
      <Section>
        <Heading type="h2">Work Experience</Heading>
        {resume.experience.map((job) => (
          <div
            className={`mb-10 last-of-type:mb-0 company-${sanitizeText(job.companyName)}`}
            key={job.companyName}
          >
            <Heading type="h3">
              <Logo company={job.companyName} />
              {job.companyName}
            </Heading>
            {job.titles.map((title) => (
              <div
                style={{ zIndex: 999999 }}
                className={`mb-4 last:mb-0 ${sanitizeText(title.name)} hover:relative hover:scale-150 hover:p-10 hover:shadow-lg hover:bg-white transition-transform duration-300`}
                key={title.name}
              >
                <div className="flex justify-between items-center relative z-20">
                  <Heading type="h4">{title.name}</Heading>
                  <Date from={title.tenure.start} to={title.tenure.end} />
                </div>
                <div className="pr-2 text-muted-foreground">
                  {"role" in title && (
                    <>
                      {title.role.map((role, roleIndex) => (
                        <div className="last:mt-4" key={`role-${roleIndex}`}>
                          <Heading type="h5">{role.name}</Heading>
                          {role.description && (
                            <div className="my-1">
                              <Text>{role.description}</Text>
                            </div>
                          )}
                          <VerticalList list={role.achievements} />
                        </div>
                      ))}
                    </>
                  )}
                  {!("role" in title) && (
                    <>
                      {title.description && (
                        <div className="my-1">
                          <Text>{title.description}</Text>
                        </div>
                      )}
                      <VerticalList list={title.achievements} />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </Section>
      <Section>
        <Heading type="h2">Education</Heading>
        {resume.education.map((edu, index) => (
          <Section level={3} key={index}>
            <div className="flex justify-between items-center">
              <Heading type="h4">
                {edu.degree}, <span className="font-semibold">{edu.major}</span>
              </Heading>
              <Date from={edu.date.start} to={edu.date.end} />
            </div>
            <Text>{edu.institution}</Text>
          </Section>
        ))}
      </Section>
      <Section>
        <Heading type="h2">Personal Projects</Heading>
        {resume.projects.map((project, index) => (
          <Section level={2} key={index}>
            <div className="flex items-baseline">
              <Heading type="h4">
                {project.link ? <a href={project.link}>{project.name}</a> : <>{project.name}</>}
              </Heading>
            </div>

            <Text>{project.description}</Text>
            {project.techStack && (
              <div className="flex items-center space-x-2 mt-1 mb-2 text-muted-foreground">
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
