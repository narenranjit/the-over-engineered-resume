import type { Resume } from "./types";
export default function Resume({ resume }: { resume: Resume }) {
  return (
    <div className="max-w-4xl mx-auto p-8 font-sans text-gray-800">
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
          <div key={jobIndex} className="mb-4">
            <div className="flex items-start">
              <div className="flex-grow">
                <h3 className="font-bold text-xl mb-2">{job.company}</h3>
                {job.roles.map((role, roleIndex) => (
                  <div key={roleIndex} className="mb-6 border-l-4 border-blue-500 pl-4">
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
}
