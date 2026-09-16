document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-print]');
  if (!button) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const link = document.createElement('a');
  link.href = 'assets/CV_Rodrigo_Paez.pdf';
  link.download = 'CV_Rodrigo_Paez.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
}, true);

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-print]').forEach((button) => {
    if (/dossier/i.test(button.textContent)) button.textContent = 'Descargar hoja de vida';
  });
});
