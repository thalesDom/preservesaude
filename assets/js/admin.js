document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".upload-input").forEach((input) => {
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      const filenameEl = input.parentElement.querySelector(".upload-filename");
      const previewEl = document.getElementById(input.dataset.preview);

      if (!file) {
        if (filenameEl) filenameEl.textContent = "Nenhum arquivo selecionado";
        return;
      }

      if (filenameEl) filenameEl.textContent = file.name;

      if (previewEl) {
        previewEl.classList.remove("is-empty");
        previewEl.innerHTML = "";
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        previewEl.appendChild(img);
      }
    });
  });
});
