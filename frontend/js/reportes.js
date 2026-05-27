const API   = 'http://localhost:3000/api/reportes';
const token = sessionStorage.getItem('token');
const nombre = sessionStorage.getItem('nombre');

// Verificar sesión
if (!token) window.location.href = 'login.html';

document.getElementById('nombreUsuario').textContent = nombre || '';

let todos = [];

// Cargar todos los reportes
function cargarReportes() {
  fetch(API, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => {
      if (res.status === 401) { sessionStorage.clear(); window.location.href = 'login.html'; return null; }
      return res.json();
    })
    .then(data => {
      if (!data) return;
      todos = data;
      renderizar(todos);
    })
    .catch(() => mostrarAlerta('Error al cargar los reportes.', 'danger'));
}

function renderizar(lista) {
  const tbody = document.getElementById('tablaReportes');
  tbody.innerHTML = '';

  if (lista.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No hay reportes registrados.</td></tr>';
    document.getElementById('contador').textContent = 'Mostrando 0 reportes';
    return;
  }

  const badgeGravedad = { Baja: 'success', Media: 'warning', Alta: 'danger' };
  const badgeEstado   = { pendiente: 'secondary', proceso: 'primary', reparada: 'success' };

  lista.forEach(r => {
    const fecha = new Date(r.fecha_creacion).toLocaleDateString('es-MX');
    tbody.innerHTML += `
      <tr>
        <td>${r.id}</td>
        <td>${r.descripcion}</td>
        <td><span class="badge bg-${badgeGravedad[r.gravedad] || 'secondary'}">${r.gravedad}</span></td>
        <td><span class="badge bg-${badgeEstado[r.estado] || 'secondary'}">${r.estado}</span></td>
        <td>${fecha}</td>
        <td class="text-center">
          <a href="reportes-editar.html?id=${r.id}" class="btn btn-warning btn-sm me-1">Editar</a>
          <button onclick="eliminar(${r.id})" class="btn btn-danger btn-sm">Eliminar</button>
        </td>
      </tr>`;
  });

  document.getElementById('contador').textContent = `Mostrando ${lista.length} reporte(s)`;
}

function filtrar() {
  const q = document.getElementById('buscador').value.toLowerCase();
  const filtrados = todos.filter(r =>
    r.descripcion.toLowerCase().includes(q) ||
    r.gravedad.toLowerCase().includes(q) ||
    r.estado.toLowerCase().includes(q)
  );
  renderizar(filtrados);
}

function eliminar(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este reporte?')) return;

  fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => {
      if (res.status === 401) { sessionStorage.clear(); window.location.href = 'login.html'; return null; }
      return res.json();
    })
    .then(data => {
      if (!data) return;
      mostrarAlerta('Reporte eliminado correctamente.', 'success');
      cargarReportes();
    })
    .catch(() => mostrarAlerta('Error al eliminar el reporte.', 'danger'));
}

function cerrarSesion() {
  if (!confirm('¿Cerrar sesión?')) return;
  sessionStorage.clear();
  window.location.href = 'login.html';
}

function mostrarAlerta(mensaje, tipo) {
  document.getElementById('alerta').innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

cargarReportes();