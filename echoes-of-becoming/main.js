/**
 * Echoes of Becoming - Foundation Logic
 * Handles Smooth Scrolling, ScrollTrigger integrations, and Custom Cursor
 */

document.addEventListener("DOMContentLoaded", () => {
    // Utility for splitting text into spans for letter animation
    function splitTextToChars(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const text = el.innerText;
            el.innerHTML = '';
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.className = 'char';
                span.innerHTML = char === ' ' ? '&nbsp;' : char;
                el.appendChild(span);
            });
        });
    }

    // ==========================================================================
    // 1. Lenis Smooth Scrolling Initialization
    // ==========================================================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function for smooth stop
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Request Animation Frame loop for Lenis
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Pause Lenis initially while loading screen is active
    lenis.stop();

    // ==========================================================================
    // 2. GSAP & ScrollTrigger Integration
    // ==========================================================================
    gsap.registerPlugin(ScrollTrigger);

    // Keep ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    
    // Prevent GSAP from causing lag spikes when syncing
    gsap.ticker.lagSmoothing(0);

    // Global Timeline Progress Bar Logic
    // Grows the height of the left line from 0 to 100% as the user scrolls
    gsap.to('.progress-bar', {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.05 // Tiny bit of smoothing on the scrub feels premium
    });

    // ==========================================================================
    // 2.5. Loading Screen Sequence
    // ==========================================================================
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        const monogramPaths = document.querySelectorAll('.monogram-svg path');
        const terminalLoader = document.querySelector('.terminal-loader');
        const loaderBlocks = document.querySelector('.loader-blocks');
        const loaderPercent = document.querySelector('.loader-percent');
        
        // Setup initial SVG state
        monogramPaths.forEach(path => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
        });

        const loaderProxy = { progress: 0 };
        const totalBlocks = 8;
        
        const masterTl = gsap.timeline({
            onComplete: () => {
                loadingScreen.remove();
                lenis.start(); // Re-enable smooth scrolling
                
                // ==========================================================================
                // Hero Reveal Sequence
                // ==========================================================================
                splitTextToChars('.line-1');
                splitTextToChars('.line-2');
                
                const heroTl = gsap.timeline();
                
                // 1. Label types out
                heroTl.to('.hero-label', {
                    opacity: 1,
                    duration: 0.1
                })
                .fromTo('.hero-label', 
                    { textContent: "" }, 
                    { 
                        textContent: "> Initializing your journey...", 
                        duration: 1.5, 
                        ease: "none", 
                        onUpdate: function() {
                            const target = "> Initializing your journey...";
                            const el = document.querySelector('.hero-label');
                            if(el) {
                                const progress = Math.round(this.progress() * target.length);
                                el.innerText = target.substring(0, progress);
                            }
                        }
                    }
                )
                // 2. Letters stagger in
                .to('.char', {
                    opacity: 1,
                    y: 0,
                    stagger: 0.02,
                    duration: 0.8,
                    ease: 'power4.out'
                }, "-=0.5")
                // 3. Subtext fades up
                .to('.hero-subtext', {
                    opacity: 0.7,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out'
                }, "-=0.4")
                // 4. Counters fade in
                .to('.hero-counters', {
                    opacity: 1,
                    duration: 0.5
                }, "-=0.5");
                
                // Counter animation
                const counterVals = document.querySelectorAll('.counter-value .val');
                counterVals.forEach(val => {
                    const target = parseInt(val.getAttribute('data-target'));
                    gsap.to(val, {
                        innerHTML: target,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { innerHTML: 1 },
                        delay: 1.5
                    });
                });
                
                // 5. CTA Button and scroll indicator fade in
                gsap.to(['.magnetic-btn', '.scroll-indicator'], {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.2,
                    delay: 2,
                    ease: 'power2.out'
                });
            }
        });

        // Fade in terminal text
        masterTl.to(terminalLoader, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
        }, 0);

        // Draw the SVG lines
        masterTl.to(monogramPaths, {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power3.inOut'
        }, 0.2);

        // Terminal block counter animation
        masterTl.to(loaderProxy, {
            progress: 100,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                const percent = Math.round(loaderProxy.progress);
                loaderPercent.textContent = `${percent}%`;
                
                const activeBlocks = Math.floor((percent / 100) * totalBlocks);
                let blockString = '';
                for(let i = 0; i < totalBlocks; i++) {
                    blockString += (i < activeBlocks) ? '█' : '&nbsp;';
                }
                loaderBlocks.innerHTML = blockString;
            }
        }, 0.2);

        // Fill the inner/outer SVG towards the end
        masterTl.to('.monogram-path', {
            fill: 'rgba(200, 255, 0, 0.1)', // Subtle premium glow inside
            duration: 1,
            ease: 'power2.out'
        }, 1.4);

        // Subtle bloom flash
        masterTl.to('.bloom-flash', {
            opacity: 0.08,
            duration: 0.4,
            ease: 'power1.inOut'
        }, 2.0);

        // Fade out overlay seamlessly, preserving background so we see the hero behind
        masterTl.to(loadingScreen, {
            opacity: 0,
            duration: 1.2,
            ease: 'power2.inOut'
        }, 2.4);
    }

    // ==========================================================================
    // 3. Cinematic Custom Cursor
    // ==========================================================================
    const cursor = document.querySelector('.cursor');
    const cursorTrail = document.querySelector('.cursor-trail');

    // Store mouse coordinates
    const cursorState = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 2
    };

    const trailState = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 2
    };

    // Update targets on mouse move
    window.addEventListener('mousemove', (e) => {
        cursorState.targetX = e.clientX;
        cursorState.targetY = e.clientY;
        
        trailState.targetX = e.clientX;
        trailState.targetY = e.clientY;
    });

    // Render loop for the cursor (using LERP for smooth trailing)
    function renderCursor() {
        // Main dot - very fast response
        cursorState.x += (cursorState.targetX - cursorState.x) * 0.4;
        cursorState.y += (cursorState.targetY - cursorState.y) * 0.4;
        
        // Trailing ring - slower response for emotional/cinematic lag
        trailState.x += (trailState.targetX - trailState.x) * 0.12;
        trailState.y += (trailState.targetY - trailState.y) * 0.12;
        
        // Apply transforms
        cursor.style.transform = `translate(${cursorState.x}px, ${cursorState.y}px) translate(-50%, -50%)`;
        cursorTrail.style.transform = `translate(${trailState.x}px, ${trailState.y}px) translate(-50%, -50%)`;
        
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover effect bindings
    const bindHoverEffects = () => {
        const interactiveElements = document.querySelectorAll('a, button, [data-cursor="hover"]');
        
        interactiveElements.forEach(el => {
            // Remove existing listeners if any to prevent duplicates on re-render
            el.removeEventListener('mouseenter', handleMouseEnter);
            el.removeEventListener('mouseleave', handleMouseLeave);
            
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });
    };

    const handleMouseEnter = () => document.body.classList.add('hovering');
    const handleMouseLeave = () => document.body.classList.remove('hovering');

    // Initial binding
    bindHoverEffects();
    
    // ==========================================================================
    // 4. Three.js Hero Background (Universe & Orbit)
    // ==========================================================================
    const initThreeJS = () => {
        const canvas = document.getElementById('hero-webgl');
        if (!canvas) return;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x03020A, 0.0015);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particles (Stardust)
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2500;
        const posArray = new Float32Array(particlesCount * 3);
        const colorsArray = new Float32Array(particlesCount * 3);

        const colorWhite = new THREE.Color(0xFFFFFF);
        const colorCyan = new THREE.Color(0x00D4FF);

        for (let i = 0; i < particlesCount * 3; i+=3) {
            posArray[i] = (Math.random() - 0.5) * 120;
            posArray[i+1] = (Math.random() - 0.5) * 120;
            posArray[i+2] = (Math.random() - 0.5) * 100;

            const mixColor = Math.random() > 0.8 ? colorCyan : colorWhite;
            colorsArray[i] = mixColor.r;
            colorsArray[i+1] = mixColor.g;
            colorsArray[i+2] = mixColor.b;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.12,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Orbit Element (The Core)
        const orbitGroup = new THREE.Group();
        orbitGroup.position.set(-15, 0, 0);

        const sphereGeo = new THREE.SphereGeometry(1.5, 32, 32);
        const sphereMat = new THREE.MeshBasicMaterial({ color: 0xC8FF00 });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        orbitGroup.add(sphere);

        const light = new THREE.PointLight(0xC8FF00, 2, 20);
        orbitGroup.add(light);

        const torusGeo = new THREE.TorusGeometry(4, 0.05, 32, 100);
        const torusMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.3 });
        const torus = new THREE.Mesh(torusGeo, torusMat);
        torus.rotation.x = Math.PI / 2.5;
        torus.rotation.y = Math.PI / 4;
        orbitGroup.add(torus);

        scene.add(orbitGroup);

        // Resize handler
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            
            if(window.innerWidth < 768) {
                orbitGroup.position.set(0, 5, -10);
            } else {
                orbitGroup.position.set(-15, 0, 0);
            }
        });
        
        if(window.innerWidth < 768) orbitGroup.position.set(0, 5, -10);

        // Mouse Parallax Interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        const clock = new THREE.Clock();

        const tick = () => {
            const elapsedTime = clock.getElapsedTime();

            particlesMesh.rotation.y = elapsedTime * 0.015;
            particlesMesh.rotation.x = elapsedTime * 0.008;

            torus.rotation.z = elapsedTime * 0.5;
            orbitGroup.position.y = Math.sin(elapsedTime * 0.5) * 0.5;

            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            particlesMesh.rotation.y += 0.05 * (mouseX - particlesMesh.rotation.y);
            particlesMesh.rotation.x += 0.05 * (-mouseY - particlesMesh.rotation.x);

            orbitGroup.rotation.y += 0.05 * (mouseX * 0.5 - orbitGroup.rotation.y);
            orbitGroup.rotation.x += 0.05 * (-mouseY * 0.5 - orbitGroup.rotation.x);

            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        };
        tick();
    };
    initThreeJS();

    // ==========================================================================
    // 5. Magnetic Button Logic
    // ==========================================================================
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.5,
                ease: 'power3.out'
            });
            
            gsap.to(btn.querySelector('.btn-text'), {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.5,
                ease: 'power3.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
            gsap.to(btn.querySelector('.btn-text'), { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
        });
        
        btn.addEventListener('click', () => {
            lenis.scrollTo('#introduction', { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        });
    });

    // ==========================================================================
    // 6. Ambient Audio Toggle
    // ==========================================================================
    const soundToggle = document.querySelector('.sound-toggle');
    const ambientAudio = document.getElementById('ambient-audio');
    let isPlaying = false;

    if (soundToggle && ambientAudio) {
        soundToggle.addEventListener('click', () => {
            if (isPlaying) {
                ambientAudio.pause();
                soundToggle.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <line x1="23" y1="9" x2="17" y2="15"></line>
                        <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                `;
            } else {
                ambientAudio.play().catch(e => console.log("Audio playback prevented", e));
                soundToggle.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                `;
            }
            isPlaying = !isPlaying;
        });
    }

    // ==========================================================================
    // 7. Scroll Indicator Animations
    // ==========================================================================
    gsap.to('.scroll-indicator .chevron', {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: 'power1.inOut'
    });
    
    gsap.to('.scroll-indicator', {
        opacity: 0,
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: '50px top',
            scrub: true
        }
    });

    // ==========================================================================
    // 8. Introduction Section Logic
    // ==========================================================================

    // A. 3D Hologram Tilt
    const hologramWrapper = document.querySelector('.hologram-wrapper');
    const hologramCard = document.querySelector('.hologram-card');
    
    if(hologramWrapper && hologramCard) {
        hologramWrapper.addEventListener('mousemove', (e) => {
            const rect = hologramWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg tilt
            const rotateY = ((x - centerX) / centerX) * 15;
            
            gsap.to(hologramCard, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        hologramWrapper.addEventListener('mouseleave', () => {
            gsap.to(hologramCard, {
                rotateX: 0,
                rotateY: 0,
                duration: 1,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    }

    // B. Constellation Generation
    const skills = [
        { label: 'HTML', desc: 'The skeletal structure' },
        { label: 'CSS', desc: 'The aesthetic skin' },
        { label: 'JavaScript', desc: 'The nervous system' },
        { label: 'React', desc: 'Component architecture' },
        { label: 'Python', desc: 'Backend & scripting' },
        { label: 'ML', desc: 'Data & inference' },
        { label: 'Blockchain', desc: 'Decentralized logic' },
        { label: 'Node', desc: 'Server environments' },
        { label: 'Git', desc: 'Version history' },
        { label: 'Figma', desc: 'Interface design' },
        { label: 'Problem Solving', desc: 'Algorithmic thinking' },
        { label: 'Curiosity', desc: 'The driving force' },
        { label: 'Consistency', desc: 'Daily compounding' },
        { label: 'Leadership', desc: 'Guiding teams' },
        { label: 'Open Source', desc: 'Community collaboration' }
    ];

    const constellationContainer = document.querySelector('.constellation-container');
    const starsContainer = document.querySelector('.constellation-stars');
    const linesSvg = document.querySelector('.constellation-lines');
    
    if(constellationContainer && starsContainer && linesSvg) {
        const starElements = [];
        
        skills.forEach((skill) => {
            // Random coordinates 10% to 90%
            const x = 10 + Math.random() * 80;
            const y = 10 + Math.random() * 80;
            
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.setAttribute('data-cursor', 'hover');
            
            const tooltip = document.createElement('div');
            tooltip.className = 'star-tooltip';
            tooltip.innerHTML = `<strong>${skill.label}</strong><br><span style="opacity:0.7;font-size:0.65rem;">${skill.desc}</span>`;
            
            star.appendChild(tooltip);
            starsContainer.appendChild(star);
            
            starElements.push({ x, y, el: star });
        });
        
        // Draw lines connecting closest stars
        starElements.forEach((star, i) => {
            const others = starElements.filter((s, index) => index !== i).map(s => {
                const dist = Math.sqrt(Math.pow(s.x - star.x, 2) + Math.pow(s.y - star.y, 2));
                return { ...s, dist };
            }).sort((a, b) => a.dist - b.dist);
            
            for(let j = 0; j < 2; j++) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute('x1', `${star.x}%`);
                line.setAttribute('y1', `${star.y}%`);
                line.setAttribute('x2', `${others[j].x}%`);
                line.setAttribute('y2', `${others[j].y}%`);
                
                const length = 1000;
                line.style.strokeDasharray = length;
                line.style.strokeDashoffset = length;
                line.classList.add('c-line');
                
                linesSvg.appendChild(line);
            }
        });
    }

    // C. ScrollTrigger Intro Animations
    const introSection = document.querySelector('.intro-section');
    if(introSection) {
        const introTl = gsap.timeline({
            scrollTrigger: {
                trigger: introSection,
                start: 'top 70%',
            }
        });
        
        introTl.from('.intro-left', {
            x: -100,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        }, 0);
        
        introTl.from('.intro-right > *:not(.intro-cards)', {
            x: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: 'power3.out'
        }, 0.2);
        
        introTl.from('.stat-card', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out'
        }, "-=0.8");
        
        const introStatVals = document.querySelectorAll('.intro-section .stat-val');
        introTl.add(() => {
            introStatVals.forEach(val => {
                const target = parseInt(val.getAttribute('data-target'));
                gsap.to(val, {
                    innerHTML: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { innerHTML: 1 }
                });
            });
        }, "-=0.4");
        
        introTl.from('.star', {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'back.out(1.7)'
        }, "-=0.5");
        
        introTl.to('.c-line', {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: 'power2.inOut',
            stagger: 0.02
        }, "-=0.5");
        
        if(window.innerWidth > 900) {
            gsap.to('.constellation-container', {
                rotation: 2,
                x: 10,
                y: -10,
                duration: 10,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }

    // Re-bind hover effects to newly injected UI elements
    bindHoverEffects();
});
