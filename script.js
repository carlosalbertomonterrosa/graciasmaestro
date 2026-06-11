// ==================== SISTEMA DE HISTORIAS ====================
const TOTAL_HISTORIAS = {
  mario: { slides: 6, completada: false },
  juan: { slides: 4, completada: false },
  francisco: { slides: 3, completada: false },
  carlos: { slides: 3, completada: false, bloqueada: true }
};

let historiaActual = null;
let slideActual = 0;
let totalSlidesHistoria = 0;

function cargarProgreso() {
  const guardado = localStorage.getItem('comandobot_historias');
  if (guardado) {
    const datos = JSON.parse(guardado);
    TOTAL_HISTORIAS.mario.completada = datos.mario || false;
    TOTAL_HISTORIAS.juan.completada = datos.juan || false;
    TOTAL_HISTORIAS.francisco.completada = datos.francisco || false;
  }
  actualizarMenu();
}

function guardarProgreso() {
  localStorage.setItem('comandobot_historias', JSON.stringify({
    mario: TOTAL_HISTORIAS.mario.completada,
    juan: TOTAL_HISTORIAS.juan.completada,
    francisco: TOTAL_HISTORIAS.francisco.completada
  }));
}

function marcarCompletada(historiaId) {
  if (TOTAL_HISTORIAS[historiaId] && !TOTAL_HISTORIAS[historiaId].completada) {
    TOTAL_HISTORIAS[historiaId].completada = true;
    guardarProgreso();
    actualizarMenu();
    
    const todasCompletadas = TOTAL_HISTORIAS.mario.completada && 
                            TOTAL_HISTORIAS.juan.completada && 
                            TOTAL_HISTORIAS.francisco.completada;
    
    if (todasCompletadas && TOTAL_HISTORIAS.carlos.bloqueada) {
      TOTAL_HISTORIAS.carlos.bloqueada = false;
      actualizarMenu();
      mostrarMensaje('🔓 ¡Carlos se ha desbloqueado! Ahora puedes ver su historia.', '#06D6A0');
    }
  }
}

function actualizarMenu() {
  const marioCard = document.querySelector('[data-historia="mario"]');
  const juanCard = document.querySelector('[data-historia="juan"]');
  const franciscoCard = document.querySelector('[data-historia="francisco"]');
  const carlosCard = document.getElementById('carlos-card');
  
  const marioStatus = document.getElementById('status-mario');
  const juanStatus = document.getElementById('status-juan');
  const franciscoStatus = document.getElementById('status-francisco');
  const carlosStatus = document.getElementById('status-carlos');
  
  if (TOTAL_HISTORIAS.mario.completada) {
    marioCard?.classList.add('completed');
    marioStatus.textContent = '✅ Completada';
  } else {
    marioCard?.classList.remove('completed');
    marioStatus.textContent = '⚪ No visto';
  }
  
  if (TOTAL_HISTORIAS.juan.completada) {
    juanCard?.classList.add('completed');
    juanStatus.textContent = '✅ Completada';
  } else {
    juanCard?.classList.remove('completed');
    juanStatus.textContent = '⚪ No visto';
  }
  
  if (TOTAL_HISTORIAS.francisco.completada) {
    franciscoCard?.classList.add('completed');
    franciscoStatus.textContent = '✅ Completada';
  } else {
    franciscoCard?.classList.remove('completed');
    franciscoStatus.textContent = '⚪ No visto';
  }
  
  const todasCompletadas = TOTAL_HISTORIAS.mario.completada && 
                          TOTAL_HISTORIAS.juan.completada && 
                          TOTAL_HISTORIAS.francisco.completada;
  
  if (todasCompletadas && TOTAL_HISTORIAS.carlos.bloqueada) {
    TOTAL_HISTORIAS.carlos.bloqueada = false;
  }
  
  if (TOTAL_HISTORIAS.carlos.bloqueada) {
    carlosCard?.classList.add('locked');
    carlosStatus.innerHTML = '🔒 Bloqueado';
    const faltantes = [];
    if (!TOTAL_HISTORIAS.mario.completada) faltantes.push('Mario');
    if (!TOTAL_HISTORIAS.juan.completada) faltantes.push('Juan');
    if (!TOTAL_HISTORIAS.francisco.completada) faltantes.push('Francisco');
    const lockMsg = document.getElementById('carlos-lock-msg');
    if (lockMsg) lockMsg.textContent = `🔐 Faltan: ${faltantes.join(', ')}`;
  } else {
    carlosCard?.classList.remove('locked');
    carlosStatus.innerHTML = '🔓 Disponible';
    const lockMsg = document.getElementById('carlos-lock-msg');
    if (lockMsg) lockMsg.textContent = '';
  }
  
  const completadas = [TOTAL_HISTORIAS.mario.completada, TOTAL_HISTORIAS.juan.completada, TOTAL_HISTORIAS.francisco.completada].filter(Boolean).length;
  const progresoFill = document.getElementById('progreso-fill');
  const progresoText = document.getElementById('progreso-text');
  if (progresoFill) progresoFill.style.width = `${(completadas / 3) * 100}%`;
  if (progresoText) progresoText.textContent = `📊 ${completadas}/3 historias vistas para desbloquear a Carlos`;
}

