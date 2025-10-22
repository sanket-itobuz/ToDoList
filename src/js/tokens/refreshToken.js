const { fetch: originalFetch } = window;
const ownAPI = "http://localhost:8000/";
const API = "http://localhost:3000/user/auth/refresh";

const customFetch = async (url, options) => {
  options.headers.Authorization = `Bearer ${localStorage.getItem(
    "access_token"
  )}`;

  let response = await originalFetch(url, options);
  let data = await response.json();

  if (response.status === 401) {
    console.log("Access Token Expired");
    const newToken = await resetToken();

    localStorage.setItem("access_token", newToken.accessToken);
    localStorage.setItem("refresh_token", newToken.refreshToken);

    options.headers.Authorization = `Bearer ${localStorage.getItem(
      "access_token"
    )}`;

    response = await originalFetch(url, options);
    data = await response.json();

    if (newToken.status === 401) {
      localStorage.clear();
      window.location.href = "/pages/login.html";
    }
  } else if (
    !localStorage.getItem("access_token") ||
    !localStorage.getItem("refresh_token")
  ) {
    window.location.href = "/pages/login.html";
  }

  return data;
};

async function resetToken() {
  console.log("Refreshing tokens");

  try {
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
  } catch (err) {
    console.log(err);
  }
}

export default customFetch;
