## What is this?

A tool to convert your Markdown resume into well-styled HTML which look good both on screen and print - and generates PDFs!

## Why is this?

- Arguably the simplest readable/writable text-based formatting language is **Markdown**.
- The system which the most control over rendering is** HTML + CSS** (yes and Latex, but then you'd have 2 problems).
- The most portable document format is **PDF**.

What if you could get the simplicity of Markdown with the portability of PDF and the customizability of CSS?

## How This Project Came to Be

#### **Stage 1: The Google Doc Era**

- "Time to update my resume." _Opens Google Docs._
- "This is so slow and clunky to edit." Maybe I should iterate on content locally, and then copy-paste to Google Docs for formatting.
- "Which version did I update? Did I copy-paste it back?" (x5)
- Formatting in Google Docs is a nightmare. Why aren’t my line-heights consistent ?!? This would be so much simpler if I could use CSS. Hmm..

#### **Stage 2: The HTML Era**

- "Let’s create a single HTML file with default CSS. Simpler, right?"
- Realizes all the extra `p` and `li` tags make scrolling around to edit a lot harder. "Maybe I should componentize these for brevity"
- The HTML-generating functions start looking like a DIY React clone. "I’m basically recreating JSX at this point... might as well just use it."

#### **Stage 3: React and Tailwind**

- "YES! So much cleaner now. Styling is actually fun."
- Starts hitting "what do I name this class?" fatigue. Reaches for Tailwind.
- Tailwind works great — but all those long verbose classnames make it really hard to find the actual content in my resume to edit. "Markdown was so much simpler... hmm."

#### **Stage 4: Markdown → JSON → React**

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

Maybe? I still have my name hard-coded in a bunch of places, but I'm 90% certain it's going to be faster for you to fork and edit than go through the same stages of yak-shaving I did.

To get started

- `npm start`
- Edit `public/resume.md`, see changes on localhost.
- Run `npm run generate` when you're happy with it.
