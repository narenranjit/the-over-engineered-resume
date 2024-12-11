import type { Resume } from "./util/types";
import { marked } from "marked";

function Date({ from, to }: { from: number; to: number | undefined }) {
  return (
    <span className="text-muted-foreground text-sm">
      {from} - {to || "Present"}
    </span>
  );
}

function VerticalList({ list }: { list: string[] | undefined }) {
  if (!list) return null;
  const parsed = list.map((item) => marked.parseInline(item));
  return (
    <ul className="list-disc pl-4 mt-2 space-y-1 text-sm">
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
function Text({ children, level = 1 }: { children: string; level?: number }) {
  const parsed = marked.parseInline(children) as string;
  return <p className="text-sm" dangerouslySetInnerHTML={{ __html: parsed }}></p>;
}
function Logo({ company }: { company: string }) {
  const fileName = company.toLowerCase().replace(" ", "-");
  return (
    <img
      src={`assets/${fileName}.png`}
      alt={company}
      className="h-3 inline-block mr-1 align-baseline	"
    />
  );
}
export default function ResumeComponent({ resume }: { resume: Resume }) {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      <header className="mb-4">
        <div className="flex justify-between items-start gap-6">
          <div className="rounded-lg text-right">
            <h1 className="text-4xl font-bold text-foreground mb-4">Naren Ranjit</h1>
            <p className="text-muted-foreground text-sm mb-2">
              <a href="mailto:narendran.ranjit@gmail.com" className="hover:underline">
                narendran.ranjit@gmail.com
              </a>
            </p>
            <p className="text-muted-foreground text-sm mb-2">
              <a
                href="https://linkedin.com/in/narenranjit"
                className="text-blue-600 hover:underline"
              >
                linkedin.com/in/narenranjit
              </a>
            </p>
            <p className="text-muted-foreground text-sm mb-2">(415) 935-1432</p>
          </div>
          <div className="flex-1 border-l-4 border-gray-300 pl-6 pr-3 py-2 bg-gray-50">
            <p className="text-sm">{resume.summary}</p>
          </div>
        </div>
      </header>
      <section>
        <h2 className="text-xl font-bold text-orange-500 mb-3">Experience</h2>
        <div>
          {resume.experience.map((job, jobIndex) => (
            <div className="mb-6">
              <span>
                {" "}
                <Logo company={job.companyName} />
                {job.companyName}
              </span>
              {job.titles.map((title, titleIndex) => (
                <div className="mb-4 last:mb-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold">{title.name}</span>
                    <Date from={title.tenure.start} to={title.tenure.end} />
                  </div>
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
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
