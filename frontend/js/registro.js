const API = 'http://localhost:3000/api/auth';

function registro() {
  const nombre   = document.getElementById('inputNombre').value.trim();
  const email    = document.getElementById('inputEmail').value.trim();
  const password = document.getElementById('inputPassword').value.trim();
  const btn      = document.getElementById('btnRegistro');

  if (!nombre || !email || !password) {
    mostrarAlerta('Todos los campos son requeridos.', 'warning');
    return;
  }
  if (password.length < 6) {
    mostrarAlerta('La contraseña debe tener al menos 6 caracteres.', 'warning');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Registrando...';

  fetch(`${API}/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error || (data.mensaje && data.mensaje !== 'Usuario registrado correctamente')) {
        mostrarAlerta(data.error || data.mensaje, 'danger');
        return;
      }
      mostrarAlerta('Cuenta creada correctamente. Redirigiendo...', 'success');
      setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    })
    .catch(() => mostrarAlerta('Error al conectar con el servidor.', 'danger'))
    .finally(() => {
      btn.disabled = false;
      btn.textContent = 'Crear cuenta';
    });
}

function mostrarAlerta(mensaje, tipo) {
  document.getElementById('alerta').innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}