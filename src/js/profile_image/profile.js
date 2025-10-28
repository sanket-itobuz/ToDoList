import ProfileEvent from "./ProfileEvent";

const editProfile = document.getElementById("editImage");

const profile = new ProfileEvent();

editProfile.addEventListener("submit", profile.updateImage);
