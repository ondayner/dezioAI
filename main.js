
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
                `Nombre Completo: ${nombre}\n` +
                `\n${mensaje}`
            );
            
            window.location.href = `mailto:${destinatario}?subject=${asunto}&body=${cuerpo}`;
        });
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