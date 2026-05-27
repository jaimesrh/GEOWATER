
let baseDeDatosFugas = []; 
const API_URL = 'http://localhost:3000/api/fugas'; // URL de tu nuevo backend


let mapaReporte, mapaAdmin;
let marcadorReporte = null;
let marcadoresAdmin = [];

// Función para descargar los datos del backend
async function cargarFugas() {
    try {
        const respuesta = await fetch(API_URL);
        baseDeDatosFugas = await respuesta.json();
        actualizarVistas();
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
    }
}



const appPrincipal = document.getElementById('app-principal');
const pantallaLogin = document.getElementById('pantalla-login');
const menuCiudadano = document.querySelector('.menu-ciudadano');
const menuAdmin = document.querySelector('.menu-admin');

function iniciarSesion(rol) {
    pantallaLogin.classList.add('oculto');
    appPrincipal.classList.remove('oculto');

    document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('activa'));

    if(rol === 'ciudadano') {
        menuCiudadano.style.display = 'block';
        menuAdmin.style.display = 'none';
        document.getElementById('nombre-usuario').innerText = "Vecino";
        document.querySelector('[data-target="reportar"]').click();
        inicializarMapaCiudadano();
    } else {
        menuCiudadano.style.display = 'none';
        menuAdmin.style.display = 'block';
        document.getElementById('nombre-usuario').innerText = "Despachador OOSAPAS";
        document.querySelector('[data-target="dashboard-admin"]').click();
    }
    actualizarVistas(); 
}

function cerrarSesion() {
    appPrincipal.classList.add('oculto');
    pantallaLogin.classList.remove('oculto');
}

document.querySelectorAll('.nav-btn').forEach(boton => {
    boton.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('activa'));
        boton.classList.add('activa');

        document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));
        const target = boton.getAttribute('data-target');
        document.getElementById(target).classList.add('activa');

      
        setTimeout(() => {
            if(target === 'reportar' && mapaReporte) mapaReporte.invalidateSize();
            if(target === 'mapa-operaciones') {
                inicializarMapaAdmin(); // Dibuja los pines
                if(mapaAdmin) mapaAdmin.invalidateSize(); // Redimensiona el mapa
            }
        }, 100);
    });
});

function inicializarMapaCiudadano() {
    if(!mapaReporte) {
       
        mapaReporte = L.map('mapa-reporte').setView([21.935, -99.982], 14);
        
        // ESTA ES LA MAGIA: Capa de mapa SATELITAL
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri'
        }).addTo(mapaReporte);
        
        mapaReporte.on('click', function(e) {
            if (marcadorReporte) marcadorReporte.setLatLng(e.latlng);
            else marcadorReporte = L.marker(e.latlng).addTo(mapaReporte);
            document.getElementById('latitud').value = e.latlng.lat;
            document.getElementById('longitud').value = e.latlng.lng;
        });
    }
}

function inicializarMapaAdmin() {
    if(!mapaAdmin) {
        mapaAdmin = L.map('mapa-admin').setView([21.935, -99.982], 14);
        
     
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri'
        }).addTo(mapaAdmin);
    }
    dibujarPinesAdmin();
}






document.getElementById('formulario-fuga').addEventListener('submit', async function(e) {
    e.preventDefault();
    const lat = document.getElementById('latitud').value;
    const lng = document.getElementById('longitud').value;
    
    if(!lat) { alert("¡Toca el mapa primero!"); return; }

    const datosReporte = {
        lat: parseFloat(lat).toFixed(5),
        lng: parseFloat(lng).toFixed(5),
        gravedad: document.getElementById('gravedad').value,
        desc: document.getElementById('descripcion').value
    };

    try {
        // Enviar al backend
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosReporte)
        });

        // Limpiar interfaz
        document.getElementById('mensaje-exito').classList.remove('oculto');
        this.reset();
        if (marcadorReporte) { mapaReporte.removeLayer(marcadorReporte); marcadorReporte = null; }
        
        await cargarFugas(); // Descargar los datos actualizados

        setTimeout(() => {
            document.getElementById('mensaje-exito').classList.add('oculto');
            document.querySelector('[data-target="historial"]').click();
        }, 1500);

    } catch (error) {
        alert("Error al enviar el reporte. Asegúrate de que el servidor esté corriendo.");
    }
});


