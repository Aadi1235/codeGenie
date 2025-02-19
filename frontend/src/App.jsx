import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import "./App.css";
import { useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import Markdown from "react-markdown";
import rehypehighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import { Loader } from 'lucide-react';


function App() {

  const [code, setCode] = useState("");

  const [review, setReview] = useState();
  const [isLoading, setIsLoading] = useState(false);
                
  useEffect(() => {
    prism.highlightAll();
  }, []);

async function reviewCode() {
  if (!code.trim()) {
    setReview("Please enter some code to review.");
    return; 
  }
  setIsLoading(true);
  try {
    const response = await axios.post(
      "https://codegenie-v7o2.onrender.com/ai/get-review", // Use your Render backend URL
      //"http://localhost:3000/ai/get-review", // Use your local backend URL
      { code }
    );
    setReview(response.data);
  } catch (error) {
    console.error("Error reviewing code:", error);
  }
  setIsLoading(false);
}
  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
             value={code}
             onValueChange={(code) => setCode(code)}
             highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
             padding={10}
             placeholder="Please enter your code here for assistance..."
             style={{
               fontFamily: '"Fira code", "Fira Mono", monospace',
               fontSize: 16,
               border:"1px solid #ddd",
               borderRadius: "5px",
               height: "100%",
               width: "100%"
             }}            
            />
          </div>
          <button 
            onClick={reviewCode} 
            className="review"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-container">
                <Loader className="spinner" />
                Analyzing...
              </span>
            ) : (
              "Review"
            )}
          </button>
       </div>

          <div className="right">
          {isLoading ? (
            <div className="loading-review">
              <Loader className="spinner large" />
              <p>Analyzing your code...</p>
            </div>
          ) : (
            <Markdown rehypePlugins={[rehypehighlight]}>
              {review || "Your code review will appear here"}
            </Markdown>
          )}
        </div>
      </main>
    </>
  );
}


export default App;
