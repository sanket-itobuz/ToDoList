import Templates from "../../templates/templates.js";

const toast = new Templates();

export default function showToast(response, url = "") {
  if (response.success) {
    toastSection.innerHTML = toast.successToast(response.message);
  } else {
    toastSection.innerHTML = toast.errorToast(response.error);
  }

  setTimeout(() => {
    toastSection.innerHTML = "";
    if (response.success && url) {
      window.location.href = url;
    }
  }, 3000);
}
