import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext({
    host:'',
    username: '',
    token: '',
    setHost: (host: string) => {},
    setUsername: (username: string) => {},
    setToken: (token: string) => {},
  });
  
  export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [host, setHost] = useState('');
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
  

    useEffect(() => {
        try {
            if (window.top?.location?.href) {
                const url = new URL(window.top.location.href);
                setHost(url.origin);
            }
        } catch (error) {
            console.error("Could not access window.top.location:", error);
        }
    }, []);

    useEffect(() => {
        if (token && host) {
            const fetchCurrentUser = async () => {
                try {
                    const response = await fetch(`${host}/api/rest/2.0/auth/session/user`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (response.ok) {
                        const userData = await response.json();
                        setUsername(userData.name);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            
            fetchCurrentUser();
        }
    }, [token, host]);


    return (
      <AppContext.Provider value={{ host, username, token, setHost, setUsername, setToken }}>
        {children}
      </AppContext.Provider>
    );
  };
  
  export const useAppContext = () => {
    return useContext(AppContext);
  };

  //  auth token -> getCurrentUSEr api -> set username -> host window.top.location.href