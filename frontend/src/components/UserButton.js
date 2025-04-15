import React from 'react';
import './UserButton.css';

const generateRoomName = (user1, user2) => {
  return [user1, user2].sort().join('-');
};


function UserButton({ username, currentUsername, onStartDM }) {
  const handleClick = () => {
    if (onStartDM) {
      onStartDM(username);
    }    
  };

  return (
    <button 
      className="UserButton" 
      onClick={handleClick}
      style={{ padding: '5px 10px', margin: '2px', cursor: 'pointer' }}
    >
      {username}
    </button>
  );
}

export default UserButton;
