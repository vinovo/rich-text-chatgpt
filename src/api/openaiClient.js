import OpenAI from 'openai';
import { OPENAI_ORGANIZATION, OPENAI_API_KEY, OPENAI_PROJECT } from '../config';


// Initialize OpenAI client using environment variables
const openai = new OpenAI({
  organization: OPENAI_ORGANIZATION,
  apiKey: OPENAI_API_KEY,
  project: OPENAI_PROJECT,
  dangerouslyAllowBrowser: true
});

const DEFAULT_RICH_TEXT_PROMPT =  "Your output will be displayed in a tinymce textbox. Output in rich text format."

export const sendToOpenAI = async (inputContent) => {
  try {
    console.log('Sending request with input content:', inputContent);
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: DEFAULT_RICH_TEXT_PROMPT},
        { role: "user", content: inputContent }
      ],
      model: "gpt-4o-mini",
    });

    console.log('Response received:', response);
    const text = response.choices[0].message.content;
    console.log('Output content set:', text);
    return text;
  } catch (error) {
    console.error('Error sending the request', error);
    throw error;
  }
};

export const streamToOpenAI = async (inputContent, onData) => {
    try {
      console.log('Sending streaming request with input content:', inputContent);
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: DEFAULT_RICH_TEXT_PROMPT },
          { role: 'user', content: inputContent },
        ],
        stream: true,
      });
  
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        onData(content);
      }
    } catch (error) {
      console.error('Error sending the streaming request', error);
      throw error;
    }
  };
