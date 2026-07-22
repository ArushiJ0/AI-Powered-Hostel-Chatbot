import {useRef} from 'react';
const Chatform =({chatHistory, setChatHistory , generateBotResponse}) => {
    const inputRef = useRef();
    
  const isGreeting = (msg) => {
  return /\b(hi|hello|hey|hii)\b/i.test(msg.toLowerCase());
};
    const handleFormSubmit = async (e) =>{
         e.preventDefault();
         const userMessage = inputRef.current.value.trim();
         if(!userMessage) return;

        inputRef.current.value ="";
        setChatHistory((history) => [...history,{role: "user" , text: userMessage}]);
        if (isGreeting(userMessage)) {
  setChatHistory((history) => [...history,{role: "model",text: "Hello! 👋 What information can I provide you ? "}]);
  return;
}
  

     setTimeout(() =>{ setChatHistory((history) =>[...history,{role: "model" , text:"Thinking..."}]);
     },600);

generateBotResponse([
  ...chatHistory,
  {
    role: "user",
    text: `Answer this question about SRM hostel:\n${userMessage}`
  }
]);
    };

    return(
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input  ref ={inputRef} type="text" placeholder="Message...." className="message-input" required/>
   <button className="material-symbols-rounded">
arrow_upward
</button>
    </form>
    );
};
export default Chatform;