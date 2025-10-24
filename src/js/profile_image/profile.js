import showToast from "../toasts/toastOperation";
import customFetch from "../tokens/refreshToken";

window.fetch = customFetch;

const API_KEY = "http://localhost:3000/user/auth/profile";

const editProfile = document.getElementById("editImage");
const fileInput = document.getElementById("fileInput");

editProfile.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  const fileInput = formData.get("file");
  console.log(fileInput);

  const response = await fetch(API_KEY, {
    method: "POST",
    headers: {},
    body: formData,
  });

  showToast(response.message);
});
