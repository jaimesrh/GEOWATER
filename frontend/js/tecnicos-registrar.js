const API   = 'http://localhost:3000/api/tecnicos';
const token = sessionStorage.getItem('token');

// Verificar sesión
if (!token) window.location.href = 'login.html';

function crearTecnico() {
  const nombre          = document.getElementById('inputNombre').value.trim();
  const especialidad    = document.getElementById('inputEspecialidad').value.trim();
  const disponibilidad  = document.getElementById('inputDisponibilidad').value;
  const btn             = document.getElementById('btnGuardar');

  if (!nombre || !especialidad) {
    mostrarAlerta('Nombre y especialidad son requeridos.', 'warning');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Guardando...';

  fetch(`${API}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ nombre, especialidad, disponibilidad })
  })
    .then(res => {
      if (res.status === 401) { sessionStorage.clear(); window.location.href = 'login.html'; return null; }
      return res.json();
    })
    .then(data => {
      if (!data) return;
      if (data.error || data.mensaje === 'Nombre y especialidad requeridos') {
        mostrarAlerta(data.error || data.mensaje, 'danger');
        return;
      }
      mostrarAlerta('Técnico registrado correctamente.', 'success');
      setTimeout(() => { window.location.href = 'tecnicos.html'; }, 1500);
    })
    .catch(() => mostrarAlerta('Error al conectar con el servidor.', 'danger'))
    .finally(() => {
      btn.disabled = false;
      btn.textContent = 'Registrar Técnico';
    });
}

function mostrarAlerta(mensaje, tipo) {
  document.getElementById('alerta').innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}
