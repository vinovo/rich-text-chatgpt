import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './App.css';
import OpenAI from 'openai';
import { OPENAI_ORGANIZATION, OPENAI_API_KEY, OPENAI_PROJECT, TINYMCE_API_KEY } from './config';

console.log('apikey', OPENAI_API_KEY)

// Initialize OpenAI client using environment variables
const openai = new OpenAI({
  organization: OPENAI_ORGANIZATION,
  apiKey: OPENAI_API_KEY,
  project: OPENAI_PROJECT,
  dangerouslyAllowBrowser: true
});

function App() {
  const [inputContent, setInputContent] = useState('');
  const [outputContent, setOutputContent] = useState('');

  const handleEditorChange = (content, editor) => {
    setInputContent(content);
  };

  const handleSend = async () => {
    try {
      console.log('Sending request with input content:', inputContent);
      const response = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: inputContent }
        ],
        model: "gpt-4o-mini",
      });

      console.log('Response received:', response);
      const text = response.choices[0].message.content;
      setOutputContent(text);
      console.log('Output content set:', text);
    } catch (error) {
      console.error('Error sending the request', error);
    }
  };

  return (
    <div className="App">
      <h1>RichTextGPT</h1>
      <div className="editor-container">
        <div className="editor-wrapper">
          <Editor
            apiKey={TINYMCE_API_KEY}
            init={{
              height: '100%',
              menubar: false,
              placeholder: 'Start typing...',
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
                'paste' // Add the paste plugin
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help',
              paste_as_text: false, // Ensure styles are retained
              paste_data_images: true // Allow pasting images
            }}
            onEditorChange={handleEditorChange}
          />
        </div>
        <div className="editor-wrapper readonly-editor">
          <Editor
            apiKey={TINYMCE_API_KEY}
            value={outputContent}
            init={{
              height: '100%',
              menubar: false,
              toolbar: false,
              readonly: true,
            }}
          />
        </div>
      </div>
      <button onClick={handleSend}>Send to ChatGPT</button>
    </div>
  );
}

export default App;
