const API   = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');
const nombre = sessionStorage.getItem('nombre');

// 1. Verificar sesión al cargar
if (!token) {
  window.location.href = 'login.html';
}

// 2. Mostrar nombre en navbar
document.getElementById('nombreUsuario').textContent = nombre || '';

// 3. Cargar datos del inicio
function cargarInicio() {
  fetch(`${API}/inicio`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => {
      if (res.status === 401) {
        sessionStorage.clear();
        window.location.href = 'login.html';
        return null;
      }
      return res.json();
    })
    .then(data => {
      if (!data) return;

      document.getElementById('spinner').classList.add('d-none');
      document.getElementById('contenido').classList.remove('d-none');

      document.getElementById('tituloBienvenida').textContent = `Bienvenido, ${nombre}`;
      document.getElementById('fechaHora').textContent =
        new Date(data.fecha).toLocaleDateString('es-MX', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

      // Iconos y etiquetas por módulo
      const info = {
        reportes:     { icon: '📋', label: 'Reportes de Fugas',  color: 'danger' },
        tecnicos:     { icon: '🔧', label: 'Técnicos',           color: 'primary' },
        zonas:        { icon: '🗺️',  label: 'Zonas',             color: 'success' },
        estadisticas: { icon: '📊', label: 'Estadísticas',       color: 'warning' },
        usuarios:     { icon: '👤', label: 'Usuarios',           color: 'secondary' }
      };

      const contenedor = document.getElementById('tarjetasModulos');
      contenedor.innerHTML = '';

      data.módulos.forEach(modulo => {
        const m = info[modulo] || { icon: '📁', label: modulo, color: 'primary' };
        contenedor.innerHTML += `
          <div class="col-md-4 col-sm-6">
            <div class="card shadow-sm h-100 modulo-card">
              <div class="card-body d-flex align-items-center gap-3">
                <span style="font-size:2rem">${m.icon}</span>
                <div>
                  <h6 class="card-title fw-bold mb-1 text-capitalize">${m.label}</h6>
                  <a href="${modulo}.html" class="btn btn-${m.color} btn-sm">Ir al módulo</a>
                </div>
              </div>
            </div>
          </div>`;
      });

      // Tarjeta de resumen
      if (data.resumen) {
        Object.keys(data.resumen).forEach(key => {
          contenedor.innerHTML += `
            <div class="col-md-4 col-sm-6">
              <div class="card border-primary shadow-sm h-100">
                <div class="card-body text-center">
                  <h1 class="display-4 fw-bold text-primary">${data.resumen[key]}</h1>
                  <p class="text-muted text-capitalize">${key.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </div>`;
        });
      }
    })
    .catch(() => {
      document.getElementById('spinner').classList.add('d-none');
      mostrarAlerta('Error al cargar. Verifica que el servidor esté corriendo.', 'danger');
    });
}

// 4. Cerrar sesión
function cerrarSesion() {
  if (!confirm('¿Seguro que deseas cerrar sesión?')) return;
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

cargarInicio();