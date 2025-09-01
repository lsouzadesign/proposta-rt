document.addEventListener('DOMContentLoaded', function () {
    gsap.registerPlugin(ScrollTrigger);

    // --- Animação de Revelação Simples ---
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(elem => {
        gsap.fromTo(elem,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: elem,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // --- Animação Interativa do Roadmap ---
    const roadmapItems = document.querySelectorAll('.roadmap-item');
    gsap.to("#timeline-progress", {
        height: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: "#roadmap-section",
            start: "top center",
            end: "bottom center",
            scrub: true
        }
    });
    roadmapItems.forEach(item => {
        gsap.from(item, {
            opacity: 0,
            x: 50,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // --- Lógica para Elementos Decorativos ---
    const decoShapes = document.querySelectorAll('.deco-shape');
    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;
        decoShapes.forEach((shape, i) => {
            const factor = (i % 2 === 0 ? -1 : 1) * (i + 1) * 0.1;
            gsap.to(shape, { y: scrollY * factor, ease: 'power2.out', duration: 1 });
        });
    });

    // --- Lógica para o FAQ Accordion ---
    document.querySelectorAll('.faq-header').forEach(header => {
        header.addEventListener('click', event => {
            const faqItem = header.closest('.faq-item');
            const content = faqItem.querySelector('.faq-content');
            const isActive = faqItem.classList.contains('active');

            // Close all items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-content').style.maxHeight = '0px';
            });

            // If the clicked item wasn't active, open it
            if (!isActive) {
                faqItem.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // GSAP Counter Animation
    gsap.utils.toArray(".counting-number").forEach(element => {
        const finalNumber = parseInt(element.dataset.finalNumber, 10);

        let obj = { val: 0 }; // Start from 0

        gsap.to(obj, {
            val: finalNumber,
            duration: 2,
            ease: "power1.inOut",
            snap: { val: 1 },
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            onUpdate: function() {
                if (element.dataset.finalNumber.length > 3) {
                    element.textContent = Math.ceil(obj.val).toLocaleString('pt-BR');
                } else {
                    element.textContent = Math.ceil(obj.val);
                }
            }
        });
    });

    // --- Funções de Animação de Fundo ---

    // Animação 2: Ruído Geométrico (Proposta)
    function createGeometricNoise(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let lines = [];
        const setSize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        setSize();

        class Line {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.life = Math.random() * 200 + 50;
                this.angle = Math.random() * Math.PI * 2;
                this.speed = Math.random() * 0.3 + 0.1;
            }
            update() {
                this.life--;
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.life = 0;
            }
            draw() {
                const opacity = this.life / 100 > 1 ? 1 : this.life / 100;
                ctx.strokeStyle = `rgba(252, 181, 21, ${opacity * 0.7})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + Math.cos(this.angle) * 10, this.y + Math.sin(this.angle) * 10);
                ctx.stroke();
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (lines.length < 100) lines.push(new Line());
            lines = lines.filter(l => l.life > 0);
            lines.forEach(l => { l.update(); l.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
        window.addEventListener('resize', setSize);
    }

    // Animação 3: Linhas de Escaneamento (Roadmap)
    function createScanningLines(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let yPos = 0;
        let direction = 1;
        const setSize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        setSize();

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = `rgba(252, 181, 21, 0.5)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, yPos);
            ctx.lineTo(canvas.width, yPos);
            ctx.stroke();

            yPos += direction * 0.5;
            if (yPos > canvas.height || yPos < 0) direction *= -1;
            requestAnimationFrame(animate);
        }
        animate();
        window.addEventListener('resize', setSize);
    }

    // Animação 5: Partículas de Alinhamento (Alinhamento)
    function createAlignmentParticles(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        const setSize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        setSize();

        class Particle {
            constructor() {
                const edge = Math.floor(Math.random() * 4);
                if (edge === 0) { this.x = 0; this.y = Math.random() * canvas.height; }
                else if (edge === 1) { this.x = canvas.width; this.y = Math.random() * canvas.height; }
                else if (edge === 2) { this.x = Math.random() * canvas.width; this.y = 0; }
                else { this.x = Math.random() * canvas.width; this.y = canvas.height; }
                this.size = Math.random() * 3 + 1;
                this.life = 1;
            }
            update() {
                const dx = canvas.width / 2 - this.x;
                const dy = canvas.height / 2 - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 2) {
                    this.x += dx / 100;
                    this.y += dy / 100;
                }
            }
            draw() {
                ctx.fillStyle = `rgba(252, 181, 21, 0.7)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (particles.length < 80) particles.push(new Particle());
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
        window.addEventListener('resize', setSize);
    }

    // Animação 6: Cruzes Erráticas (Por que eu?)
    function createErraticCrosses(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let crosses = [];
        const setSize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        setSize();

        class Cross {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 10 + 5;
                this.life = Math.random() * 100 + 20;
            }
            draw() {
                const opacity = Math.random() * 0.5 + 0.2;
                ctx.strokeStyle = `rgba(252, 181, 21, ${opacity})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(this.x - this.size, this.y);
                ctx.lineTo(this.x + this.size, this.y);
                ctx.moveTo(this.x, this.y - this.size);
                ctx.lineTo(this.x, this.y + this.size);
                ctx.stroke();
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (crosses.length < 30) crosses.push(new Cross());
            crosses = crosses.filter(c => c.life-- > 0);
            if (Math.random() > 0.9) crosses.push(new Cross());

            crosses.forEach(c => c.draw());
            requestAnimationFrame(animate);
        }
        animate();
        window.addEventListener('resize', setSize);
    }


    // Inicializar todas as animações
    createGeometricNoise('canvas-proposta');
    createScanningLines('canvas-roadmap');
    createAlignmentParticles('canvas-alinhamento');
    createErraticCrosses('canvas-porque');

});
