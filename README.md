## What is this?

A tool to convert your Markdown resume into well-styled HTML which looks good both on screen and print - and generates PDFs!

## Why does this exist?

- Arguably the simplest readable/writable text-based formatting language is **Markdown**.
- The system which the most control over rendering is **HTML + CSS** (yes and Latex, but then you'd have 2 problems).
- By far the most universally portable document format is **PDF**.

What if you could get the simplicity of Markdown with the portability of PDF and the customizability of CSS?

## How This Project Came to Be

#### Stage 1: The Google Docs Start

- "Time to update my resume." _Opens Google Docs._
- "This is so slow and clunky to edit." Maybe I should iterate on content locally, and then copy-paste to Google Docs for formatting.
- "Which version did I update? Did I copy-paste it back?" (x5)
- "Why aren’t my line-heights consistent ?!?. Formatting in Google Docs is painful. This would be so much simpler if I could use CSS." Hmm..

#### Stage 2: The HTML Switch

- "Let’s create a single HTML file with CSS." Simple, right?
- "All these `p` and `li` tags make scrolling around to edit a lot harder". Maybe I should componentize these for brevity.
- The HTML-generating functions start looking like a DIY React clone. "I’m basically recreating JSX at this point... might as well just use it."

#### Stage 3: React and Tailwind enter the scene

- "YES! So much cleaner now. Styling is actually fun."
- "what do I name this class? Ugh all these nested selectors". Reaches for Tailwind.
- "Works great — but all these long verbose classnames in the markup make it really hard to find the actual content to edit. Markdown was so much simpler...". Hmm..

#### Stage 4: Markdown → JSON → React

- "What if the content stayed in Markdown, but the layout was React?"
- **Five iterations of parsing later...**
- Success! Clean layout, perfect spacing... but my resume is now 4 pages long :-/
- **Fifty iterations of polishing later...**
- "Looks great! Let's see what print-preview looks like."... oh no
- After an annoying amount of dealing with cross-browser print styling inconsistencies..
- Here we are!

####  Stage 5: We generate PDFs!

- This part was actually pretty straight-forward. Puppeteer to run chrome locally and print-to-pdf.

## Should you use it?

Maybe? I probably have my name hard-coded in a couple of places, but if this sounds like a thing you need, I'm 90% certain it's going to be faster for you to fork and edit than go through the same stages of yak-shaving I did.

To get started

- `npm start`
- Edit `public/resume.md`, see changes on localhost.
- Run `npm run generate` when you're happy with it to generate a pdf file to `dist`.
