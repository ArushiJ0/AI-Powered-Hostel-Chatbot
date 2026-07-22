import { useEffect, useRef , useState } from "react";
import Chatboticon from "./components/Chatboticon";
import Chatform from "./components/Chatform";
import Chatmessage from "./components/Chatmessage";
import {srmInfo} from "./srmInfo";
const App =() => {
  const [chatHistory, setChatHistory] = useState([{
    hideInChat: true,
    role: "model",
    text: srmInfo,
  }]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();
  
   
  const generateBotResponse = async (history) => {
   const updateHistory= (text) =>{
    setChatHistory( prev => [...prev.filter(msg => msg.text !== "Thinking..."),{role:"model", text}]);
   }
   history = history.map(({ role, text }) => {
  if (role === "user") {
    return {
      role,
      parts: [{
        text: `
You are an AI assistant for SRM Institute of Science and Technology (SRMIST).

STRICT RULES:
- Answer ONLY SRM-related questions.
- Do NOT say phrases like:
  "Based on the information provided"
  "According to the context"
- Start immediately with the answer.

If the question is NOT related to SRM, reply EXACTLY:
"I can only answer questions related to SRM Hostel ."

User Question:
${text}
`
      }]
    };
  }
  return {
    role,
    parts: [{ text }]
  };
});
    const requestOptions ={
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({contents: history})
    }
    try{
      const response = await fetch(
  `${import.meta.env.VITE_API_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
  requestOptions
);

     const data = await response.json();
      if(!response.ok) throw new Error(data.error.message || "Somthing went wrong!!" );
     let apiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI".trim();
     const lowerText = apiResponseText.toLowerCase();

if (
  lowerText.includes("does not explicitly") ||
  lowerText.includes("not aware") ||
  lowerText.includes("don't know") ||
  lowerText.includes("no information") ||
  lowerText.includes("not available")
) {
  apiResponseText = `
I couldn’t find detailed information on that.

To know more, you can visit:
<a href="https://www.srmist.edu.in/" target="_blank">Visit SRM Official Website</a>
`;
}
     
     updateHistory(apiResponseText);
   
    } catch(error){
       console.log(error);
    }
    

  };

  useEffect(() => {
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
  },[chatHistory]);
  return (
 <div className={`container ${showChatbot ? "show-chatbot" : ""}`}> 
  <button onClick ={() => setShowChatbot(prev => !prev)} id ="chatbot-toggler">
    <span className="material-symbols-rounded"> mode_comment</span>
      <span className="material-symbols-rounded">close</span>
  </button>
    <div className="chatbot-popup">
      <div className="chat-header">
      <div className="header-info">
       <Chatboticon />
      <h2 className="logo-text"> Chatbot</h2>
</div>
<button onClick ={() => setShowChatbot(prev => !prev)} className="material-symbols-rounded">
keyboard_arrow_down
</button>
  </div>
  <div ref = {chatBodyRef}className="chat-body">
   <div className="message bot-message">
 <Chatboticon />
    <p className="message-text">
      Hey SRMite! <br/> How can I help you today ?
    </p>
   </div>
{chatHistory.map((chat, index) => (
  <Chatmessage key={index} chat ={chat}/>
 ))}
    
  </div>
  <div className="chat-footer">
    <Chatform  chatHistory={chatHistory} setChatHistory = {setChatHistory} generateBotResponse ={generateBotResponse} />
  </div>
    </div>
</div>
);
};
export default App;