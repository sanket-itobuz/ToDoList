import Templates from "../../templates/templates.js";

const toast = new Templates();

export default function showToast(response) {
  if (response.success) {
    toastSection.innerHTML = toast.successToast(response.message);
  } else {
    toastSection.innerHTML = toast.errorToast(response.error);
  }

  setTimeout(() => {
    toastSection.innerHTML = "";
  }, 3000);
}
