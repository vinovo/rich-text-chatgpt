import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './App.css';
import { TINYMCE_API_KEY } from './config';
import { streamToOpenAI } from './api/openaiClient';

function App() {
  const [inputContent, setInputContent] = useState('');
  const [outputContent, setOutputContent] = useState('');

  const handleEditorChange = (content, editor) => {
    setInputContent(content);
  };

  const handleSend = async () => {
    setOutputContent(''); // Clear the output before new streaming
    try {
      await streamToOpenAI(inputContent, (data) => {
        setOutputContent((prevContent) => prevContent + data);
      });
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
                'paste', // Add the paste plugin
                'powerpaste', // Add the PowerPaste plugin
                'code', // Add the code plugin
                'table', // Add the table plugin
                'image', // Add the image plugin
                'media', // Add the media plugin
                'emoticons', // Add the emoticons plugin
              ],
              toolbar: 
                'undo redo | formatselect | fontselect fontsizeselect | ' +
                'bold italic underline strikethrough | forecolor backcolor | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | removeformat | ' +
                'link image media | code | table | emoticons',
              paste_as_text: false, // Ensure styles are retained
              paste_data_images: true, // Allow pasting images
              powerpaste_allow_local_images: true, // Enable local image handling
              powerpaste_word_import: 'clean', // Options: 'clean', 'merge'
              powerpaste_html_import: 'clean', // Options: 'clean', 'merge'
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
