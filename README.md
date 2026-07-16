# 💾 FrikiPlayer v1.0 - Retro IT Playlist Player

**FrikiPlayer** es un reproductor de audio web interactivo inspirado en los reproductores multimedia clásicos de finales de los 90 y principios de los 2000 (como Winamp, AIMP y Windows Media Player). Está diseñado para simular un sistema operativo retro maximizado en el escritorio clásico verde-azulado de Windows 95, donde el reproductor y sus ventanas secundarias flotan libremente con comportamiento drag-and-drop y animaciones interactivas de 8 bits.

---

## 🛠️ Stack Tecnológico

El proyecto está diseñado bajo una arquitectura de cliente ligero, buscando el máximo rendimiento y fidelidad visual sin sobrecargar la CPU del cliente:

1. **Frontend Core**: 
   * **HTML5**: Estructura semántica para soportar las múltiples ventanas modales y el canvas gráfico.
   * **JavaScript Vanilla (ES6+)**: Lógica estructurada orientada a objetos (patrón MVC simplificado). Controla la manipulación del DOM, los flujos asíncronos y los ciclos de renderizado.
2. **Estilos y Maquetación**:
   * **TailwindCSS**: Utilizado para la distribución rápida de layouts flexbox/grid, espaciados y clases de posicionamiento.
   * **Vanilla CSS (Custom Styles)**: Hoja de estilos con variables de color CSS (`:root` y `[data-theme]`) de alta especificidad para lograr la adaptabilidad cromática inmediata en todas las ventanas flotantes, además de estilos para botones biselados retro en 3D, controles deslizantes personalizados y el efecto de monitor CRT.
3. **Procesamiento de Audio (Web Audio API)**:
   * Cadena de audio física: `HTML5 AudioElement` -> `Preamp (GainNode)` -> `10 peaking BiquadFilterNodes` (Ecualizador) -> `AnalyserNode` (Visualizaciones) -> `AudioContext.destination`.
4. **Motor de Renderizado Gráfico (Canvas 2D)**:
   * Dibujado a 60 fotogramas por segundo utilizando `requestAnimationFrame` para animar las barras de espectro y los modos de visualización psicodélicos.
5. **Persistencia Local**:
   * `localStorage` nativo del navegador para el almacenamiento del tema activo, la fuente seleccionada y la configuración completa del ecualizador.
6. **Conectividad Nube (Opcional)**:
   * **Supabase JS SDK**: Integración directa a una base de datos PostgreSQL remota para sincronizar, añadir o eliminar canciones de la lista de reproducción en tiempo real.

---

## 🎨 Características de UI/UX

* **Escritorio Limpio Maximizado**: Se ha eliminado la barra de tareas clásica para maximizar el escritorio en color `#008080` (el mítico color verde azulado de Windows 95).
* **Ventanas Flotantes Retro**: El reproductor principal y sus módulos complementarios son ventanas independientes arrastrables (`drag-and-drop`) que se pueden reposicionar y reordenar mediante un gestor de profundidad de z-index dinámico.
* **Minimización de Escritorio**: El reproductor principal puede minimizarse a un icono de acceso directo en la esquina inferior izquierda del escritorio. Un doble clic en el acceso directo restaura la ventana a su posición original.
* **Alternadores de Visibilidad (Toggles)**: Los botones de control del panel principal (`EQ`, `AVS`, `LETRAS`, `EDITAR LISTA`, `CONECTAR NUBE`) funcionan como interruptores. Al hacer clic se abre la ventana correspondiente y al hacer clic de nuevo se cierra.
* **Efectos de Sonido Integrados (Retro SFX)**: El reproductor sintetiza pequeños beeps y tonos de 8 bits en tiempo real mediante osciladores Web Audio API para dar feedback de clic y navegación.
* **10 Temas Visuales Dinámicos**:
  * **Clásico**: Apariencia gris estándar de Windows 95 con biseles en 3D.
  * **Dark Mode**: Paleta moderna de tonos oscuros y grises profundos.
  * **Terminal (Hacker)**: Look de consola de comandos retro con textos en verde neón y fondo negro.
  * **Vaporwave**: Estética retro-futurista de tonos degradados rosados, cianes y morados neón.
  * **Hot Dog (Win 3.1)**: Una recreación humorística del esquema de alto contraste en rojo y amarillo de Windows 3.1.
  * **GameBoy**: Paleta monocromática en escala de verdes oliva del clásico LCD de la portátil de Nintendo.
  * **Monitor Hércules**: Fósforo blanco y negro de terminal de mainframe clásica.
  * **AIMP Classic**: Estilo moderno oscuro con luces en naranja ámbar.
  * **Winamp Bento**: Clásico reproductor Bento con líneas negras y detalles cianes.
  * **WMP 11**: Inspirado en el estilo Aero brillante y azulado de Windows Vista.
