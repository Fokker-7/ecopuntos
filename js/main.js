// Filtrado de puntos de acopio (HU1)

document.addEventListener('DOMContentLoaded', () => {
const botonesFiltro = document.querySelectorAll('.btn-filtro');
const tarjetasPuntos = document.querySelectorAll('.punto-card');
const mensajeVacio = document.getElementById('mensaje-vacio');

/**
 * Función encargada de filtrar las tarjetas según el residuo seleccionado.
 * @param {string} tipoSeleccionado - Valor del atributo data-tipo del botón presionado.
 */
function filtrarPuntos(tipoSeleccionado) {
    let puntosVisibles = 0;

    tarjetasPuntos.forEach(tarjeta => {
        // Obtenemos los tipos de residuos que recibe este punto (guardados en data-residuos)
        const residuosAceptados = tarjeta.dataset.residuos;

        // Comprobamos la condición:
        // Si el filtro es "todos" o si el texto de tipos contiene el residuo elegido
        const coincide = tipoSeleccionado === 'todos' || residuosAceptados.includes(tipoSeleccionado);

        if (coincide) {
            tarjeta.classList.remove('oculto');
            puntosVisibles++;
        } else {
            tarjeta.classList.add('oculto');
        }
    });

    // Mostrar el mensaje alternativo si no coincide ningún punto
    if (puntosVisibles === 0) {
        mensajeVacio.classList.remove('oculto');
    } else {
        mensajeVacio.classList.add('oculto');
    }
}

/**
 * Función para actualizar el aspecto visual del botón activo.
 * @param {HTMLButtonElement} botonClickeado
 */
function actualizarBotonActivo(botonClickeado) {
    // Retiramos la clase 'activo' de todos los botones
    botonesFiltro.forEach(boton => {
        boton.classList.remove('activo');
    });

    // Añadimos la clase 'activo' al botón presionado
    botonClickeado.classList.add('activo');
}

// 2. ASIGNACIÓN DE EVENTOS (EVENT LISTENERS)
// Recorremos la colección de botones y escuchamos el evento 'click' en cada uno
botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
        // Obtenemos el tipo de residuo asignado a este botón
        const tipoResiduo = boton.dataset.tipo;

        // Cambiamos el estilo del botón activo
        actualizarBotonActivo(boton);

        // Filtramos las tarjetas correspondientes
        filtrarPuntos(tipoResiduo);
    });
});


//Lugares favoritos (HU3)

const botonesFavorito = document.querySelectorAll('.punto-card .btn-favorito');
    const contenedorFavoritos = document.getElementById('contenedor-favoritos');
    const mensajeFavoritosVacio = document.getElementById('mensaje-favoritos-vacio');

    // Función auxiliar para mostrar/ocultar el aviso de favoritos vacíos
    const actualizarMensajeFavoritos = () => {
        if (contenedorFavoritos.children.length === 0) {
            mensajeFavoritosVacio.style.display = 'block';
        } else {
            mensajeFavoritosVacio.style.display = 'none';
        }
    };

    botonesFavorito.forEach(boton => {
        boton.addEventListener('click', function() {
            // Seleccionar la tarjeta contenedora (.punto-card)
            const tarjetaOriginal = this.closest('.punto-card');
            const idTarjeta = tarjetaOriginal.getAttribute('data-id');

            // Buscar si ya existe la tarjeta en la lista de favoritos
            const tarjetaEnFavoritos = contenedorFavoritos.querySelector(`.punto-card[data-id="${idTarjeta}"]`);

            if (tarjetaEnFavoritos) {
                // ESCENARIO A: Si ya está en favoritos, se elimina
                tarjetaEnFavoritos.remove();
                this.classList.remove('activo');
                this.querySelector('.texto-btn').textContent = 'Guardar en favoritos';
            } else {
                // ESCENARIO B: Si no está, se marca activo y se clona a Favoritos
                this.classList.add('activo');
                this.querySelector('.texto-btn').textContent = 'En tus favoritos';

                // Clonar tarjeta
                const tarjetaClonada = tarjetaOriginal.cloneNode(true);
                // Asegurarse que el clon sea visible si el filtro de HU1 tenía oculto el original
                tarjetaClonada.classList.remove('oculto'); 

                // Configurar botón del clon para poder eliminarlo desde la sección de favoritos
                const botonClon = tarjetaClonada.querySelector('.btn-favorito');
                botonClon.classList.add('activo');
                botonClon.querySelector('.texto-btn').textContent = 'Quitar de favoritos';

                botonClon.addEventListener('click', () => {
                    tarjetaClonada.remove();
                    this.classList.remove('activo');
                    this.querySelector('.texto-btn').textContent = 'Guardar en favoritos';
                    actualizarMensajeFavoritos();
                });

                contenedorFavoritos.appendChild(tarjetaClonada);
            }

            actualizarMensajeFavoritos();
        });
    });
    
 // HU4 
const botonesRuta = document.querySelectorAll('.btn-ruta');

botonesRuta.forEach(boton => {
    boton.addEventListener('click', (e) => {
        const tarjeta = e.target.closest('.punto-card');
        const panelRuta = tarjeta.querySelector('.panel-ruta');
        const spanDistancia = tarjeta.querySelector('.val-distancia');
        const spanTiempo = tarjeta.querySelector('.val-tiempo');

        if (panelRuta.classList.contains('oculto')) {
            const distanciaAleatoria = (Math.random() * 2.5 + 0.5).toFixed(1);
            const tiempoAleatorio = Math.round(distanciaAleatoria * 12);

            spanDistancia.textContent = `${distanciaAleatoria} km`;
            spanTiempo.textContent = `${tiempoAleatorio} minutos (a pie)`;

            panelRuta.classList.remove('oculto');
            boton.textContent = "Ocultar Ruta";
        } else {
            panelRuta.classList.add('oculto');
            boton.textContent = "Ver Ruta y Distancia";
        }
    });
});

});