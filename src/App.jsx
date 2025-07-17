import { RouterProvider } from 'react-router-dom';
import { router } from './routers/router';
import { useEffect, useState } from 'react';
import UserContext from './contexts/UserContext';
import { GetAuthenByUserId } from './services/authentication';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const payload = JSON.parse(atob(savedUser.token.split('.')[1]));
      console.log("payload:", payload)
      const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const userResponse = await GetAuthenByUserId(userId)
      console.log("userResponse:", userResponse)
      setUser(userResponse.data);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router} />
    </UserContext.Provider>

  );
}

export default App;
