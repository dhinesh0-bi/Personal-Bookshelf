import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Sidebar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="logo">Book Shelf</div>
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/library">My Library</NavLink>
        <NavLink to="/favorites">Favorites</NavLink>
      </nav>
      <div className="user-profile">
        {currentUser && <p title={currentUser.email}>{currentUser.email}</p>}
        <button id="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}