import "./App.css";
import markdownit from "markdown-it";

const md = markdownit({
  typographer: true,
});

function Markdown({ children }: { children: string }) {
  return <div dangerouslySetInnerHTML={{ __html: md.render(children.split("- ").join("\n- ")) }}></div>;
}

function Role({ title, from, to, minor }: { title: string; from: string; to?: string; minor?: boolean }) {
  const Tag = minor ? "h5" : "h4";
  return (
    <Tag className="relative">
      {title}
      <div className="time">
        <time>{from}</time>
        {to && <time>current</time>}
      </div>
    </Tag>
  );
}
export default function App() {
  return (
    <>
      <div className="hero">
        <h1 className="mb-0 h1">Naren Ranjit</h1>
        <ul className="inline-flex pl-0 list-inside">
          <li className="mr-8 ps-0">
            <a href="mailto:narendran.ranjit@gmail.com">narendran.ranjit@gmail.com</a>
          </li>
          <li className="mr-8">
            <a href="tel:415 935 1432">415 935 1432</a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/narenranjit/">linkedin.com/in/narenranjit</a>
          </li>
        </ul>
      </div>
      <p className="summary">
        I thrive at the intersection of product and engineering, leading teams in crafting products so seamless they
        feel invisible. I've helped launch multiple 0-1 products, bridging vision and execution by shipping fast and
        iterating often. I've scaled organizations through explosive growth and guided them during downturns, with a
        constant focus on resilience and adaptability. I foster engineering cultures that thrive on curiosity, speed,
        and purpose, where teams take initiative, act with clarity, and embrace risks, knowing that learning fuels
        growth.
      </p>
      <div className="experience">
        <h2>Experience</h2>
        <h3>Course Hero</h3>
        <Role title="Senior Director of Engineering" from="2023" to="current" />
        <Role title=" AI/User Experience" from="2023" minor />
        <p>
          Lead cross-functional ML and engineering org during a challenging phase as LLMs disrupted the EdTech
          landscape. Focused on launching innovative products to secure product-market fit.
        </p>
        {/* prettier-ignore */}
        <Markdown>
          - Transitioned ML strategy from in-house to foundational models, improving scalability and accelerating
          time-to-market.
          - Fostered a customer-centric culture connecting engineers with users, with 70% of ICs engaging in at least 1
          monthly customer interaction.
          - Promoted a learning-driven development cycle, increasing AB-tests by 50% to drive rapid hypothesis validation
          and product iteration.
        </Markdown>
        <Role title="Platform Experiences" from="2022" minor />
        <p>
          Shepherded a growing organization through the Covid-era EdTech boom, scaling to meet surging demand while
          focusing on engineering efficiency and user engagement.
        </p>
        {/* prettier-ignore */}
        <Markdown>
          - Restructured teams with clear charters and OKRs, streamlining decision-making and enhancing accountability.
          Scaled headcount by 30%, while also boosting engagement scores by 7%.
          - Instituted DORA metrics to boost engineering efficiency, reducing lead-time by 20% and improving deployment
          pipeline throughput by 15%.
        </Markdown>
        <Role title="Director of Engineering" from="2021" to="2022" />
        <p>
          Owned engineering for the Question-and-Answer platform, one of our primary lines of business, generating ~$40M
          annually.
        </p>
        {/* prettier-ignore */}
        <Markdown>
            - Piloted our first offshore team, creating onboarding and collaboration frameworks now integral to our
            operational strategies.
            - Proactively formed a volunteer-led team to improve Developer Experience, achieving 40% faster test runs and
            35% CI speed improvement, resulting in a 80% engagement lift. Secured funding for a full-time team based on
            this success.
        </Markdown>
        <Role title="Senior Engineering Manager" from="2019" to="2021" />
        <p>
          Led engineering for ‘Textbook Solutions', a multi-million-dollar product launch, resolving content licensing
          and product-market uncertainties to achieve an on-time, on-budget launch hitting key product goals.
        </p>
        {/* prettier-ignore */}
        <Markdown> 
            - Championed a Skunkworks project to launch mobile and desktop apps in 4 weeks (initial estimates were
            months). These apps contributed to 30% of platform traffic and were recognized as a ‘Recommended App' on the
            Windows Store.
           - Achieved an 80% promotion rate among 12 direct reports through mentorship and coaching for impact.
        </Markdown>
        <h3>Frontpage.to</h3>
        <Role title="Founder" from="2017" to="2019" />
        <p>
          Frontpage.to was a customizable content aggregation tool for creating personalized dashboards integrating
          email, social media, and blogs. Initially built for personal use, founded the company after validating market
          demand.
        </p>
        {/* prettier-ignore */}
        <Markdown> 
          - Scaled to 10K Daily Active Users through organic marketing and community-building.
          - Engaged directly with users to gather feedback, iterating on features to achieve a 50% Day-30 retention rate.
          - Owned every aspect of the product - from customer research to design and development — ensuring a cohesive
          vision that led to sustained engagement and growth.
        </Markdown>
        <h3 className="break-after-page">Forio</h3>
        <Role title="Director of Engineering" from="2014" to="2017" />
        <Role title="Senior Engineering Manager" from="2011" to="2014" />
        <p>
          Led Forio's consulting division, collaborating with Harvard, Wharton, IBM, and Fortune 500 companies, to build
          data-rich web simulations. Also owned all user-facing elements of the platform.
        </p>
        {/* prettier-ignore */}
        <Markdown>
          - Grew team from 3 to 30, establishing scalable hiring processes and engineering best practices.
          - Led consulting engagements, from sales calls to drafting SoWs, and developed an estimation framework with
          90% accuracy.
          - Served as lead architect for critical projects, including FlowJS—a framework-agnostic two-way data-binding
          tool I ideated, validated, and built.Owned design and specification of all REST APIs.
          - Wore multiple hats, taking on product management, design, and project management roles as needed.
         </Markdown>
        <Role title="Web Developer" from="2008" to="2011" />
        <p>
          Started as employee #3, driven by desire to have direct impact in a growing company. Developed user interfaces
          for data-rich web simulations, as well as frameworks to simplify their creation.
        </p>
        {/* prettier-ignore */}
        <Markdown>
          - Architected most of the technical stack, laying the foundation for the team's future growth.
          - Created a front-end framework to bootstrap simulations, still actively used over 12 years later.
          - Developed an innovative, IE6-compatible cross-iframe communication framework to enable real-time multiplayer
          applications.
         </Markdown>
        <h3>Symantec</h3>
        <Role title="Web Developer" from="2007" to="2008" />
        <p>
          Originally joined as a Java Engineer on a backend-heavy team. Identified a gap in UI expertise, and leveraged
          background in design to become front-end lead, spearheading development of a rule-based interface for SQL
          queries.
        </p>
        {/* prettier-ignore */}
        <Markdown>
          - Introduced automated front-end testing to improve quality and reduce regression issues.
          - Replaced outdated libraries with a modern tech stack.
          </Markdown>
      </div>
      <div className="education">
        <h2>Education</h2>
        <h4>Master of Science (Computer Science)</h4>
        <div>
          North Carolina State University
          <div className="time">
            <time>2005</time>
            <time>2007</time>
          </div>
        </div>
        <h4>Bachelor of Technology (Information Technology)</h4>
        <div>
          Anna University, India
          <div className="time">
            <time>2001</time>
            <time>2005</time>
          </div>
        </div>
      </div>
      <div className="personal">
        <h2>Personal Projects</h2>
        <h3>Chandrian https://marketplace.visualstudio.com/items?itemName=narenranjit.chandrian</h3>
        <p>
          A semantic syntax highlighting theme for VSCode, designed to make scanning large codebases easier and to
          highlight errors more effectively. Fully accessible, meeting “AA” WCAG standards. I created this for personal
          use, addressing frustrations I had with existing options, and has since gained traction with over 3,000 active
          users.
        </p>
        <h3>Feelings.earth</h3>
        <p>
          A visualization of emotions on Twitter across the globe, mapping tweets in real-time to explore how sentiment
          changes by time of day and location. Originally built last Christmas out of curiosity about what people around
          the world were wishing for, it has since expanded to identify and handle a wider range of emotions. Tech
          Stack: Typescript. ThreeJS. React. NextJS. Cloudflare Workers.
        </p>
        <h3>SpellWhiz</h3>
        <p>
          A word-based collaborative real-time multiplayer card game. This was an attempt to recreate a nostalgic game I
          enjoyed in my childhood, now adapted as a multiplayer digital version to play with my own kids (temporarily
          offline) Tech Stack: Typescript. React. Firebase. Tailwind. Vite.
        </p>
      </div>
    </>
  );
}
