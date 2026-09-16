document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-print]');
  if (!button) return;
  event.preventDefault();
  event.stopImmediatePropagation();

  const link = document.createElement('a');
  link.href = 'assets/CV_Rodrigo_Paez.docx';
  link.download = 'CV_Rodrigo_Paez.docx';
  document.body.appendChild(link);
  link.click();
  link.remove();
}, true);
