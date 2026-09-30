(() => {
  'use strict';
  const form = document.getElementById('contact-form');
  const result = document.getElementById('result');
  const button = form.querySelector('button[type="submit"]');
  let sending = false;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const fields = new FormData(form);
    if (fields.get('botcheck')) return;
    const name = String(fields.get('name') || '').trim();
    const email = String(fields.get('email') || '').trim();
    const subject = String(fields.get('subject') || '').trim();
    const message = String(fields.get('message') || '').trim();
    if (!name || !email || !subject || !message) {
      result.textContent = 'Completa todos los campos antes de enviar.';
      return;
    }
    sending = true;
    button.disabled = true;
    button.textContent = 'Enviando…';
    result.textContent = 'Enviando tu mensaje…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({
          access_key: fields.get('access_key'),
          from_name: fields.get('from_name'),
          name, email, subject, message,
          botcheck: false
        }),
        signal: controller.signal,
        credentials: 'omit',
        referrerPolicy: 'strict-origin-when-cross-origin'
      });
      const data = await response.json();
      if (response.ok && data.success === true) {
        result.textContent = 'Tu mensaje fue enviado. Gracias por contactarme.';
        window.alert('Mensaje enviado correctamente. Gracias por contactarme.');
        form.reset();
      } else {
        result.textContent = response.status === 429
          ? 'Hay demasiados intentos. Espera un momento o utiliza WhatsApp.'
          : 'El servicio no confirmó el envío. Revisa los campos e inténtalo de nuevo, o utiliza WhatsApp.';
      }
    } catch {
      result.textContent = 'No pudimos confirmar el envío. Conservamos tu mensaje; revisa tu conexión antes de intentar de nuevo, o utiliza WhatsApp.';
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      button.textContent = 'Enviar mensaje';
    }
  });
})();
