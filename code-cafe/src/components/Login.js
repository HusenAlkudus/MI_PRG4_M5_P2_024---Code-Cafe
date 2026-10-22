import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Alert from './Alert';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setCurrentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const login = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post('/api/auth/login', {
        username,
        password,
      });

      setCurrentUser(result.data);
      navigate('/');
    } catch (error) {
      console.error(error);
      setApiError(
        error?.response?.data?.error || 'Unknown Error',
      );
    }
  };
  return (
    <div className="login-component">
      <Alert visible={!!apiError} type="error">
        <p>There was an error logging in.</p>
        <p>{apiError}</p>
        <p>Please try again.</p>
      </Alert>
      <h2>Log In</h2>

      <form onSubmit={login}>
        <div>
          <label htmlFor="username">
            Username
            <input
              type="text"
              id="username"
              value={username}
              autoComplete="username"
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label htmlFor="password">
            Password
            <input
              type="password"
              id="password"
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
        </div>

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
