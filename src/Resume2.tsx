import type { Resume } from "./util/types";
import { marked } from "marked";

function Date({ from, to }: { from: number; to: number | undefined }) {
  return (
    <span className=" text-sm">
      {from} - {to || "Present"}
    </span>
  );
}

function VerticalList({ list }: { list: string[] | undefined }) {
  if (!list) return null;
  const parsed = list.map((item) => marked.parseInline(item));
  return (
    <ul className="list-disc pl-4 mt-2 space-y-1 text-sm marker:text-muted-foreground">
      {parsed.map((text, index) => (
        <li
          key={index}
          style={{ marginLeft: "-2px" }}
          dangerouslySetInnerHTML={{ __html: text }}
        ></li>
      ))}
    </ul>
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
    return <h1 className="font-bold text-4xl text-blue-600">{children}</h1>;
  } else if (type === "h2") {
    return <h2 className="font-bold text-xl mb-3">{children}</h2>;
  } else if (type === "h3") {
    return <h3 className="font-semibold text-lg">{children}</h3>;
  } else if (type === "h4") {
    return <h4 className="font-bold text-base">{children}</h4>;
  } else if (type === "h5") {
    return <h5 className="font-semibold text-sm">{children}</h5>;
  } else if (type === "h6") {
    return <h6 className=" text-sm font-semibold">{children}</h6>;
  }
}

function Text({ children, multiline = false }: { children: string; multiline?: boolean }) {
  const parsed = (multiline ? marked.parse(children) : marked.parseInline(children)) as string;
  return <div className="text-sm [&>p]:mb-2" dangerouslySetInnerHTML={{ __html: parsed }}></div>;
}
function InlineList({ list }: { list: string[] | undefined }) {
  if (!list) return null;
  const parsed = list.map((item) => marked.parseInline(item));
  return (
    <ul className="flex flex-wrap justify-start space-x-2 text-sm">
      {parsed.map((text, index) => (
        <li key={index} className="flex items-center">
          {index > 0 && <span className="mr-2 text-gray-400">•</span>}
          <span dangerouslySetInnerHTML={{ __html: text }}></span>
        </li>
      ))}
    </ul>
  );
}
function Logo({ company }: { company: string }) {
  const fileName = company.toLowerCase().replace(" ", "-");
  return (
    <img
      src={`assets/${fileName}.png`}
      alt={company}
      className="h-3 inline-block mr-2 align-baseline contrast-50"
    />
  );
}
export default function ResumeComponent({ resume }: { resume: Resume }) {
  return (
    <div className="max-w-4xl p-8 mx-auto bg-white leading-snug shadow-lg my-3 print:p-0 print:m-0">
      <header className="mb-2">
        <div className="flex justify-between items-start gap-6">
          <div className="rounded-lg text-right">
            <h1 className="text-4xl font-bold text-foreground mb-4">Naren Ranjit</h1>
            <p className="text-muted-foreground text-sm mb-2">
              <a href="mailto:narendran.ranjit@gmail.com" className="hover:underline">
                narendran.ranjit@gmail.com
              </a>
            </p>
            <p className="text-muted-foreground text-sm mb-2">
              <a href="https://linkedin.com/in/narenranjit">linkedin.com/in/narenranjit</a>
            </p>
            <p className="text-muted-foreground text-sm mb-2">(415) 935-1432</p>
          </div>
          <div className="flex-1 border-l-4 border-slate-300 pl-6 pr-3 text-muted-foreground">
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
      <section>
        <h2 className="text-xl font-bold text-slate-500 mb-0 mt-4 text-right">Work Experience</h2>
        <div className="">
          {resume.experience.map((job, jobIndex) => (
            <div className="mb-8 print:mb-4">
              {/* rgb(138, 150, 170) */}
              <div className="py-1 px-3 mb-2 bg-slate-400 text-white font-bold">
                <Logo company={job.companyName} />
                {job.companyName}
              </div>
              {job.titles.map((title, titleIndex) => (
                <div className="mb-4 last:mb-0">
                  <div className="flex justify-between items-baseline relative">
                    <span className="font-bold text-lg">{title.name}</span>
                    <Date from={title.tenure.start} to={title.tenure.end} />
                  </div>
                  <div className="pr-1 text-muted-foreground">
                    {"role" in title && (
                      <>
                        {title.role.map((role, roleIndex) => (
                          <div className="last:mt-4" key={`role-${roleIndex}`}>
                            <div className="text-sm text-muted-foreground mb-2">{role.name}</div>
                            {role.description && (
                              <div className="my-2">
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
                          <div className="my-2">
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
        </div>
      </section>
    </div>
  );
}
