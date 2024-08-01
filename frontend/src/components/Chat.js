import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';

const Chat = () => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', message => {
        setMessages(prevMessages => [...prevMessages, message]);
      });
    }
  }, [socket]);

  const sendMessage = () => {
    socket.emit('sendMessage', message);
    setMessage('');
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
