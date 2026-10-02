// hero-animations.js
// using GSAP and ScrollTrigger for high-performance animations

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Hero Content Entrance Animation
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Animate hero text elements
    heroTimeline.fromTo(
        ".pt-32 h1, .pt-32 p, .pt-32 .btn-industrial",
        { y: 50, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            stagger: 0.15,
            clearProps: "all" // clean up after animation to avoid lingering inline styles
        },
        "+=0.2" // slight delay after load
    );

    // 2. Statistics Section ScrollTrigger
    const statsElements = document.querySelectorAll(".bg-\\[\\#0a0a0a\\] .font-impact");
    if (statsElements.length > 0) {
        gsap.fromTo(
            statsElements,
            { y: 40, opacity: 0, scale: 0.9 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".bg-\\[\\#0a0a0a\\]",
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    // 3. Nosotros Section (Confección de ropa industrial)
    const nosotrosTrigger = document.querySelector("#nosotros");
    if (nosotrosTrigger) {
        const leftImage = nosotrosTrigger.querySelector("img");
        const rightContent = nosotrosTrigger.querySelectorAll("h2, p, ul li, a");
        
        // Image comes from left
        gsap.fromTo(leftImage,
            { x: -50, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: nosotrosTrigger,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            }
        );
        
        // Text staggers up
        gsap.fromTo(rightContent,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: nosotrosTrigger,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    // 4. Servicios Section
    const serviciosTrigger = document.querySelector("#servicios");
    if (serviciosTrigger) {
        const serviceCards = serviciosTrigger.querySelectorAll(".service-card");
        
        // Stagger cards up
        gsap.fromTo(serviceCards,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: serviciosTrigger,
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    // Performance: Refresh ScrollTrigger when images load to ensure correct positions
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });
});
