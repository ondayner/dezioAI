
    // Lógica del Menú Móvil
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Cerrar menú móvil al hacer click en algún link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    //ENVIAR CORREO

    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('contact-form');
        
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const nombre = form.querySelector('input[type="text"]').value;
            const correo = form.querySelector('input[type="email"]').value;
            const mensaje = form.querySelector('textarea').value;
            
            const destinatario = 'dezioai2304@gmail.com';
            const asunto = encodeURIComponent(`Correo de: ${nombre}`);
            const cuerpo = encodeURIComponent(
                `\n${mensaje}`
            );
            
            window.location.href = `mailto:${destinatario}?subject=${asunto}&body=${cuerpo}`;
        });
    });

document.addEventListener('DOMContentLoaded', () => {
    
    //#region CONSTANTES GLOBALES
    const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*<>[]{}";
    const BLOCK_CHARS = "▰▱█▒░/<>[]@#$";

    //#region EFECTO 1: DECODIFICACIÓN / GLITCH GLOBAL
    function applyGlitchEffect(elementId, finalText, speedFactor = 3, intervalSpeed = 45) {
        const target = document.getElementById(elementId);
        if (!target) return null;

        // Limpiamos cualquier intervalo activo previo en este elemento para evitar solapamientos
        if (target.dataset.intervalId) {
            clearInterval(parseInt(target.dataset.intervalId));
        }

        let iterations = 0;
        const interval = setInterval(() => {
            target.innerText = finalText.split('').map((char, index) => {
                if (char === ' ' || char === '—' || char === '¿' || char === '?') return char;
                if (index < iterations) return finalText[index];
                return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            }).join('');
            
            iterations += 1 / speedFactor;
            if (iterations >= finalText.length) {
                target.innerText = finalText;
                clearInterval(interval);
                target.removeAttribute('data-interval-id');
            }
        }, intervalSpeed);

        target.dataset.intervalId = interval;
    }

    //#region EFECTO 2: SCAN & PRINT (IZQUIERDA A DERECHA + CURSOR)
    function applyScanPrintEffect(elementId, finalText, framesPerLetter = 3, intervalSpeed = 40, cursorColorClass = "text-current") {
        const target = document.getElementById(elementId);
        if (!target) return null;

        // Limpiamos cualquier intervalo activo previo en este elemento
        if (target.dataset.intervalId) {
            clearInterval(parseInt(target.dataset.intervalId));
        }

        let progress = 0;
        let frameCount = 0;

        const interval = setInterval(() => {
            let currentHTML = "";
            for (let i = 0; i < finalText.length; i++) {
                if (i < progress) {
                    currentHTML += finalText[i];
                } else if (i === progress) {
                    if (finalText[i] === ' ') {
                        currentHTML += ' ';
                        progress++;
                    } else {
                        currentHTML += BLOCK_CHARS[Math.floor(Math.random() * BLOCK_CHARS.length)];
                        frameCount++;
                        if (frameCount >= framesPerLetter) {
                            frameCount = 0;
                            progress++;
                        }
                    }
                }
            }

            if (progress < finalText.length) {
                target.innerHTML = `${currentHTML}<span class="${cursorColorClass} animate-pulse ml-1">█</span>`;
            } else {
                target.innerHTML = finalText;
                clearInterval(interval);
                target.removeAttribute('data-interval-id');
            }
        }, intervalSpeed);

        target.dataset.intervalId = interval;
    }

    //#region EFECTO 3: CONTADORES ASCENDENTES (NÚMEROS)
    function animateValue(elementId, start, end, duration, suffix = "") {
        const obj = document.getElementById(elementId);
        if (!obj) return;
        
        // Cancelamos cualquier animación de frames previa activa en este elemento
        if (obj.dataset.animationFrameId) {
            cancelAnimationFrame(parseInt(obj.dataset.animationFrameId));
        }

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
            
            obj.innerHTML = `${Math.floor(easeProgress * (end - start) + start)}${suffix}`;
            
            if (progress < 1) {
                obj.dataset.animationFrameId = window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = `${end}${suffix}`;
                obj.removeAttribute('data-animation-frame-id');
            }
        };
        obj.dataset.animationFrameId = window.requestAnimationFrame(step);
    }

    //#region OBSERVADOR DE INTERSECCIÓN (REPETITIVO + DELAY)
    /**
     * Registra un elemento para que ejecute su animación cada vez que entra en pantalla, con un retraso opcional.
     * @param {string} elementId 
     * @param {function} animationCallback 
     * @param {number} delay
     */
    function triggerOnScroll(elementId, animationCallback, delay = 0) {
        const target = document.getElementById(elementId);
        if (!target) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Si ya había un temporizador de delay pendiente para este elemento, lo cancelamos
                    if (target.dataset.delayTimeoutId) {
                        clearTimeout(parseInt(target.dataset.delayTimeoutId));
                    }

                    // Creamos el temporizador para aplicar el retraso (delay) antes de disparar la animación
                    const timeoutId = setTimeout(() => {
                        animationCallback();
                        target.removeAttribute('data-delay-timeout-id');
                    }, delay);

                    target.dataset.delayTimeoutId = timeoutId;
                } else {
                    // Si el elemento sale de pantalla, limpiamos delays activos e intervalos para que no sigan corriendo en segundo plano
                    if (target.dataset.delayTimeoutId) {
                        clearTimeout(parseInt(target.dataset.delayTimeoutId));
                        target.removeAttribute('data-delay-timeout-id');
                    }
                    if (target.dataset.intervalId) {
                        clearInterval(parseInt(target.dataset.intervalId));
                        target.removeAttribute('data-interval-id');
                    }
                    if (target.dataset.animationFrameId) {
                        cancelAnimationFrame(parseInt(target.dataset.animationFrameId));
                        target.removeAttribute('data-animation-frame-id');
                    }
                    
                    // Opcional: Ocultamos o vaciamos el texto temporalmente al salir de pantalla
                    // para que el reinicio de la animación al volver a entrar sea visualmente limpio.
                    target.innerHTML = "&nbsp;"; 
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Se activa cuando al menos el 10% del elemento entra en el viewport
        });

        observer.observe(target);
    }

    //#region INICIALIZACIÓN DE ANIMACIONES CON OBSERVADOR (Y DELAY)
    
    // --- Grupo 1: Glitch Global (Efecto 1) ---
    triggerOnScroll('typewriter-title', () => applyGlitchEffect('typewriter-title', "— Automatizamos tu Negocio —", 3, 10), 100);
    triggerOnScroll('typewriter-services-sub', () => applyGlitchEffect('typewriter-services-sub', "Nuestros Servicios", 3, 15), 150);
    triggerOnScroll('typewriter-services-title', () => applyGlitchEffect('typewriter-services-title', "¿Qué Ofrecemos?", 2.5, 20), 200);
    triggerOnScroll('typewriter-benefits-sub', () => applyGlitchEffect('typewriter-benefits-sub', "Impacto Real", 3, 15), 150);
    triggerOnScroll('typewriter-benefits-title', () => applyGlitchEffect('typewriter-benefits-title', "¿Qué Beneficios Obtienes?", 2.5, 10), 200);
    triggerOnScroll('typewriter-team-sub', () => applyGlitchEffect('typewriter-team-sub', "Nuestras Mentes", 3, 25), 150);
    triggerOnScroll('typewriter-team-title', () => applyGlitchEffect('typewriter-team-title', "El Equipo", 2.5, 30), 200);

    // --- Grupo 2: Máquina de Escribir / Terminal (Efecto 2) ---
    triggerOnScroll('typewriter-tech-sub', () => applyScanPrintEffect('typewriter-tech-sub', "Tecnología sin Precedentes", 3, 20), 250);
    triggerOnScroll('typewriter-about', () => applyScanPrintEffect('typewriter-about', "Quiénes Somos", 3, 40, "text-gold"), 300);
    triggerOnScroll('typewriter-workflow', () => applyScanPrintEffect('typewriter-workflow', "Automatización de Workflows", 3, 20), 150);
    triggerOnScroll('typewriter-ia', () => applyScanPrintEffect('typewriter-ia', "Integración de I.A.", 3, 20), 150);
    triggerOnScroll('typewriter-erp', () => applyScanPrintEffect('typewriter-erp', "Infraestructura ERP", 3, 20), 150);
    triggerOnScroll('typewriter-benefit-time', () => applyScanPrintEffect('typewriter-benefit-time', "Ahorro de Tiempo Incalculable", 3, 10), 200);
    triggerOnScroll('typewriter-benefit-error', () => applyScanPrintEffect('typewriter-benefit-error', "Reducción de Margen de Error", 3, 10), 250);
    triggerOnScroll('typewriter-benefit-scale', () => applyScanPrintEffect('typewriter-benefit-scale', "Escalabilidad Sin Límites", 3, 15), 300);
    triggerOnScroll('typewriter-benefit-control', () => applyScanPrintEffect('typewriter-benefit-control', "Control en Tiempo Real", 3, 15), 350);

    // --- Grupo 3: Contadores Numéricos (Efecto 3) ---
    triggerOnScroll('counter-percent', () => animateValue('counter-percent', 0, 99, 1000, "%"), 400);
    triggerOnScroll('counter-hours', () => animateValue('counter-hours', 0, 24, 800, "/7"), 400);
});

        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        orbitron: ['Orbitron', 'sans-serif'],
                        inter: ['Inter', 'sans-serif'],
                    },
                    colors: {
                        darkBg: '#050505',
                        gold: {
                            light: '#FFE293',
                            DEFAULT: '#D4AF37',
                            dark: '#A67C1E',
                        },
                        electricBlue: {
                            DEFAULT: '#0052FF',
                            neon: '#00C2FF',
                        }
                    }
                }
            }
        }