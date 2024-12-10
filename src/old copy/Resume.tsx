import type { Resume } from "./util/types";
export default function Resume({ resume }: { resume: Resume }) {
  return (
    <div className="max-w-4xl mx-auto font-sans text-gray-800">
      <header className="mb-4">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">{resume.name}</h1>
        <ul className="flex flex-wrap justify-start space-x-2 text-sm">
          {resume.contact.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mr-2 text-gray-400">•</span>}
              {item}
            </li>
          ))}
        </ul>
      </header>

      <section className="mb-6">
        <p className="text-sm leading-6">{resume.summary}</p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Experience</h2>
        {resume.experience.map((job, jobIndex) => (
          <div key={jobIndex} className="mb-2">
            <div className="flex items-start">
              <div className="flex-grow">
                <h3 className="font-bold text-xl mb-2">{job.companyName}</h3>
                {job.titles.map((title, titleIndex) => (
                  <div key={titleIndex} className="mb-6">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-semibold text-lg">{title.name}</h4>
                      <span className="text-sm text-gray-600">
                        {title.tenure.start} - {title.tenure.end || "current"}
                      </span>
                    </div>
                    {"role" in title && (
                      <>
                        {title.role.map((role, roleIndex) => (
                          <div key={roleIndex} className="mb-4">
                            <h5 className="font-semibold text-md">{role.name}</h5>
                            <p className="text-sm mt-2">{role.description}</p>
                            {role.achievements && (
                              <ul className="list-disc pl-4 text-sm space-y-1 marker:text-gray-400">
                                {role.achievements.map((achievement, achievementIndex) => (
                                  <li key={achievementIndex} style={{ marginLeft: "-2px" }}>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                    {!("role" in title) && (
                      <>
                        {title.description && <p className="text-sm mb-2">{title.description}</p>}
                        {title.achievements && (
                          <ul className="list-disc pl-4 text-sm space-y-1 marker:text-gray-400">
                            {title.achievements.map((achievement, achievementIndex) => (
                              <li key={achievementIndex} style={{ marginLeft: "-2px" }}>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Education</h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">{edu.degree}</h3>
              <span className="text-sm">
                {edu.date.start} - {edu.date.end}
              </span>
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
            {project.techStack && (
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-sm">Tech Stack:</h4>
                <ul className="flex space-x-2">
                  {project.techStack.map((item) => (
                    <li key={item} className="text-sm text-gray-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
