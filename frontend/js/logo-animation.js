// Lógica de Animación para el Logotipo de Shaddai Industrial usando GSAP
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si GSAP está cargado
    if (typeof gsap === 'undefined') {
        console.warn('GSAP no está cargado. La animación del logo no se ejecutará.');
        return;
    }

    // 1. Animación de Entrada (Page Load) para cada logotipo en la página
    const logos = document.querySelectorAll('#shaddai-logo');
    logos.forEach(logo => {
        const topPart = logo.querySelectorAll('#logo-part-top, #logo-part-top-highlight');
        const middlePart = logo.querySelectorAll('#logo-part-middle, #logo-part-middle-highlight');
        const bottomPart = logo.querySelectorAll('#logo-part-bottom, #logo-part-bottom-highlight');
        const chars = logo.querySelectorAll('.logo-char');
        const subtext = logo.querySelector('.logo-subtext');

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Ensamblado elástico del isotipo (vuelan desde sus respectivas posiciones y se juntan)
        tl.from(topPart, {
            x: -50,
            y: -45,
            opacity: 0,
            duration: 1.4,
            ease: 'elastic.out(1, 0.65)'
        });

        tl.from(middlePart, {
            x: 60,
            opacity: 0,
            duration: 1.4,
            ease: 'elastic.out(1, 0.65)'
        }, '-=1.25');

        tl.from(bottomPart, {
            x: -50,
            y: 45,
            opacity: 0,
            duration: 1.4,
            ease: 'elastic.out(1, 0.65)'
        }, '-=1.25');

        // Entrada escalonada de las letras (SHADDAI)
        if (chars.length > 0) {
            tl.from(chars, {
                opacity: 0,
                y: 18,
                stagger: 0.06,
                duration: 0.6,
                ease: 'back.out(1.7)'
            }, '-=0.9');
        }

        // Aparición sutil del subtítulo (ROPA INDUSTRIAL)
        if (subtext) {
            tl.from(subtext, {
                opacity: 0,
                y: 8,
                duration: 0.5
            }, '-=0.4');
        }
    });

    // 2. Micro-interacciones al pasar el cursor (Hover / Exploded View)
    const logoLinks = document.querySelectorAll('.shaddai-logo-link');
    logoLinks.forEach(link => {
        const topPart = link.querySelectorAll('#logo-part-top, #logo-part-top-highlight');
        const middlePart = link.querySelectorAll('#logo-part-middle, #logo-part-middle-highlight');
        const bottomPart = link.querySelectorAll('#logo-part-bottom, #logo-part-bottom-highlight');
        const chars = link.querySelectorAll('.logo-char');

        link.addEventListener('mouseenter', () => {
            // Efecto expansivo 3D del logotipo (las partes se separan sutilmente)
            gsap.to(topPart, {
                x: 4,
                y: -4,
                duration: 0.35,
                ease: 'power2.out'
            });

            gsap.to(middlePart, {
                scale: 1.05,
                transformOrigin: '50% 50%',
                duration: 0.35,
                ease: 'power2.out'
            });

            gsap.to(bottomPart, {
                x: -4,
                y: 4,
                duration: 0.35,
                ease: 'power2.out'
            });

            // Efecto de onda rápida en las letras del texto
            if (chars.length > 0) {
                gsap.to(chars, {
                    y: -5,
                    stagger: 0.03,
                    duration: 0.15,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power1.inOut'
                });
            }
        });

        link.addEventListener('mouseleave', () => {
            // Regresar todo suavemente a su posición original
            gsap.to(topPart, { x: 0, y: 0, duration: 0.35, ease: 'power2.out' });
            gsap.to(middlePart, { scale: 1, duration: 0.35, ease: 'power2.out' });
            gsap.to(bottomPart, { x: 0, y: 0, duration: 0.35, ease: 'power2.out' });
        });
    });
});