function mostrarMensaje(mensaje, color) {
  const toast = document.createElement('div');
  toast.textContent = mensaje;
  toast.style.position = 'fixed';
  toast.style.bottom = '80px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = color;
  toast.style.color = '#1A1A2E';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '50px';
  toast.style.fontWeight = 'bold';
  toast.style.zIndex = '1000';
  toast.style.fontFamily = 'Nunito, sans-serif';
  toast.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function iniciarHistoria(historiaId) {
  if (historiaId === 'carlos') {
    if (TOTAL_HISTORIAS.carlos.bloqueada) {
      mostrarMensaje('❌ Debes completar las 3 historias anteriores para ver a Carlos', '#FF6B35');
      return false;
    }
    mostrarModalEdad(() => {
      historiaActual = historiaId;
      slideActual = 0;
      configurarHistoria(historiaId);
      mostrarHistoriaContainer(true);
      mostrarSlide(0);
    });
    return false;
  }
  
  historiaActual = historiaId;
  slideActual = 0;
  configurarHistoria(historiaId);
  mostrarHistoriaContainer(true);
  mostrarSlide(0);
  return true;
}

function configurarHistoria(historiaId) {
  const allSlides = document.querySelectorAll('.slide');
  allSlides.forEach(slide => slide.classList.remove('active'));
  
  switch(historiaId) {
    case 'mario':
      totalSlidesHistoria = TOTAL_HISTORIAS.mario.slides;
      for(let i = 0; i < totalSlidesHistoria; i++) {
        document.getElementById(`slide-mario-${i}`)?.classList.add('active');
      }
      break;
    case 'juan':
      totalSlidesHistoria = TOTAL_HISTORIAS.juan.slides;
      for(let i = 0; i < totalSlidesHistoria; i++) {
        document.getElementById(`slide-juan-${i}`)?.classList.add('active');
      }
      break;
    case 'francisco':
      totalSlidesHistoria = TOTAL_HISTORIAS.francisco.slides;
      for(let i = 0; i < totalSlidesHistoria; i++) {
        document.getElementById(`slide-francisco-${i}`)?.classList.add('active');
      }
      break;
    case 'carlos':
      totalSlidesHistoria = TOTAL_HISTORIAS.carlos.slides;
      for(let i = 0; i < totalSlidesHistoria; i++) {
        document.getElementById(`slide-carlos-${i}`)?.classList.add('active');
      }
      break;
  }
  
  actualizarBotonesHistoria();
  actualizarPuntosProgreso();
}

function getSlidePrefix() {
  switch(historiaActual) {
    case 'mario': return 'mario';
    case 'juan': return 'juan';
    case 'francisco': return 'francisco';
    case 'carlos': return 'carlos';
    default: return 'mario';
  }
}

function mostrarSlide(index) {
  const prefix = getSlidePrefix();
  document.querySelectorAll(`[id^="slide-${prefix}"]`).forEach(slide => {
    slide.classList.remove('active');
  });
  
  const slideActualElem = document.getElementById(`slide-${prefix}-${index}`);
  if (slideActualElem) {
    slideActualElem.classList.add('active');
    slideActualElem.scrollTop = 0;
  }
  
  actualizarBotonesHistoria();
  actualizarPuntosProgreso();
}

function siguienteSlide() {
  if (slideActual < totalSlidesHistoria - 1) {
    slideActual++;
    mostrarSlide(slideActual);
  } else {
    marcarCompletada(historiaActual);
    const nombres = { mario: 'Mario', juan: 'Juan Sebastián', francisco: 'Francisco Javier', carlos: 'Carlos' };
    mostrarMensaje(`🎉 ¡Historia de ${nombres[historiaActual]} completada!`, '#06D6A0');
    volverAlMenu();
  }
}

function anteriorSlide() {
  if (slideActual > 0) {
    slideActual--;
    mostrarSlide(slideActual);
  }
}

function volverAlMenu() {
  mostrarHistoriaContainer(false);
  historiaActual = null;
  slideActual = 0;
}

function mostrarHistoriaContainer(mostrar) {
  const menu = document.getElementById('menu-principal');
  const historiaContainer = document.getElementById('historia-container');
  
  if (mostrar) {
    menu.style.display = 'none';
    historiaContainer.style.display = 'block';
  } else {
    menu.style.display = 'block';
    historiaContainer.style.display = 'none';
  }
}

function actualizarBotonesHistoria() {
  const btnAnterior = document.getElementById('btnAnterior');
  btnAnterior.style.display = slideActual > 0 ? 'flex' : 'none';
}

function actualizarPuntosProgreso() {
  const progreso = document.getElementById('progreso');
  if (!progreso) return;
  progreso.innerHTML = '';
  for(let i = 0; i < totalSlidesHistoria; i++) {
    const punto = document.createElement('div');
    punto.className = 'punto' + (i === slideActual ? ' activo' : '');
    progreso.appendChild(punto);
  }
}

function mostrarModalEdad(callback) {
  const modal = document.getElementById('modal-edad');
  modal.style.display = 'flex';
  
  const btnMayor = document.getElementById('btn-mayor');
  const btnMenor = document.getElementById('btn-menor');
  
  const handlerMayor = () => {
    modal.style.display = 'none';
    btnMayor.removeEventListener('click', handlerMayor);
    btnMenor.removeEventListener('click', handlerMenor);
    callback();
  };
  
  const handlerMenor = () => {
    modal.style.display = 'none';
    mostrarMensaje('🔞 Lo sentimos, debes ser mayor de 18 años para ver esta historia', '#FF6B35');
    btnMayor.removeEventListener('click', handlerMayor);
    btnMenor.removeEventListener('click', handlerMenor);
  };
  
  btnMayor.addEventListener('click', handlerMayor);
  btnMenor.addEventListener('click', handlerMenor);
}

function crearEstrellas() {
  const cont = document.getElementById('estrellas');
  if (!cont) return;
  const emojis = ['⭐', '✨', '💫', '🌟'];
  for(let i = 0; i < 20; i++) {
    const e = document.createElement('div');
    e.className = 'estrella';
    e.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    e.style.left = Math.random() * 100 + 'vw';
    e.style.animationDuration = (8 + Math.random() * 12) + 's';
    e.style.animationDelay = (Math.random() * 10) + 's';
    e.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    cont.appendChild(e);
  }
}

function initEventos() {
  document.getElementById('btnSiguiente').onclick = () => siguienteSlide();
  document.getElementById('btnAnterior').onclick = () => anteriorSlide();
  document.getElementById('btnVolverMenu').onclick = () => volverAlMenu();
  
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', () => {
      const historia = card.getAttribute('data-historia');
      if (historia && !card.classList.contains('locked')) {
        iniciarHistoria(historia);
      } else if (card.classList.contains('locked')) {
        mostrarMensaje('🔒 Historia bloqueada. Completa las anteriores primero.', '#FF6B35');
      }
    });
  });
  
  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
  document.addEventListener('touchend', (e) => {
    if (historiaActual) {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) diff > 0 ? anteriorSlide() : siguienteSlide();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (historiaActual) {
      if (e.key === 'ArrowRight') siguienteSlide();
      if (e.key === 'ArrowLeft') anteriorSlide();
      if (e.key === 'Escape') volverAlMenu();
    }
  });
}

function init() {
  crearEstrellas();
  cargarProgreso();
  initEventos();
  mostrarHistoriaContainer(false);
}

document.addEventListener('DOMContentLoaded', init);