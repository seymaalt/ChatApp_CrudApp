import  { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import  './Chat.css';
const socket = io('http://localhost:3000');

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('message', message => {
      setMessages([...messages, message]);
      console.log("bağlanamadı");
    });
    return () => {
      socket.off('message');
    };
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      socket.emit('message', inputMessage);
      setInputMessage('');
    }
  }

  return (
    <div className="App">
      <div className="messages-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage} className='btn'>Send</button>
      </div>
    </div>
  );
}

export default App;