* **Tipografías Interactivas**: Selector tipográfico entre fuentes pixeladas de 8 bits (`Press Start 2P`) y fuentes de terminal de DOS (`VT323`) en tamaños normales y ampliados.

---

## 🚀 Funcionalidades Detalladas

### 1. Panel de Reproducción Principal
* Control de reproducción estándar: Play, Pause, Stop, Previous y Next.
* Modos de reproducción **Shuffle** (aleatorio) y **Repeat** (bucle).
* Barra de progreso interactiva (hacer clic para avanzar o retroceder en la pista).
* Pantalla CRT verde reactiva con tres modos de osciloscopio y analizador:
  * **LED Bars**: Clásico espectro de ecualizador de barras LED.
  * **Oscilloscope**: Dibujo de la forma de onda del audio en tiempo real.
  * **Solid Bars**: Barras de espectro de frecuencia rellenas de color.

### 2. Plugin de Visualización AVS (Winamp AVS)
Ventana flotante de renderizado vectorial dedicada a generar animaciones complejas audio-reactivas. Contiene 4 algoritmos:
* **Nebulosa de Partículas**: Enjambre de estrellas en órbita gravitatoria que se vinculan por proximidad formando redes y explotan radialmente cuando se detectan golpes de bajo (frecuencias graves).
* **Túnel de Luz 3D**: Zoom perspectivo interactivo a través de octágonos vectoriales que se dilatan y contraen según el espectro del canal de audio.
* **Caleidoscopio Psicodélico**: Divide y refleja el waveform actual de la pista en 12 sectores circulares rotatorios.
* **Estrella Osciloscópica**: Doble corona de partículas circulares concéntricas y opuestas que vibran directamente con las muestras analógicas (Time-Domain).

### 3. Ecualizador Gráfico de 10 Bandas (Winamp EQ)
* Control físico de ganancia (+12dB a -12dB) en diez frecuencias de corte: `60Hz`, `170Hz`, `310Hz`, `600Hz`, `1kHz`, `3kHz`, `6kHz`, `12kHz`, `14kHz` y `16kHz`.
* Control de volumen **PREAMP** general.
* Switch de bypass para activar o desactivar la ecualización en tiempo real.
* Selección rápida de presets preconfigurados (*Flat*, *Rock*, *Pop*, *Dance*, *Clásico*, *Full Bass*, *Full Treble* y *Soft*).
* **Sliders verticales funcionales en todos los navegadores**: Los sliders responden correctamente al cambiar de preset gracias a `writing-mode: vertical-lr`, solucionando la limitación del atributo `orient="vertical"` que sólo funciona en Firefox.

### 4. Notepad de Letras Sincronizadas
* Ventana que emula a Notepad.exe encargada de mostrar y auto-desplazar las letras de las canciones en tiempo real.
* Destaca la estrofa actual al segundo exacto según el cursor de reproducción.
* Cuenta con letras sincronizadas oficiales precargadas para los temas icónicos *Code Monkey*, *Still Alive* y *Technologic*.

### 5. Administrador de Canciones y Base de Datos (Supabase)
* **Modo Local**: Permite gestionar una cola de pistas almacenada localmente.
* **Modo Nube**: Si se ingresan las credenciales de Supabase (URL y Anon Key), el reproductor se conecta a una tabla de base de datos remota sincronizando las canciones en tiempo real con otros usuarios.
* Formulario para añadir nuevas canciones especificando título, artista y ruta/URL del archivo MP3.

