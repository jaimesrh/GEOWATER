const API = 'http://localhost:3000/api/auth';

function login() {
  const email    = document.getElementById('inputEmail').value.trim();
  const password = document.getElementById('inputPassword').value.trim();
  const btn      = document.getElementById('btnLogin');

  if (!email || !password) {
    mostrarAlerta('Email y contraseña son requeridos.', 'warning');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Ingresando...';

  fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.mensaje === 'Credenciales incorrectas') {
        mostrarAlerta('Credenciales incorrectas. Intenta de nuevo.', 'danger');
        return;
      }
      if (!data.token) {
        mostrarAlerta(data.mensaje || 'Error al iniciar sesión.', 'danger');
        return;
      }
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('nombre', data.nombre);
      window.location.href = 'inicio.html';
    })
    .catch(() => mostrarAlerta('Error al conectar con el servidor.', 'danger'))
    .finally(() => {
      btn.disabled = false;
      btn.textContent = 'Ingresar';
    });
}

function mostrarAlerta(mensaje, tipo) {
  document.getElementById('alerta').innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}