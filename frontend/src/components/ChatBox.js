import React, { useState, useRef, useEffect } from 'react';

const ChatBox = ({ roomName, messages = [], onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() === '') return;
    onSendMessage({ room: roomName, content: newMessage });
    setNewMessage('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '80vh',
      border: '1px solid #ccc',
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      
      {/* Messages area */}
      <div style={{
        flexGrow: 1,
        overflowY: 'auto',
        padding: '10px'
      }}>
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} style={{ margin: '5px 0' }}>
              <strong>{msg.sender}:</strong> {msg.content}
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{
        display: 'flex',
        gap: '10px',
        padding: '10px',
        borderTop: '1px solid #ccc'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flexGrow: 1, padding: '8px' }}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} style={{ padding: '8px 12px' }}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
