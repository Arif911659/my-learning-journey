// file: fe/src/index.js

// Importing the React library, which is necessary for writing React components.
import React from 'react';

// Importing the ReactDOM library, which is used for rendering React components into the DOM.
import { createRoot } from 'react-dom/client';

// Importing the 'App' component from the './app' file, assuming it's a relative path.
import App from './App';

// Rendering the 'App' component into the DOM. The component is enclosed in JSX syntax,
// a syntax extension for JavaScript recommended by React.
// The 'ReactDOM.render()' method takes two arguments:
//   1. The React component to render (in this case, the 'App' component).
//   2. The target DOM element where the component should be rendered.
//ReactDOM.render(<App />, document.getElementById('root'));

console.log('Index.js is being executed');

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <h2>Hello From Frontend!!!</h2>
    <App />
  </React.StrictMode>
);