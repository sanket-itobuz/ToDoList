const API_KEY = "http://localhost:3000/user/auth/refresh";

export default async function refreshTokens() {
  console.log("Need to Refresh Access token");

  if (!localStorage.getItem("refresh_token")) {
    localStorage.clear();
    window.location.href = "http://localhost:8080/pages/login.html";
    return;
  }

  const response = await fetch(API_KEY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("refresh_token")}`,
    },
  });

  const message = await response.json();

  localStorage.setItem("access_token", message.accessToken);
  localStorage.setItem("refresh_token", message.refreshToken);
}
