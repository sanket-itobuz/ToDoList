const { fetch: originalFetch } = window;
const BASE_URL = "http://localhost:3000/user/auth/refresh";

const customFetch = async (url, options, count = 0) => {
  options.headers.Authorization = `Bearer ${localStorage.getItem(
    "access_token"
  )}`;

  let response = await originalFetch(url, options);
  let data = await response.json();

  if (response.status === 401) {
    if (count == 3) {
      console.log(count);
      window.location.reload();
    }
    console.log("Access Token Expired");

    await resetToken();

    data = await customFetch(url, options, count + 1);
  }
  return data;
};

async function resetToken() {
  console.log("Refreshing tokens");

  try {
    const res = await originalFetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
      },
      body: JSON.stringify({}),
    });

    const newToken = await res.json();

    if (newToken.status === 401) {
      localStorage.clear();
      return (window.location.href = "/pages/login.html");
    }

    localStorage.setItem("access_token", newToken.accessToken);
    localStorage.setItem("refresh_token", newToken.refreshToken);

    return;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}

export default customFetch;
