const API   = 'http://localhost:3000/api/reportes';
const token = sessionStorage.getItem('token');

// Verificar sesión
if (!token) window.location.href = 'login.html';

// Leer el id de la URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// Si no hay id válido, mostrar error
if (!id || isNaN(id)) {
  document.getElementById('spinnerCarga').classList.add('d-none');
  document.getElementById('errorId').classList.remove('d-none');
} else {
  cargarReporte();
}

function cargarReporte() {
  fetch(`${API}/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => {
      if (res.status === 401) { sessionStorage.clear(); window.location.href = 'login.html'; return null; }
      if (res.status === 404) {
        document.getElementById('spinnerCarga').classList.add('d-none');
        document.getElementById('errorId').classList.remove('d-none');
        return null;
      }
      return res.json();
    })
    .then(data => {
      if (!data) return;

      // Ocultar spinner y mostrar formulario
      document.getElementById('spinnerCarga').classList.add('d-none');
      document.getElementById('formulario').classList.remove('d-none');

      // Llenar los campos con los datos del reporte
      document.getElementById('mostrarId').value      = data.id;
      document.getElementById('inputDescripcion').value = data.descripcion;
      document.getElementById('inputGravedad').value  = data.gravedad;
      document.getElementById('inputEstado').value    = data.estado;
    })
    .catch(() => {
      document.getElementById('spinnerCarga').classList.add('d-none');
      mostrarAlerta('Error al cargar los datos del reporte.', 'danger');
    });
}

function actualizar() {
  const estado      = document.getElementById('inputEstado').value;
  const descripcion = document.getElementById('inputDescripcion').value.trim();
  const gravedad    = document.getElementById('inputGravedad').value;
  const btn         = document.getElementById('btnActualizar');

  if (!estado) {
    mostrarAlerta('El estado es requerido.', 'warning');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Actualizando...';

  fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ estado, descripcion, gravedad })
  })
    .then(res => {
      if (res.status === 401) { sessionStorage.clear(); window.location.href = 'login.html'; return null; }
      return res.json();
    })
    .then(data => {
      if (!data) return;
      if (data.error) {
        mostrarAlerta(data.error, 'danger');
        return;
      }
      mostrarAlerta('Reporte actualizado correctamente.', 'success');
      setTimeout(() => { window.location.href = 'reportes.html'; }, 1500);
    })
    .catch(() => mostrarAlerta('Error al conectar con el servidor.', 'danger'))
    .finally(() => {
      btn.disabled = false;
      btn.textContent = 'Actualizar Reporte';
    });
}

function mostrarAlerta(mensaje, tipo) {
  document.getElementById('alerta').innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}
