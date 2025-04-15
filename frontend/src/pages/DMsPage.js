import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import io from 'socket.io-client';
import ChatBox from '../components/ChatBox'; // adjust the path if it's different
import { getMessagesByRoom, postMessage } from '../services/apiService'; // adjust path if needed

const socket = io('http://localhost:3001');

const DMsPage = forwardRef(({ user, dmRooms, setDmRooms }, ref) => {
  const [activeDM, setActiveDM] = useState(null);
  const [messages, setMessages] = useState({});

  useEffect(() => {

    socket.on('newMessage', (msg) => {
      console.log('📥 Received real-time message:', msg);
      const room = msg.room;
    
      setMessages(prev => {
        const updated = { ...prev };
        const currentMessages = updated[room] || [];
    
        // ✅ Check if message already exists (by content, sender, and timestamp)
        const isDuplicate = currentMessages.some(
          m => m.content === msg.content && m.sender === msg.sender && m.timestamp === msg.timestamp
        );
    
        if (!isDuplicate) {
          if (!Array.isArray(updated[room])) updated[room] = [];
          updated[room].push(msg);
        }
    
        return updated;
      });
    });
    

    return () => {
      socket.off('newMessage'); // Clean up listener if component unmounts
    };
  }, []);
  
  

  useEffect(() => {
    console.log('🟡 Loading messages for room:', activeDM);
    if (!activeDM) return;

    getMessagesByRoom(activeDM)
      .then((data) => {
        console.log('raw data chats from backend:', data);
        const safeMessages = Array.isArray(data) ? data : [];
        console.log(`the past chats for room "${activeDM}" are:`, safeMessages);
        setMessages(prev => ({ ...prev, [activeDM]: safeMessages }));
      })
    
      .catch((err) => {
        console.error("❌ Failed to fetch messages:", err);
      });   
    
    socket.emit('joinRoom', activeDM); // ✅ still needed to join the room


  }, [activeDM]);  

  useEffect(() => {
    console.log('🧠 Current messages state:', messages);
  }, [messages]);


  useImperativeHandle(ref, () => ({
    addDMRoom(roomName) {
      if (!dmRooms.includes(roomName)) {
        const updatedRooms = [...dmRooms, roomName];
        setDmRooms(updatedRooms);
        setActiveDM(roomName);
      }
      setActiveDM(roomName);
    }
  }));

  const handleOpenDM = (room) => {
    setActiveDM(room); // Already updates state
    console.log('🔁 Opening DM for room:', room);
  };
  
  const handleRemoveRoom = (roomToRemove) => {
    const updatedRooms = dmRooms.filter(room => room !== roomToRemove);
    setDmRooms(updatedRooms);
  
    // Optionally clear activeDM if it was the one removed
    if (activeDM === roomToRemove) {
      setActiveDM(null);
    }
  
    // Optionally: Save to localStorage if you plan to persist
    // localStorage.setItem(`dmRooms-${user.username}`, JSON.stringify(updatedRooms));
  };
  
  const getOtherUserFromRoom = (room, currentUser) => {
    return room
      .split('-')
      .filter(name => name !== currentUser)
      .join('');
  };  


  


  return (
    <div className="DMsPage" style={{ display: 'flex', height: '100vh' }}>
      
      {/* Sidebar for DM rooms */}
      <div
        className="dm-sidebar"
        style={{
          width: '220px',
          padding: '1rem',
          borderRight: '1px solid #ccc',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Rooms</h2>
        {dmRooms
  .filter(room => room.includes(user.username)) // ✅ Only show rooms the user is part of
  .map((room) => (

  <div
    key={getOtherUserFromRoom(room, user.username)}
    style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
  >
    <button
      onClick={() => handleOpenDM(room)}
      style={{
        flexGrow: 1,
        padding: '10px 12px',
        backgroundColor: activeDM === room ? '#6bd1e0' : '#d9f2f7',
        color: '#000',
        border: activeDM === room ? '2px solid #00acc1' : '1px solid #a1dce8',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textAlign: 'left',
        boxShadow: activeDM === room ? '0 0 5px rgba(0, 172, 193, 0.6)' : 'none'
      }}
    >
      {getOtherUserFromRoom(room, user.username)}
    </button>
    <button
      onClick={() => handleRemoveRoom(room)}
      style={{
        marginLeft: '6px',
        background: 'transparent',
        border: 'none',
        color: '#888',
        fontSize: '16px',
        cursor: 'pointer'
      }}
      title="Remove room"
    >
      ✖
    </button>
  </div>
))}

      </div>
  
      {/* Main chat area */}
      <div className="dm-chat-area" style={{ flex: 1, padding: '1rem' }}>
        <h1>Direct Messages</h1>
  
        {activeDM ? (
          <div>
            <h2 style={{ marginBottom: '1rem' }}>Chat with {activeDM}</h2>
            <ChatBox
              roomName={activeDM}
              messages={messages[activeDM] || []}
              onSendMessage={(msg) => {
                postMessage(activeDM, user.username, msg.content).catch((err) =>
                  console.error('❌ Failed to save message to DB:', err)
                );
  
                socket.emit('message', {
                  room: activeDM,
                  sender: user.username,
                  content: msg.content
                });
              }}
            />
          </div>
        ) : (
          <p>Select a chat room to start messaging.</p>
        )}
      </div>
    </div>
  );
  
});

export default DMsPage;