window.cambiarEstado = async function(id, nuevoEstado) {
    try {
        // Enviar actualización al backend
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });

        await cargarFugas(); // Descargar los datos actualizados
    } catch (error) {
        console.error("Error al actualizar el estado:", error);
    }
}

function actualizarVistas() {
    const listaCiudadano = document.getElementById('lista-ciudadano');
    const listaAdmin = document.getElementById('lista-admin');
    
    listaCiudadano.innerHTML = '';
    listaAdmin.innerHTML = '';
    
    let stats = { pendiente: 0, proceso: 0, reparada: 0 };

 
    [...baseDeDatosFugas].reverse().forEach(fuga => {
        stats[fuga.estado]++; 

        
        let textoEstado = fuga.estado === 'pendiente' ? 'Reporte Enviado' : 
                          fuga.estado === 'proceso' ? 'Cuadrilla en Camino' : 'Reparado';
        
        listaCiudadano.innerHTML += `
            <li class="item-reporte">
                <span class="badge estado-${fuga.estado}">${textoEstado}</span>
                <h4>${fuga.desc}</h4>
                <p>Gravedad: ${fuga.gravedad} | Fecha: ${fuga.fecha}</p>
            </li>
        `;

      
        listaAdmin.innerHTML += `
            <div class="card-admin">
                <div style="display:flex; justify-content:space-between;">
                    <strong>Folio #${fuga.id}</strong> 
                    <span style="font-size:0.8rem; color:#64748b;">${fuga.fecha}</span>
                </div>
                <p><b><i class="fa-solid fa-location-dot"></i> Ubicación:</b> ${fuga.lat}, ${fuga.lng}</p>
                <p><b>Descripción:</b> ${fuga.desc}</p>
                <select class="selector-estado ${fuga.estado}" onchange="cambiarEstado(${fuga.id}, this.value)">
                    <option value="pendiente" ${fuga.estado === 'pendiente' ? 'selected' : ''}>🔴 Estatus: Pendiente de Asignar</option>
                    <option value="proceso" ${fuga.estado === 'proceso' ? 'selected' : ''}>🟡 Estatus: Cuadrilla en Camino</option>
                    <option value="reparada" ${fuga.estado === 'reparada' ? 'selected' : ''}>🟢 Estatus: Solucionado</option>
                </select>
            </div>
        `;
    });

    if(baseDeDatosFugas.length === 0) {
        listaCiudadano.innerHTML = '<p>No tienes reportes.</p>';
        listaAdmin.innerHTML = '<p>No hay órdenes de trabajo.</p>';
    }

    
    document.getElementById('stat-pendientes').innerText = stats.pendiente;
    document.getElementById('stat-proceso').innerText = stats.proceso;
    document.getElementById('stat-reparadas').innerText = stats.reparada;

    
    if(mapaAdmin) dibujarPinesAdmin();
}

function dibujarPinesAdmin() {
    
    marcadoresAdmin.forEach(m => mapaAdmin.removeLayer(m));
    marcadoresAdmin = [];

    baseDeDatosFugas.forEach(fuga => {
        // Colores según estado simulando íconos
        let color = fuga.estado === 'pendiente' ? 'red' : fuga.estado === 'proceso' ? 'orange' : 'green';
        
       
        let customIcon = L.divIcon({
            className: 'custom-pin',
            html: `<div style="background-color:${color}; width:20px; height:20px; border-radius:50%; border:2px solid white; box-shadow:0 0 4px rgba(0,0,0,0.5);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        let pin = L.marker([fuga.lat, fuga.lng], {icon: customIcon})
            .bindPopup(`<b>Folio #${fuga.id}</b><br>${fuga.desc}`)
            .addTo(mapaAdmin);
            
        marcadoresAdmin.push(pin);
    });
}