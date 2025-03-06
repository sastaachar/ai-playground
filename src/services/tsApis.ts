import { JS_USERNAME } from "../constants";

export const getCurrentUser = async ({
  host,
  token
}: {
  host: string;
  token: string;
}) => {
  const response = await fetch(`${host}/api/rest/2.0/auth/session/user`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return null;
}

export const fetchUserToken = async ({
  host,
  username,
  password
}: {
  host: string;
  username: string;
  password: string;
}) => {
  const authTokenData = await fetch(`${host}/api/rest/2.0/auth/token/full`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      username: username,
      password: password,
      validity_time_in_sec: 99999,
    }),
  });

  const data = await authTokenData.json();
  return data.token;
};