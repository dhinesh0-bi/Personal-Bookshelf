import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import '../components/AuthForm.css';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
      <h2 className='auth-title'>Log In</h2>
      <p className="auth-subtitle">Welcome back! Please enter your details.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form form className="auth-form" onSubmit={handleSubmit}>
      <div className='input-group'>
        <label>Email</label>
        <input

          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        </div>
        <div className='input-group'>
          <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
        <button className='auth-button' type="submit">Log In</button>
        </form>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
    </div>
  );
}