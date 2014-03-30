pClock
======

To use the pClock itself just launch index.html in the dist/ folder. 

dist/src holds the sources.

To benefit from grunt automation, livereload, and all the newfangled fancyness* you will need to install dependencies.
* = livereload includes jslinting, javascript concatenation and minification, and other wonders grunt has to offer.


Dev Dependencies
============================
The Phenological clock is mostly pure javascript, launch index.html in either the dist/ or the dist/src folder, and you're good to go. However some newfangled tools can make development more pleasant.

Namely

[Node.js](http://nodejs.org/)

[npm](https://www.npmjs.org/)

[grunt](https://www.gruntjs.com/)


Dev Installation
================

Make sure nodejs and npm are installed (follow the links above)

Install the project dependencies
```
npm install
```

```
grunt serve
```

Point your browser to [localhost:8000](localhost:8000) et voila.

If you want livereload to work, install the browser extensions here: http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-
