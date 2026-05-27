const API    = 'http://localhost:3000/api/tecnicos';
const token  = sessionStorage.getItem('token');
const nombre = sessionStorage.getItem('nombre');

// Verificar sesión
if (!token) window.location.href = 'login.html';

document.getElementById('nombreUsuario').textContent = nombre || '';

let todos = [];

function cargarTecnicos() {
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
    .catch(() => mostrarAlerta('Error al cargar los técnicos.', 'danger'));
}

function renderizar(lista) {
  const tbody = document.getElementById('tablaTecnicos');
  tbody.innerHTML = '';

  if (lista.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No hay técnicos registrados.</td></tr>';
    document.getElementById('contador').textContent = 'Mostrando 0 técnicos';
    return;
  }

  lista.forEach(t => {
    const badge = t.disponibilidad === 'Disponible' ? 'success' : 'secondary';
    tbody.innerHTML += `
      <tr>
        <td>${t.id}</td>
        <td>${t.nombre}</td>
        <td>${t.especialidad}</td>
        <td><span class="badge bg-${badge}">${t.disponibilidad}</span></td>
        <td class="text-center">
          <a href="tecnicos-editar.html?id=${t.id}" class="btn btn-warning btn-sm me-1">Editar</a>
          <button onclick="eliminar(${t.id})" class="btn btn-danger btn-sm">Eliminar</button>
        </td>
      </tr>`;
  });

  document.getElementById('contador').textContent = `Mostrando ${lista.length} técnico(s)`;
}

function filtrar() {
  const q = document.getElementById('buscador').value.toLowerCase();
  const filtrados = todos.filter(t =>
    t.nombre.toLowerCase().includes(q) ||
    t.especialidad.toLowerCase().includes(q) ||
    t.disponibilidad.toLowerCase().includes(q)
  );
  renderizar(filtrados);
}

function eliminar(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este técnico?')) return;

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
      mostrarAlerta('Técnico eliminado correctamente.', 'success');
      cargarTecnicos();
    })
    .catch(() => mostrarAlerta('Error al eliminar el técnico.', 'danger'));
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

cargarTecnicos();
