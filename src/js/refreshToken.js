// const API_KEY = "http://localhost:3000/user/auth/refresh";

// export default async function refreshTokens() {
//   console.log("Need to Refresh Access token");

//   if (!localStorage.getItem("refresh_token")) {
//     localStorage.clear();
//     window.location.href = "http://localhost:8080/pages/login.html";
//     return;
//   }

//   const response = await fetch(API_KEY, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `${localStorage.getItem("refresh_token")}`,
//     },
//   });

//   const message = await response.json();

//   localStorage.setItem("access_token", message.accessToken);
//   localStorage.setItem("refresh_token", message.refreshToken);
// }

const { fetch: originalFetch } = window;
const ownAPI = "http://localhost:8000/";
const API = "http://localhost:3000/user/auth/refresh";

const customFetch = async (url, options) => {
  options.headers.Authorization = `Bearer ${localStorage.getItem(
    "access_token"
  )}`;

  let response = await originalFetch(url, options);
  response = await response.json();

  if (response.error === "jwt expired" || response.error === "jwt malformed") {
    console.log("Access Expired");
    const newToken = await resetToken();

    localStorage.setItem("access_token", newToken.accessToken);
    localStorage.setItem("refresh_token", newToken.refreshToken);

    options.headers.Authorization = `Bearer ${localStorage.getItem(
      "access_token"
    )}`;

    response = await originalFetch(url, options);
    response = await response.json();

    if (newToken.error === "jwt expired") {
      localStorage.clear();
      window.location.href = "/pages/login.html";
    }
  } else if (
    !localStorage.getItem("access_token") ||
    !localStorage.getItem("refresh_token")
  ) {
    window.location.href = "/pages/login.html";
  }

  return response;
};

async function resetToken() {
  console.log("regenerating tokens");

  const res = await originalFetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
    },
    body: JSON.stringify({}),
  });

  const newToken = await res.json();
  return newToken;
}

export default customFetch;
