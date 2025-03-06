/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import { JS_HOST, JS_PASSWORD } from "../constants";
import { JS_USERNAME } from "../constants";
import { fetchUserToken, getCurrentUser } from "../services/tsApis";
import { AI_MODEL } from "../../server/types";

export const AppContext = createContext({
  host: "",
  username: "",
  token: "",
  isLoading: false,
  code: "",
  curlCode: "",
  isEmbed: false,
  model: AI_MODEL.ONYX,
  setHost: (host: string) => {},
  setUsername: (username: string) => {},
  setToken: (token: string) => {},
  setCode: (code: string) => {},
  setCurlCode: (curlCode: string) => {},
  setModel: (model: AI_MODEL) => {},
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [host, setHost] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [curlCode, setCurlCode] = useState("");
  const isEmbed = window.top !== window.self;
  const [model, setModel] = useState(AI_MODEL.ONYX);

  useEffect(() => {
    setIsLoading(true);

    const search = new URLSearchParams(window.location.search);
    const hostFromUrl = search.get("tsHost");
    const tokenFromUrl = search.get("auth_token");

    setHost(hostFromUrl);
    setToken(tokenFromUrl);

    const disableConfigFromUrl = true;

    if (hostFromUrl && tokenFromUrl && !disableConfigFromUrl) {
      getCurrentUser({
        host: hostFromUrl,
        token: tokenFromUrl,
      })
        .then((userData) => {
          setUsername(userData.name);
          setToken(tokenFromUrl);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Could not get the token:", error);
          setIsLoading(false);
        });
    } else {
      setHost(JS_HOST);
      setUsername(JS_USERNAME);

      fetchUserToken({
        host: JS_HOST,
        username: JS_USERNAME,
        password: JS_PASSWORD,
      })
        .then((token) => {
          setToken(token);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Could not get the token:", error);
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    (window as any)._contentCache = {
      host,
      username,
      token,
      code,
      curlCode,
      isLoading,
      isEmbed,
    };
  }, [host, username, token, code, curlCode, isLoading, isEmbed]);

  useEffect( () => {
    (window as any)._code = code;
    const updateCode = async () => {
      if ((window as any)._vm) {
        console.log("code updated");
        const files = await (window as any)._vm.getFsSnapshot();
      
      (window as any)._vm.applyFsDiff({
          create: { ...files, "index.js": code },
          destroy: [],
        });
      }
    };
    updateCode();
  }, [code]);

  return (
    <AppContext.Provider
      value={{
        host,
        username,
        token,
        code,
        curlCode,
        isLoading,
        isEmbed,
        model,
        setHost,
        setUsername,
        setCode,
        setToken,
        setCurlCode,
        setModel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

//  auth token -> getCurrentUSEr api -> set username -> host window.top.location.href
