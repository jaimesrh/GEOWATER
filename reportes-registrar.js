const API   = 'http://localhost:3000/api/reportes';
const token = sessionStorage.getItem('token');

// Verificar sesión
if (!token) window.location.href = 'login.html';

function crearReporte() {
  const latitud     = document.getElementById('inputLatitud').value.trim();
  const longitud    = document.getElementById('inputLongitud').value.trim();
  const gravedad    = document.getElementById('inputGravedad').value;
  const descripcion = document.getElementById('inputDescripcion').value.trim();
  const btn         = document.getElementById('btnGuardar');

  if (!latitud || !longitud || !gravedad || !descripcion) {
    mostrarAlerta('Todos los campos son requeridos.', 'warning');
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
    body: JSON.stringify({ latitud, longitud, gravedad, descripcion })
  })
    .then(res => {
      if (res.status === 401) { sessionStorage.clear(); window.location.href = 'login.html'; return null; }
      return res.json();
    })
    .then(data => {
      if (!data) return;
      if (data.error || data.mensaje === 'Faltan datos obligatorios para crear el reporte') {
        mostrarAlerta(data.error || data.mensaje, 'danger');
        return;
      }
      mostrarAlerta('Reporte registrado correctamente.', 'success');
      setTimeout(() => { window.location.href = 'reportes.html'; }, 1500);
    })
    .catch(() => mostrarAlerta('Error al conectar con el servidor.', 'danger'))
    .finally(() => {
      btn.disabled = false;
      btn.textContent = 'Registrar Reporte';
    });
}

function mostrarAlerta(mensaje, tipo) {
  document.getElementById('alerta').innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}
