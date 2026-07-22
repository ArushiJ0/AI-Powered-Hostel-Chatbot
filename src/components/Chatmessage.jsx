import Chatboticon from "./Chatboticon"
import { marked } from "marked";
const Chatmessage =({chat}) => {
 if(chat.hideInChat) return null;
    return(
      
      < div className= {`message ${chat.role === "model" ? 'bot' : 'user'}-message`} >
    {chat.role === "model" && <Chatboticon/>}
  
    <p
  className="message-text"
  dangerouslySetInnerHTML={{
    __html: marked.parse(chat.text)
  }}
></p>
   </div>
      
    );
};
export default Chatmessage;