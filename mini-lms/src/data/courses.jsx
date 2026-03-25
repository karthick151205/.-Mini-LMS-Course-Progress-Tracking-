export const courses = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Learn the core concepts of JavaScript from scratch.",
    level: "Beginner",
    chapters: [
      {
        id: 11,
        title: "Getting Started",
        lessons: [
          {
            id: 111,
            title: "What is JavaScript?",
            type: "reading",
            content: `JavaScript is a lightweight, interpreted programming language with first-class functions. It is most well-known as the scripting language for Web pages, but it is also used in many non-browser environments such as Node.js.

JavaScript is a prototype-based, multi-paradigm, single-threaded, dynamic language, supporting object-oriented, imperative, and declarative programming styles.

Key facts:
- Created by Brendan Eich in 1995
- Standardized as ECMAScript
- Runs in every modern browser
- Can be used on the server with Node.js`,
          },
          {
            id: 112,
            title: "Setting up your environment",
            type: "reading",
            content: `To get started with JavaScript you need very little setup. Here is what you need:

1. A modern browser — Chrome or Firefox are recommended. Both have excellent developer tools built in.

2. A code editor — VS Code is the most popular choice. It has great JavaScript support out of the box.

3. Node.js — Download from nodejs.org. This lets you run JavaScript outside the browser.

Once installed, open your browser, press F12 to open DevTools, and click the Console tab. You can start typing JavaScript immediately!`,
          },
          {
            id: 113,
            title: "Quiz: JS Basics",
            type: "quiz",
            content: "Test your foundational knowledge of JavaScript.",
            quiz: {
              question: "Which keyword declares a block-scoped variable in JavaScript?",
              options: ["var", "let", "function", "class"],
              correct: 1,
            },
          },
        ],
      },
      {
        id: 12,
        title: "Data Types & Variables",
        lessons: [
          {
            id: 121,
            title: "Primitive types",
            type: "reading",
            content: `JavaScript has 7 primitive data types:

1. String — text values like "hello"
2. Number — integers and decimals like 42 or 3.14
3. Boolean — true or false
4. Undefined — a variable declared but not assigned
5. Null — intentional absence of value
6. BigInt — very large integers
7. Symbol — unique identifiers

Primitives are immutable — when you change a primitive value, you are creating a new value, not modifying the original.`,
          },
          {
            id: 122,
            title: "Type coercion",
            type: "reading",
            content: `Type coercion is JavaScript automatically converting one type to another.

Example of implicit coercion:
"5" + 1 = "51"   (number converted to string)
"5" - 1 = 4      (string converted to number)

This can cause bugs if you are not careful. Always use === instead of == to avoid unexpected type conversions.

=== checks both value AND type
== checks only value (with coercion)`,
          },
          {
            id: 123,
            title: "Quiz: Types",
            type: "quiz",
            content: "Check your understanding of the JS type system.",
            quiz: {
              question: "What does typeof null return in JavaScript?",
              options: ["'null'", "'undefined'", "'object'", "'boolean'"],
              correct: 2,
            },
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "React from Zero",
    description: "Build modern UIs with React step by step.",
    level: "Intermediate",
    chapters: [
      {
        id: 21,
        title: "React Concepts",
        lessons: [
          {
            id: 211,
            title: "The Virtual DOM",
            type: "reading",
            content: `The Virtual DOM is a lightweight copy of the real DOM kept in memory by React.

When your component's state changes:
1. React creates a new Virtual DOM tree
2. Compares it with the previous one (diffing)
3. Calculates the minimum changes needed
4. Updates only those parts in the real DOM

This makes React fast because direct DOM manipulation is expensive. React batches and optimizes updates behind the scenes.`,
          },
          {
            id: 212,
            title: "JSX Syntax",
            type: "reading",
            content: `JSX stands for JavaScript XML. It lets you write HTML-like syntax inside JavaScript.

Example:
const element = <h1>Hello, world!</h1>;

JSX is not valid JavaScript — it gets compiled by Babel into:
React.createElement('h1', null, 'Hello, world!')

Key rules:
- Every JSX element must be closed
- Use className instead of class
- Use camelCase for attributes
- Wrap multiple elements in a single parent`,
          },
          {
            id: 213,
            title: "Quiz: React Basics",
            type: "quiz",
            content: "Test your React fundamentals.",
            quiz: {
              question: "What does JSX compile down to?",
              options: [
                "HTML strings",
                "React.createElement() calls",
                "JSON objects",
                "CSS classes",
              ],
              correct: 1,
            },
          },
        ],
      },
      {
        id: 22,
        title: "Components & Props",
        lessons: [
          {
            id: 221,
            title: "Functional components",
            type: "reading",
            content: `A functional component is just a JavaScript function that returns JSX.

Example:
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

Rules of components:
- Name must start with a capital letter
- Must return a single root element
- Should be pure — same input always gives same output
- Keep them small and focused on one thing`,
          },
          {
            id: 222,
            title: "Passing props",
            type: "reading",
            content: `Props are how you pass data from a parent component to a child component.

Example:
<UserCard name="Alice" age={25} />

Inside UserCard:
function UserCard({ name, age }) {
  return <p>{name} is {age} years old</p>;
}

Key points:
- Props are read-only — never modify them
- Any JS value can be a prop (string, number, array, function)
- Use destructuring for cleaner code`,
          },
          {
            id: 223,
            title: "Quiz: Components",
            type: "quiz",
            content: "Test your knowledge of React components.",
            quiz: {
              question: "What is the correct way to pass a number as a prop in JSX?",
              options: [
                '<Card count="5" />',
                "<Card count={5} />",
                "<Card count=5 />",
                "<Card count=(5) />",
              ],
              correct: 1,
            },
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Node.js Basics",
    description: "Understand server-side JavaScript with Node.js.",
    level: "Intermediate",
    chapters: [
      {
        id: 31,
        title: "Introduction to Node",
        lessons: [
          {
            id: 311,
            title: "What is Node.js?",
            type: "reading",
            content: `Node.js is a JavaScript runtime built on Chrome's V8 engine. It allows you to run JavaScript on the server side.

Before Node.js, JavaScript could only run in browsers. Node changed that in 2009 when Ryan Dahl released it.

What Node.js is great for:
- REST APIs and web servers
- Real-time applications (chat, games)
- Command line tools
- File system operations

Node.js uses an event-driven, non-blocking I/O model which makes it lightweight and efficient.`,
          },
          {
            id: 312,
            title: "Node vs Browser",
            type: "reading",
            content: `JavaScript runs in both the browser and Node.js but they have key differences:

Browser:
- Has access to the DOM
- Has window, document objects
- Sandboxed for security
- Used for UI and interactivity

Node.js:
- No DOM or window object
- Has access to the file system
- Can open network connections
- Has built-in modules like fs, path, http

Both use the same JavaScript language but the available APIs are different.`,
          },
          {
            id: 313,
            title: "Quiz: Node Intro",
            type: "quiz",
            content: "Test your Node.js knowledge.",
            quiz: {
              question: "Which JavaScript engine does Node.js use?",
              options: ["SpiderMonkey", "Chakra", "V8", "JavaScriptCore"],
              correct: 2,
            },
          },
        ],
      },
    ],
  },
];