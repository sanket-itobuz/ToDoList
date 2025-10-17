class Templates {
  successToast = (msg) => {
    return `<div class="toast text-bg-success d-flex justify-content-center align-items-center p-2 gap-2" id="toastMsg">
                <i class="fa fa-check-circle"></i>
                <p class="m-0">${msg}</p>
            </div>`;
  };

  errorToast = (msg) => {
    return `<div class="toast text-bg-danger d-flex justify-content-center align-items-center p-2 gap-2" id="toastMsg">
                <i class="fa fa-times-circle"></i>
                <p class="m-0">${msg}</p>
            </div>`;
  };
}

export default Templates;
