import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { JS_HOST, JS_PASSWORD } from "../constants";
import { JS_USERNAME } from "../constants";


let js_username = "";
let js_host = "";
let js_token = "";

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
        if(window.top !== window.self) {
            try {
                if (window.location?.href) {
                    const url = new URLSearchParams(window.location.href);
                    setHost(url.get('tsHost'));
                    js_host = url.get('tsHost');
                }
    
                // TODO : get auth token from url params proper format
                let authTokenData;
                const fetchUserToken = async () => {
    
                    authTokenData = await fetch(`${js_host}/callosum/v1/v2/auth/token/fetch`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'GET',
                        credentials: 'include',
                    });
    
                    const data = await authTokenData.json();
                    setToken(data.data.token);
                    js_token = data.data.token;
                }
                fetchUserToken();
    
            } catch (error) {
                console.error("Could not get the token:", error);
            }
        } else {
            js_host = JS_HOST;
            setHost(js_host);
            let authTokenData;
            const fetchUserToken = async () => {
    
                authTokenData = await fetch(`${js_host}/api/rest/2.0/auth/token/full`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        username: JS_USERNAME,
                        password: JS_PASSWORD,
                        validity_in_seconds: 99999
                    })
                });

                const data = await authTokenData.json();
                setToken(data.token);
                js_token = data.token;
            }
            fetchUserToken(); 
            js_username = JS_USERNAME;
            setUsername(JS_USERNAME);
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
                        js_username = userData.name;
                    }
                } catch (error) {
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