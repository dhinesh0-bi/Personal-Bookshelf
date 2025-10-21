import  { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
      <h2 className='auth-title'>Sign Up</h2>
      {error && <p className='auth-subtitle' style={{ color: 'red' }}>{error}</p>}
      <form className='auth-form' onSubmit={handleSubmit}>
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
        <div className='auth-form'>
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
        </div>
        <button className='auth-button' type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Log In</Link></p>
    </div>
    </div>
  );
}

export default SignUp;