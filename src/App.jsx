import { useState } from "react";
import "./App.css";

function tokenize(input) {
  return input
    .replace(/\s+/g, "")
    .replace(/[a-zA-Z0-9]+/g, "id")
    .match(/id|\+|\*|\(|\)/g) || [];
}

function node(label, children = []) {
  return { label, children };
}

function parseAll(tokens, start = 0, end = tokens.length) {
  let results = [];

  if (end - start === 1 && tokens[start] === "id") {
    results.push(node("E", [node("id")]));
  }

  if (tokens[start] === "(" && tokens[end - 1] === ")") {
    let inside = parseAll(tokens, start + 1, end - 1);
    inside.forEach((tree) => {
      results.push(node("E", [node("("), tree, node(")")]));
    });
  }

  for (let i = start + 1; i < end - 1; i++) {
    if (tokens[i] === "+" || tokens[i] === "*") {
      let leftTrees = parseAll(tokens, start, i);
      let rightTrees = parseAll(tokens, i + 1, end);

      leftTrees.forEach((left) => {
        rightTrees.forEach((right) => {
          results.push(node("E", [left, node(tokens[i]), right]));
        });
      });
    }
  }

  return results;
}

function generateExamples(input) {
  const clean = input.replace(/\s+/g, "");

  if (!clean) {
    return ["id+id*id", "id*id+id", "id+id+id", "(id+id)*id"];
  }

  const basic = tokenize(clean).join("");

  return [
    basic,
    basic.includes("+") ? basic.replace("+", "*") : "id+id*id",
    basic.includes("*") ? basic.replace("*", "+") : "id*id+id",
    `(${basic})`,
  ];
}

function Tree({ tree }) {
  return (
    <div className="tree-node">
      <div className={tree.label === "E" ? "node nonterminal" : "node terminal"}>
        {tree.label}
      </div>

      {tree.children.length > 0 && (
        <div className="children">
          {tree.children.map((child, index) => (
            <Tree key={index} tree={child} />
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [input, setInput] = useState("id+id*id");
  const [grammar, setGrammar] = useState("E → E + E | E * E | (E) | id");

  const tokens = tokenize(input);
  const trees = parseAll(tokens);
  const examples = generateExamples(input);

  return (
    <div className="app">
      <div className="main-card">
        <div className="top-bar">
          <div className="logo">CFG</div>
        </div>

        <div className="badge">🎓 Theory of Automata & Formal Language</div>

        <h1 className="typing-title">Ambiguous Grammar Visualizer</h1>

        <p className="subtitle">
          Enter a mathematical expression and see how one string can generate multiple parse trees.
        </p>

        <div className="grammar-box">
          <b>Grammar Used:</b>
          <input
            className="grammar-input"
            value={grammar}
            onChange={(e) => setGrammar(e.target.value)}
          />
        </div>

        <p className="note">
          Note: This tool parses expressions using operators <b>+</b>, <b>*</b>, parentheses, and <b>id</b>.
        </p>

        <div className="input-row">
          <div className="input-icon">✎</div>

          <input
            className="expression-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter expression like id+id*id"
          />

          <button className="clear-btn" onClick={() => setInput("")}>
            🗑 Clear
          </button>
        </div>

        <div className="examples">
          <b>Examples:</b>
          {examples.map((ex, index) => (
            <button key={index} onClick={() => setInput(ex)}>
              {ex}
            </button>
          ))}
        </div>

        <div className="info-row">
          <div className="tokens-box">
            <b>▦ Tokens:</b>
            {tokens.map((t, i) => (
              <span key={i} className="token-chip">
                {t}
              </span>
            ))}
          </div>

          <div
            className={
              trees.length > 1
                ? "status-box error"
                : trees.length === 1
                ? "status-box success"
                : "status-box invalid"
            }
          >
            ⚙️{" "}
            {trees.length > 1
              ? `Ambiguous Grammar: ${trees.length} parse trees found 🎉`
              : trees.length === 1
              ? "Unambiguous: Only one parse tree found ✅"
              : "Invalid expression ❌"}
          </div>
        </div>

        <div className="legend">
          <span>
            <span className="legend-blue"></span> Non-Terminal: E
          </span>
          <span>
            <span className="legend-yellow"></span> Terminal: id, +, *
          </span>
        </div>

        <div className="tree-container">
          {trees.map((tree, index) => (
            <div className="tree-card" key={index}>
              <h2>Parse Tree {index + 1}</h2>
              <Tree tree={tree} />
            </div>
          ))}
        </div>

        <div className="why-box">
          <b>ℹ️ Why ambiguous?</b>
          <span>
            A grammar is ambiguous if a string has more than one parse tree.
          </span>
          <span className="sparkle">✨</span>
        </div>
      </div>
    </div>
  );
}

export default App;