import customFetch from "../fetch/customFetch.js";
import showToast from "../toasts/toastOperation.js";

window.fetch = customFetch;

const BASE_URL = "http://localhost:3000/profile/upload";

class ProfileEvent {
  updateImage = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {},
      body: formData,
    });

    showToast(response);
    window.location.reload();
  };
}

export default ProfileEvent;