### 6. Sistema Componente Hi-Fi Retro de los 90 (`retro-look.html`)
Una interfaz alternativa e independiente de **FrikiPlayer** inspirada en un sistema modular de componentes de sonido apilables de los años 90 (estilo *rack system* como Technics, Pioneer, Aiwa). Se encuentra en el archivo [retro-look.html](file:///c:/Users/alvar/.gemini/antigravity-ide/scratch/Jukebox_IT_v3/retro-look.html) y ofrece:
* **Diseño e Interfaz Auténtica**: Chasis oscuro estilo grafito, pernos decorativos metálicos en las esquinas, rieles laterales de aluminio cepillado y una pantalla con luz fluorescente de vacío (**VFD**) color verde-azul (teal) brillante con puntas en color ámbar.
* **Módulo de CD (Compact Disc Player)**: Permite cargar discos (MP3 locales o colas de pistas), controles de reproducción interactivos y visualización de tiempo y estado en tiempo real.
* **Sintonizador de Radio Digital AM/FM**: Sintonizador con indicador LED de recepción en estéreo, nivel de señal de antena simulada, frecuencias en MHz reales y nombres de estaciones emisoras nostálgicas precargadas.
* **Pletina de Cassette Analógica (Auto-Reverse)**:
  * Animación en tiempo real de los carretes de cinta giratorios al reproducir, avanzar o rebobinar.
  * Mecanismo de **Auto-Reverse** para invertir la reproducción de lado (Lado A/B) automáticamente o al presionar el botón.
  * Inserción y expulsión de cassette realista con apertura de compuerta visual.
* **Procesador de Señal de Audio Analógico Avanzado (Web Audio API)**:
  * **Efectos Vintage**: *Crap Bass Boost* (emula el refuerzo de graves de equipos portátiles baratos), *Hyper Bass* (potenciación profunda de sub-graves) y *Surround 3D* (simulación espacial tridimensional con líneas de retardo y desfase de canales).
  * **High Speed Dubbing (Warp Drive)**: Aumenta la velocidad de reproducción simulando el copiado rápido de cassettes.
  * **Modo Cassette & Tape Quality**: Permite degradar la señal de audio emulando el desgaste analógico físico de la cinta magnética. Modos de calidad:
    * *Normal*: Reproducción limpia de cassette estándar.
    * *Worn (Gastada)*: Pérdida leve de agudos y sutiles oscilaciones.
    * *Damaged (Dañada)*: Distorsiones más audibles y crujidos ocasionales.
    * *Vintage (Antigua)*: Sonido de fidelidad limitada al estilo de los años 70.
    * *Chewed Up Tape (Masticada)*: Simula el clásico accidente de las pletinas que "se comían" la cinta, provocando oscilaciones drásticas en la afinación (*Wow & Flutter*) y variaciones extremas de ganancia y frecuencia.
  * **Bolby B Type**: Reducción de ruido analógica que atenúa el siseo (*tape hiss*) de alta frecuencia cuando se reproduce en modo cassette.
* **Ecualizador Gráfico de 10 Bandas**: Ecualizador con deslizadores independientes rediseñados y analizador de espectro gráfico (*Peak Level Meter*) reactivo de alta fidelidad con gradiente de color fósforo.

---

## ✨ Mejoras recientes de UI/UX

### Botonera de control estabilizada
* Los 6 botones de control (`SHUFFLE`, `<<`, `PLAY/PAUSE`, `STOP`, `>>`, `REPEAT`) ahora mantienen **altura uniforme** mediante `items-stretch` en el flex container, independientemente del tamaño del emoji o texto de cada botón.
* El botón `PLAY/PAUSE` tiene **ancho fijo** (`w-[105px]`) para que el texto "▶ PLAY" y "⏸ PAUSE" nunca provoquen un desplazamiento lateral al hacer clic.
* Los iconos emoji de SHUFFLE y REPEAT se mantienen siempre a la **izquierda del texto** gracias a `whitespace-nowrap` en cada botón.
* Se eliminó `flex-wrap` del contenedor para garantizar que todos los botones permanezcan en una **única fila**, evitando que el botón REPEAT "salte" a una segunda línea cuando el panel de volumen lateral está abierto.

### Control de volumen lineal en pantalla CRT
* El **mini knob circular** de arrastre dentro de la pantalla CRT fue reemplazado por un **slider lineal horizontal** más intuitivo y estándar.
* El **knob grande** del panel lateral `VOLUMEN` sigue funcionando y sincroniza su posición con el slider lineal en tiempo real.
* El slider usa la clase `crt-slider` existente, respetando el esquema de colores de cada tema visual.

### Indicadores de estado sin saltos de layout
* El indicador de estado (`STOPPED` / `PAUSED` / `PLAYING`) usa `shrink-0 whitespace-nowrap` para nunca provocar reflow en la interfaz.
* Cuando el reproductor está en modo `PLAYING`, el texto **parpadea** mediante una animación CSS (`@keyframes blink-status`) para simular el clásico LED de actividad retro; se detiene automáticamente al pausar o detener.
* El campo de **BITRATE** formatea el número con exactamente 3 dígitos usando `String.padStart` con espacios no rompibles (`\u00a0`), evitando que el layout se desplace al cambiar entre `64kbps`, `128kbps` o `320kbps`.

### Carga inmediata de gráficos
* El **knob de volumen grande** y la **cuadrícula verde del visualizador** se dibujan en el canvas inmediatamente al cargar la página, sin necesidad de hacer clic o interactuar primero.

### Ecualizador: presets visuales corregidos
* Al seleccionar un preset en el EQ, los sliders verticales ahora se **mueven visualmente** a la posición correcta en todos los navegadores.
* El problema raíz era que Chrome no interpreta `orient="vertical"` como atributo HTML; la solución fue usar `writing-mode: vertical-lr; direction: rtl;` en el CSS del slider, convirtiéndolo en genuinamente vertical para el motor de layout del navegador.
