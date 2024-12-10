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
export default function ResumeComponent({ resume }: { resume: Resume }) {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-primary">{resume.name}</h1>
        <p className="text-muted-foreground text-sm">
          (415) 935-1432 • narendran.ranjit@gmail.com •{" "}
          <a href="https://linkedin.com/in/narenranjit" className="text-blue-600 hover:underline">
            linkedin.com/in/narenranjit
          </a>
        </p>
        <p className="text-muted-foreground text-sm">{resume.summary}</p>
      </header>

      <section className="space-y-8">
        <h2 className="text-xl font-bold text-orange-500">Experience</h2>
        <div className="space-y-6">
          {resume.experience.map((job, jobIndex) => (
            <>
              <span>{job.companyName}</span>

              {job.titles.map((title, titleIndex) => (
                <div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold">{title.name}</span>
                    <Date from={title.tenure.start} to={title.tenure.end} />
                  </div>
                  {"role" in title && (
                    <>
                      {title.role.map((role, roleIndex) => (
                        <div className="mb-2" key={`role-${roleIndex}`}>
                          {role.description && (
                            <div className="my-2">
                              <Text>{role.description}</Text>
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground">{role.name}</div>
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
            </>
          ))}
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-baseline">
              <div>
                <span className="font-bold">Course Hero</span>
                <span className="mx-2">-</span>
                <span>Senior Director of Engineering</span>
              </div>
              <span className="text-muted-foreground text-sm">2022 - Present</span>
            </div>
            <div className="text-sm text-muted-foreground">AI/User Experience</div>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                Lead cross-functional ML and engineering org during a challenging phase as LLMs
                disrupted...
              </li>
              <li>
                Transitioned ML strategy from in-house to foundational models, improving
                scalability...
              </li>
              <li>
                Fostered a customer-centric culture connecting engineers with users, with 70% of ICs
                engaging...
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Platform Experiences</div>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                Owned engineering for the Question-and-Answer platform, one of our primary lines of
                business...
              </li>
              <li>
                Piloted our first offshore team, creating onboarding and collaboration frameworks...
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
