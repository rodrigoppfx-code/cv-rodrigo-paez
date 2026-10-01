"use strict";
(() => {
  const dialog = document.getElementById("image-dialog");
  const image = document.getElementById("expanded-image");
  const title = document.getElementById("image-title");
  const closeButton = dialog.querySelector(".close-button");
  let trigger = null;
  function close() { if (dialog.open) dialog.close(); }
  document.querySelectorAll("[data-image]").forEach(button => {
    button.addEventListener("click", () => {
      const source = button.dataset.image;
      if (!/^brand\/proyectos\/[a-z-]+\.svg$/.test(source)) return;
      trigger = button;
      image.src = source;
      image.alt = button.querySelector("img").alt;
      title.textContent = button.dataset.title;
      dialog.showModal();
      document.body.classList.add("modal-open");
      closeButton.focus();
    });
  });
  closeButton.addEventListener("click", close);
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom) close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    image.removeAttribute("src");
    if (trigger) trigger.focus();
  });
})();
