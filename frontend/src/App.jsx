import React, { useState } from "react";
import { evaluatePrompt } from "./api";
import "./App.css";


function App() {

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);


  const testAPI = async () => {

    setLoading(true);

    try {

      const response = await evaluatePrompt({

        prompt_id: 1,

        prompt_text:
          "Explain Retrieval Augmented Generation in Large Language Models",

        model_id:
          "gemini-3"

      });


      setResult(response);

    }

    catch(error){

      console.error(
        "API Error:",
        error
      );

    }

    finally{

      setLoading(false);

    }

  };


  return (

    <div className="container">


      <h1>
        PromptOps Evaluation Dashboard
      </h1>


      <p>
        AI Prompt Evaluation and LLM Monitoring Platform
      </p>



      <button
        onClick={testAPI}
      >

        {
          loading
          ?
          "Evaluating..."
          :
          "Test Backend API"
        }

      </button>



      {
        result &&

        <div className="result-box">


          <h2>
            Evaluation Result
          </h2>


          <p>
            <b>Prompt ID:</b>
            {" "}
            {result.prompt_id}
          </p>


          <p>
            <b>Model:</b>
            {" "}
            {result.model_id}
          </p>


          <p>
            <b>Input Tokens:</b>
            {" "}
            {result.input_tokens}
          </p>


          <p>
            <b>Output Tokens:</b>
            {" "}
            {result.output_tokens}
          </p>


          <p>
            <b>Total Tokens:</b>
            {" "}
            {result.total_tokens}
          </p>


          <p>
            <b>Latency:</b>
            {" "}
            {result.latency_ms} ms
          </p>


          <h3>
            Output
          </h3>


          <div className="output">

            {result.output_text}

          </div>


        </div>

      }


    </div>

  );

}


export default App;