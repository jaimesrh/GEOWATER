const API   = 'http://localhost:3000/api/tecnicos';
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
  cargarTecnico();
}

function cargarTecnico() {
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

      // Llenar los campos con los datos del técnico
      document.getElementById('mostrarId').value         = data.id;
      document.getElementById('inputNombre').value       = data.nombre;
      document.getElementById('inputEspecialidad').value = data.especialidad;
      document.getElementById('inputDisponibilidad').value = data.disponibilidad;
    })
    .catch(() => {
      document.getElementById('spinnerCarga').classList.add('d-none');
      mostrarAlerta('Error al cargar los datos del técnico.', 'danger');
    });
}

function actualizar() {
  const nombre         = document.getElementById('inputNombre').value.trim();
  const especialidad   = document.getElementById('inputEspecialidad').value.trim();
  const disponibilidad = document.getElementById('inputDisponibilidad').value;
  const btn            = document.getElementById('btnActualizar');

  if (!nombre || !especialidad) {
    mostrarAlerta('Nombre y especialidad son requeridos.', 'warning');
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
    body: JSON.stringify({ nombre, especialidad, disponibilidad })
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
      mostrarAlerta('Técnico actualizado correctamente.', 'success');
      setTimeout(() => { window.location.href = 'tecnicos.html'; }, 1500);
    })
    .catch(() => mostrarAlerta('Error al conectar con el servidor.', 'danger'))
    .finally(() => {
      btn.disabled = false;
      btn.textContent = 'Actualizar Técnico';
    });
}

function mostrarAlerta(mensaje, tipo) {
  document.getElementById('alerta').innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}
