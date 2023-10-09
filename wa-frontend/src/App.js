import { useEffect, useState } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem('user');
    if(user){
      setLoggedIn(true);
    }
  }, [])
  if(loggedIn){
    return <Dashboard setLoggedIn={setLoggedIn} />
  }
  return (
    <Login setLoggedIn={setLoggedIn} />
  );
}

export default App;
