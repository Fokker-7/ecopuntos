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

// =========================================================================
// PERSISTENCIA DE FAVORITOS (localStorage) + ASISTENTE INTELIGENTE (HAI)
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const CLAVE_FAVORITOS = 'ecopuntos_favoritos';
    const contenedorFavoritos = document.getElementById('contenedor-favoritos');
    let restaurandoFavoritos = false;

    function leerFavoritosGuardados() {
        try {
            const datos = localStorage.getItem(CLAVE_FAVORITOS);
            return datos ? JSON.parse(datos) : [];
        } catch {
            return [];
        }
    }

    function guardarFavoritosActuales() {
        if (restaurandoFavoritos || !contenedorFavoritos) return;
        try {
            const ids = Array.from(contenedorFavoritos.querySelectorAll('.punto-card'))
                .map(card => card.getAttribute('data-id'));
            localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(ids));
        } catch {
            // Silencioso si el almacenamiento está restringido
        }
    }

    // Restaurar favoritos guardados al recargar la página reutilizando la lógica HU3
    const idsGuardados = leerFavoritosGuardados();
    if (idsGuardados.length > 0) {
        restaurandoFavoritos = true;
        idsGuardados.forEach(id => {
            const btnOriginal = document.querySelector(`#lista-puntos .punto-card[data-id="${id}"] .btn-favorito`);
            if (btnOriginal && !btnOriginal.classList.contains('activo')) {
                btnOriginal.click();
            }
        });
        restaurandoFavoritos = false;
    }

    // Sincronizar cambios de favoritos en fase de burbujeo
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-favorito')) {
            guardarFavoritosActuales();
        }
    });

    // ---------------------------------------------------------------------
    // ASISTENTE INTELIGENTE DE RECICLAJE (MULTIMODAL + PRINCIPIOS HAI)
    // ---------------------------------------------------------------------
    const modalAsistente = document.getElementById('modal-asistente-ia');
    const btnAbrirAsistente = document.getElementById('btn-abrir-asistente');
    const btnAbrirVozDirecto = document.getElementById('btn-abrir-voz-directo');
    const btnCerrarAsistente = document.getElementById('btn-cerrar-asistente');
    const formAsistente = document.getElementById('form-asistente-ia');
    const inputResiduo = document.getElementById('input-residuo-ia');
    const btnVoz = document.getElementById('btn-voz-ia');
    const textoBtnVoz = document.getElementById('texto-btn-voz');
    const estadoVoz = document.getElementById('estado-voz-ia');
    const resultadoIA = document.getElementById('resultado-asistente-ia');
    const nivelConfianzaIA = document.getElementById('nivel-confianza-ia');
    const tituloRecomendacionIA = document.getElementById('titulo-recomendacion-ia');
    const criterioIA = document.getElementById('criterio-ia');
    const detalleCentrosIA = document.getElementById('detalle-centros-ia');
    const accionesControlIA = document.getElementById('acciones-control-ia');
    const bannerFiltroIA = document.getElementById('banner-filtro-ia');
    const textoFiltroIA = document.getElementById('texto-filtro-ia');
    const btnLimpiarFiltroIA = document.getElementById('btn-limpiar-filtro-ia');

    if (!modalAsistente) return;

    const CATEGORIAS_META = {
        plastico: {
            nombre: 'Plástico',
            palabras: ['plastico', 'pet', 'envase', 'bolsa', 'tapa', 'tapita', 'bidon', 'galonera', 'detergente', 'shampoo', 'champu', 'tupper', 'acrilico', 'film', 'botella de plastico', 'botella pet'],
            criterio: 'Los envases rígidos, botellas PET y empaques flexibles limpios y secos se aprovechan en el contenedor de Plástico.'
        },
        vidrio: {
            nombre: 'Vidrio',
            palabras: ['vidrio', 'frasco', 'tarro', 'copa', 'vaso de vidrio', 'perfume', 'conserva', 'mermelada', 'cerveza', 'vino', 'botella de vidrio'],
            criterio: 'Los frascos y botellas de vidrio enteros (sin tapas metálicas ni restos líquidos) son 100% reciclables en la categoría Vidrio.'
        },
        papel: {
            nombre: 'Papel / Cartón',
            palabras: ['papel', 'carton', 'caja', 'cuaderno', 'hoja', 'periodico', 'revista', 'libro', 'folder', 'sobre', 'cartulina', 'tubo de papel', 'rollo'],
            criterio: 'El papel y cartón limpios, secos y plegados mantienen sus fibras reutilizables en los puntos de Papel / Cartón.'
        },
        pilas: {
            nombre: 'Pilas / RAEE',
            palabras: ['pila', 'pilas', 'bateria', 'raee', 'celular', 'telefono', 'cargador', 'cable', 'audifono', 'laptop', 'computadora', 'teclado', 'mouse', 'foco', 'led', 'fluorescente', 'electrodomestico', 'televisor', 'control remoto', 'usb'],
            criterio: 'Los aparatos eléctricos, electrónicos, cables y pilas contienen componentes que requieren gestión especializada RAEE para evitar contaminación.'
        },
        organico: {
            nombre: 'Orgánico',
            palabras: ['organico', 'cascara', 'fruta', 'verdura', 'comida', 'cafe', 'te', 'infusion', 'hoja seca', 'planta', 'rama', 'huevo', 'pan', 'compost'],
            criterio: 'Los restos vegetales crudos, cáscaras y posos de café son biodegradables y aptos para compostaje en puntos Orgánicos.'
        }
    };

    const REGLAS_AMBIGUAS = [
        {
            claves: ['pizza'],
            titulo: 'Residuo condicional: Caja de pizza',
            criterio: 'Si el cartón está limpio y sin grasa va a Papel / Cartón. Si tiene manchas de aceite o queso adherido, debe ir a Orgánico (compostaje) o rechazo.',
            opciones: ['papel', 'organico']
        },
        {
            claves: ['tetrapak', 'tetra pak', 'caja de leche', 'caja de jugo'],
            titulo: 'Envase multicapa (Tetra Pak)',
            criterio: 'Combina cartón, polietileno y aluminio. Enjuágalo y aplástalo; según la disponibilidad cercana, puedes entregarlo en Papel / Cartón o Plástico.',
            opciones: ['papel', 'plastico']
        },
        {
            claves: ['botella'],
            titulo: 'Material no especificado: "¿De qué está hecha la botella?"',
            criterio: 'Detectamos "botella", pero el destino depende del material. Selecciona si es plástica (PET) o de vidrio:',
            opciones: ['plastico', 'vidrio']
        }
    ];

    const CLAVES_NO_RECICLABLES = [
        'panal', 'papel higienico', 'servilleta usada', 'mascarilla', 'jeringa',
        'espejo', 'ceramica', 'porcelana', 'tecnopor', 'icopor', 'colilla', 'cigarro'
    ];

    function normalizarTexto(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[.,;:!?¿¡()"]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function obtenerCentrosPorTipo(tipo) {
        const tarjetas = Array.from(document.querySelectorAll('#lista-puntos .punto-card'));
        return tarjetas
            .filter(card => (card.dataset.residuos || '').split(' ').includes(tipo))
            .map(card => card.querySelector('h4')?.textContent.trim())
            .filter(Boolean);
    }

    function clasificarConsulta(consultaOriginal) {
        const texto = normalizarTexto(consultaOriginal);

        if (texto.length < 2) {
            return {
                estado: 'error',
                confianza: 'Entrada insuficiente',
                titulo: 'Describe el residuo con un poco más de detalle',
                criterio: 'Escribe o dicta el nombre del objeto o material (por ejemplo: "frasco de vidrio", "pilas" o "cartón").',
                centrosTexto: ''
            };
        }

        // 1. Verificar residuos no reciclables / contaminantes
        const noReciclable = CLAVES_NO_RECICLABLES.find(clave => texto.includes(clave));
        if (noReciclable) {
            return {
                estado: 'error',
                confianza: 'No apto para reciclaje estándar',
                titulo: `Este residuo ("${consultaOriginal.trim()}") no debe mezclarse en contenedores reciclables`,
                criterio: 'Los residuos sanitarios, espejos, cerámica rota o tecnopor sucio contaminan los lotes aprovechables y van a recolección municipal convencional.',
                centrosTexto: 'Ningún punto de acopio recibe este material.'
            };
        }

        // 2. Verificar coincidencia directa específica antes de ambigüedades genéricas
        for (const [tipo, info] of Object.entries(CATEGORIAS_META)) {
            const coincidenciaExacta = info.palabras.find(p => p.includes(' ') && texto.includes(p));
            if (coincidenciaExacta) {
                const centros = obtenerCentrosPorTipo(tipo);
                return {
                    estado: 'seguro',
                    confianza: 'Confianza alta',
                    tipo,
                    titulo: `Categoría sugerida: ${info.nombre}`,
                    criterio: `Detectamos "${coincidenciaExacta}". ${info.criterio}`,
                    centrosTexto: centros.length > 0
                        ? `Centros coincidentes (${centros.length}): ${centros.join(' • ')}.`
                        : 'Actualmente no hay centros activos para esta categoría.'
                };
            }
        }

        // 3. Verificar casos ambiguos (Confianza calibrada)
        for (const regla of REGLAS_AMBIGUAS) {
            if (regla.claves.some(c => texto.includes(c))) {
                return {
                    estado: 'ambiguo',
                    confianza: 'Requiere tu confirmación',
                    titulo: regla.titulo,
                    criterio: regla.criterio,
                    opciones: regla.opciones,
                    centrosTexto: 'Elige la opción que mejor describa el estado de tu residuo para filtrar el mapa.'
                };
            }
        }

        // 4. Búsqueda por palabras clave individuales
        for (const [tipo, info] of Object.entries(CATEGORIAS_META)) {
            const palabraDetectada = info.palabras.find(p => texto.includes(p));
            if (palabraDetectada) {
                const centros = obtenerCentrosPorTipo(tipo);
                return {
                    estado: 'seguro',
                    confianza: 'Confianza alta',
                    tipo,
                    titulo: `Categoría sugerida: ${info.nombre}`,
                    criterio: `Detectamos "${palabraDetectada}". ${info.criterio}`,
                    centrosTexto: centros.length > 0
                        ? `Centros coincidentes (${centros.length}): ${centros.join(' • ')}.`
                        : 'Actualmente no hay centros activos para esta categoría.'
                };
            }
        }

        // 5. Recuperación ante residuo no reconocido
        return {
            estado: 'error',
            confianza: 'Residuo no reconocido',
            titulo: `No pude clasificar "${consultaOriginal.trim()}" con certeza`,
            criterio: 'El término no coincide con nuestro catálogo urbano. Intenta nombrar el material principal (plástico, vidrio, papel, cartón, pilas o restos orgánicos).',
            centrosTexto: 'También puedes explorar manualmente los 5 filtros disponibles debajo.'
        };
    }

    function aplicarFiltroConControlUsuario(tipo) {
        const botonFiltro = document.querySelector(`.btn-filtro[data-tipo="${tipo}"]`);
        if (botonFiltro) {
            botonFiltro.click();
            const nombreCat = CATEGORIAS_META[tipo]?.nombre || tipo;
            textoFiltroIA.textContent = `Filtro aplicado por Sugerencia IA: ${nombreCat}`;
            bannerFiltroIA.classList.remove('oculto');
        }
        cerrarModalAsistente();
        document.getElementById('contenedor-localizador')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function descartarSugerenciaIA() {
        resultadoIA.classList.add('oculto');
        accionesControlIA.innerHTML = '';
        inputResiduo.value = '';
        estadoVoz.textContent = '';
        inputResiduo.focus();
    }

    function renderizarResultadoIA(analisis) {
        resultadoIA.className = `resultado-ia estado-${analisis.estado}`;
        nivelConfianzaIA.textContent = analisis.confianza;
        tituloRecomendacionIA.textContent = analisis.titulo;
        criterioIA.textContent = analisis.criterio;
        detalleCentrosIA.textContent = analisis.centrosTexto;
        accionesControlIA.innerHTML = '';

        if (analisis.estado === 'seguro') {
            const btnAplicar = document.createElement('button');
            btnAplicar.type = 'button';
            btnAplicar.className = 'btn-ia-primario';
            btnAplicar.textContent = `Aplicar filtro: ${CATEGORIAS_META[analisis.tipo].nombre}`;
            btnAplicar.addEventListener('click', () => aplicarFiltroConControlUsuario(analisis.tipo));
            accionesControlIA.appendChild(btnAplicar);
        } else if (analisis.estado === 'ambiguo' && Array.isArray(analisis.opciones)) {
            analisis.opciones.forEach(tipoOpcion => {
                const btnOpcion = document.createElement('button');
                btnOpcion.type = 'button';
                btnOpcion.className = 'btn-ia-primario';
                btnOpcion.textContent = `Aplicar ${CATEGORIAS_META[tipoOpcion].nombre}`;
                btnOpcion.addEventListener('click', () => aplicarFiltroConControlUsuario(tipoOpcion));
                accionesControlIA.appendChild(btnOpcion);
            });
        } else {
            const btnManual = document.createElement('button');
            btnManual.type = 'button';
            btnManual.className = 'btn-ia-secundario';
            btnManual.textContent = 'Explorar filtros manualmente';
            btnManual.addEventListener('click', () => {
                cerrarModalAsistente();
                document.querySelector('#filtros-residuos .btn-filtro')?.focus();
            });
            accionesControlIA.appendChild(btnManual);
        }

        const btnDescartar = document.createElement('button');
        btnDescartar.type = 'button';
        btnDescartar.className = 'btn-descartar-ia';
        btnDescartar.textContent = 'Descartar';
        btnDescartar.addEventListener('click', descartarSugerenciaIA);
        accionesControlIA.appendChild(btnDescartar);

        resultadoIA.classList.remove('oculto');
    }

    // Reconocimiento de Voz Multimodal (Web Speech API)
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    let reconocimiento = null;
    let escuchandoVoz = false;

    if (SpeechRecognitionAPI) {
        reconocimiento = new SpeechRecognitionAPI();
        reconocimiento.lang = 'es-PE';
        reconocimiento.interimResults = false;
        reconocimiento.maxAlternatives = 1;

        reconocimiento.onstart = () => {
            escuchandoVoz = true;
            btnVoz.classList.add('escuchando');
            btnVoz.setAttribute('aria-pressed', 'true');
            textoBtnVoz.textContent = 'Escuchando...';
            estadoVoz.textContent = 'Habla ahora: di qué residuo deseas reciclar...';
        };

        reconocimiento.onresult = (evento) => {
            const transcripcion = evento.results[0][0].transcript;
            inputResiduo.value = transcripcion;
            estadoVoz.textContent = `Voz detectada: "${transcripcion}"`;
            renderizarResultadoIA(clasificarConsulta(transcripcion));
        };

        reconocimiento.onerror = (evento) => {
            const mensajesError = {
                'not-allowed': 'Permiso de micrófono denegado. Puedes escribir tu residuo manualmente.',
                'no-speech': 'No se detectó voz. Intenta acercarte al micrófono o escribe tu consulta.',
                'aborted': 'Dictado detenido.'
            };
            estadoVoz.textContent = mensajesError[evento.error] || 'No se pudo completar el reconocimiento de voz. Usa el campo de texto.';
        };

        reconocimiento.onend = () => {
            escuchandoVoz = false;
            btnVoz.classList.remove('escuchando');
            btnVoz.setAttribute('aria-pressed', 'false');
            textoBtnVoz.textContent = 'Voz';
        };

        btnVoz.addEventListener('click', () => {
            if (escuchandoVoz) {
                reconocimiento.stop();
            } else {
                reconocimiento.start();
            }
        });
    } else {
        btnVoz.disabled = true;
        btnVoz.title = 'Reconocimiento de voz no soportado en este navegador';
    }

    function abrirModalAsistente(iniciarVoz = false) {
        modalAsistente.classList.remove('oculto');
        inputResiduo.focus();
        if (iniciarVoz) {
            if (reconocimiento && !escuchandoVoz) {
                reconocimiento.start();
            } else if (!reconocimiento) {
                estadoVoz.textContent = 'Tu navegador no soporta dictado por voz; escribe tu residuo arriba.';
            }
        }
    }

    function cerrarModalAsistente() {
        if (reconocimiento && escuchandoVoz) {
            reconocimiento.stop();
        }
        modalAsistente.classList.add('oculto');
    }

    btnAbrirAsistente.addEventListener('click', () => abrirModalAsistente(false));
    btnAbrirVozDirecto.addEventListener('click', () => abrirModalAsistente(true));
    btnCerrarAsistente.addEventListener('click', cerrarModalAsistente);

    modalAsistente.addEventListener('click', (e) => {
        if (e.target === modalAsistente) cerrarModalAsistente();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalAsistente.classList.contains('oculto')) {
            cerrarModalAsistente();
        }
    });

    formAsistente.addEventListener('submit', (e) => {
        e.preventDefault();
        renderizarResultadoIA(clasificarConsulta(inputResiduo.value));
    });

    document.querySelectorAll('.chip-ejemplo-ia').forEach(chip => {
        chip.addEventListener('click', () => {
            const consulta = chip.dataset.consulta;
            inputResiduo.value = consulta;
            estadoVoz.textContent = '';
            renderizarResultadoIA(clasificarConsulta(consulta));
        });
    });

    btnLimpiarFiltroIA.addEventListener('click', () => {
        document.querySelector('.btn-filtro[data-tipo="todos"]')?.click();
        bannerFiltroIA.classList.add('oculto');
    });

    // Ocultar el aviso de filtro IA si el usuario toma control manual en la barra de filtros
    document.querySelectorAll('#filtros-residuos .btn-filtro').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.isTrusted) {
                bannerFiltroIA.classList.add('oculto');
            }
        });
    });
});