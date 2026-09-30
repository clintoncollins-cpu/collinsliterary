COLLINS LITERARY WEBSITE — plain HTML, CSS and JavaScript
==========================================================

HOW TO OPEN
1. Unzip this folder.
2. In VS Code: File > Open Folder... and choose "collins-literary-website".
3. Double-click index.html to view it in your browser, or install the
   "Live Server" extension in VS Code, right-click index.html and choose
   "Open with Live Server" (recommended: updates as you type).
   (Internet is needed to load the Google fonts; otherwise fallback fonts are used.)

PAGES
index.html, services.html, portfolio.html, team.html, about.html,
blog.html, contact.html, privacy-policy.html
(Privacy policy is linked in the footer of every page.)

FOLDERS
assets/css/style.css   all colours, fonts and layout (edit the :root block at the top)
assets/js/main.js      mobile menu, portfolio filter, contact form
assets/img/            your logo files, favicon and any images you add

THINGS TO CHANGE BEFORE YOU GO LIVE (search for "TODO" in the files)
- team.html and about.html: replace [Your Name] / [Team member name], bios and photos.
- portfolio.html: replace the sample projects with real work (instructions in the file).
- Footer and contact.html: replace the "#" social links with your real profiles.
- privacy-policy.html: review it (it is a general template, not legal advice).
- blog.html: each post is a <details class="post"> block. Copy one to add a post.

CONTACT FORM
The contact form submits directly to Formspree at https://formspree.io/f/mnpnnyzl.

PUBLISHING
Any static host works: Netlify, Vercel, GitHub Pages, Cloudflare Pages, or
your own hosting. Upload the whole folder contents.
