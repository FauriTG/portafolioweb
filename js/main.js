// ==================== DATOS DE PROYECTOS ====================
        const projectsData = {
    1: {
        icon: "Assets/ImagenSQL.jpg",
        liveUrl: "#",

        es: {
            title: "Sistema de Inventario en SQL",
            fullDescription: "Proyecto desarrollado para mejorar el control de inventario en una tienda. Incluyó el diseño del modelo entidad–relación, normalización de datos, creación de consultas SQL, generación de reportes y optimización básica.",
            features: [
                "Modelo ER normalizado (1FN–3FN)",
                "Consultas avanzadas con JOIN, agregaciones y filtros",
                "Índices para mejorar el rendimiento",
                "Reportes para análisis de ventas",
                "Tablas y procedimientos estructurados"
            ],
            tech: ["MySQL", "SQL Server", "Consultas Avanzadas", "Workbench"]
        },

        en: {
            title: "SQL Inventory System",
            fullDescription: "Project developed to improve inventory control for a retail store. Included ER modeling, normalization, SQL queries, reporting and basic performance optimization.",
            features: [
                "Normalized ER model (1NF–3NF)",
                "Advanced queries with JOIN, aggregations and filters",
                "Indexes for performance improvement",
                "Sales analysis reports",
                "Structured tables and procedures"
            ],
            tech: ["MySQL", "SQL Server", "Advanced Queries", "Workbench"]
        }
    },

    2: {
        icon: "Assets/QA AUTO.jpeg",
        liveUrl: "#",

        es: {
            title: "Automatización con Selenium y JUnit",
            fullDescription: "Automatización básica de pruebas funcionales para validar flujos importantes. Redujo tiempos de prueba manual y detectó errores antes de despliegues.",
            features: [
                "Automatización de flujos funcionales",
                "Validaciones con JUnit",
                "Reducción del 40% de tiempos de prueba",
                "Ejecución repetible sin intervención humana",
                "Scripts escalables y organizados"
            ],
            tech: ["Java", "Selenium WebDriver", "JUnit"]
        },

        en: {
            title: "Automation with Selenium & JUnit",
            fullDescription: "Basic automation of functional test flows, validating critical paths. Reduced manual testing time and detected issues before deployment.",
            features: [
                "Functional flow automation",
                "JUnit validations",
                "40% reduction in testing time",
                "Repeatable execution without manual interaction",
                "Organized and scalable scripts"
            ],
            tech: ["Java", "Selenium WebDriver", "JUnit"]
        }
    },

    3: {
    icon: "Assets/SCREENTIENDA.png",
    liveUrl: "#",

    es: {
        title: "Página Web para Compras en Línea",
        fullDescription:
            "Proyecto enfocado en construir una interfaz clara, moderna y responsiva para un sitio de compras en línea. Incluye catálogo de productos, diseño adaptable para móviles, estilos personalizados en CSS y componentes básicos en JavaScript. Se encuentra en desarrollo con planes de integración a un backend.",
        features: [
            "Diseño completamente responsivo",
            "Catálogo visual de productos",
            "Interactividad con JavaScript",
            "Componentes reutilizables",
            "Preparado para conexión con base de datos"
        ],
        tech: ["HTML5", "CSS3", "JavaScript"]
    },

    en: {
        title: "Online Shopping Website",
        fullDescription:
            "Project focused on building a clean, modern and responsive interface for an online shopping platform. Includes product catalog layouts, mobile-friendly design, custom CSS styling, and basic JavaScript components. Currently in development with future backend integration planned.",
        features: [
            "Fully responsive design",
            "Visual product catalog",
            "Interactivity using JavaScript",
            "Reusable UI components",
            "Ready for database integration"
        ],
        tech: ["HTML5", "CSS3", "JavaScript"]
    }
},


    4: {
    icon: "Assets/Fauricio QuirosLogo.png",
    liveUrl: "#",

    es: {
        title: "Portafolio Web Personal",
        fullDescription:
            "Portafolio profesional desarrollado desde cero utilizando HTML, CSS y JavaScript. Incluye modo oscuro, animaciones con Canvas, diseño moderno optimizado para móviles y tarjetas con efecto 3D. Su objetivo es presentar mis habilidades, experiencia y proyectos de forma clara y atractiva.",
        features: [
            "Diseño moderno y responsivo",
            "Modo claro / oscuro",
            "Animaciones con Canvas API",
            "Tarjetas con efecto 3D",
            "Optimizado para dispositivos móviles"
        ],
        tech: ["HTML5", "CSS3", "JavaScript", "Canvas API"]
    },

    en: {
        title: "Personal Web Portfolio",
        fullDescription:
            "Professional portfolio built from scratch using HTML, CSS and JavaScript. Includes dark/light mode, Canvas animations, modern mobile-optimized layout, and 3D card effects. Designed to clearly showcase my skills, experience, and development projects.",
        features: [
            "Modern and responsive design",
            "Light / dark mode",
            "Canvas API animations",
            "3D card effects",
            "Optimized for mobile devices"
        ],
        tech: ["HTML5", "CSS3", "JavaScript", "Canvas API"]
    }
},

};


        // ==================== PARTICLES ANIMATION ====================
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.color = Math.random() > 0.5 ? '#00d9ff' : '#a855f7';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    this.x -= dx / 20;
                    this.y -= dy / 20;
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const particleCount = window.innerWidth < 768 ? 50 : 100;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.strokeStyle = `rgba(0, 217, 255, ${1 - distance / 150})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // ==================== INTERSECTION OBSERVER (FADE-IN SECTIONS) ====================
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            if (!section.classList.contains('hero')) {
                observer.observe(section);
            }
        });

        // ==================== THEME TOGGLE ====================
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;

        const savedTheme = JSON.parse(localStorage.getItem('theme')) || 'dark';
        html.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
            localStorage.setItem('theme', JSON.stringify(newTheme));
        });

        // ==================== SMOOTH SCROLL ====================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // ==================== MODAL SYSTEM ====================
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');
        const modalClose = document.getElementById('modal-close');

       function openModal(projectId) {
    const project = projectsData[projectId][currentLang];

            
            modalBody.innerHTML = `
    <div class="modal-image">
        <img src="${projectsData[projectId].icon}" style="width: 100%; border-radius: 10px;">
    </div>

    <h2>${project.title}</h2>
    <p class="modal-description">${project.fullDescription}</p>

    <div class="modal-features">
        <h3>${currentLang === "es" ? "Características principales:" : "Main Features:"}</h3>
        <ul>
            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
    </div>

    <div class="tech-tags">
        ${project.tech.map(tech => `<span class='tech-tag'>${tech}</span>`).join('')}
    </div>

    <a href="#" onclick="showLiveUnavailable()" class="modal-link">
        ${currentLang === "es" ? "Ver proyecto en vivo →" : "View live project →"}
    </a>
`;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Event listeners para tarjetas de proyecto
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project');
                openModal(projectId);
            });
        });

        // Cerrar modal
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // ==================== FORM VALIDATION (REMOVED - Using FormSubmit native validation) ====================
        // El formulario ahora usa FormSubmit y validación HTML5 nativa

        // ==================== 3D CARD EFFECT ====================
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });

        // ==================== PERFORMANCE: DEFER HEAVY OPERATIONS ====================
        // Reducir partículas en dispositivos de bajo rendimiento
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            particles = particles.slice(0, 30);
        }

        // Pausar animaciones cuando la pestaña no está visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pausar animaciones pesadas si es necesario
            }
        });
    
function showLiveMessage() {
    const message = document.createElement("div");
    message.className = "live-message";
    message.innerText = "Todavía no está disponible para ver en vivo.";

    document.body.appendChild(message);

    setTimeout(() => {
        message.classList.add("show");
    }, 10);

    setTimeout(() => {
        message.classList.remove("show");
        setTimeout(() => message.remove(), 400);
    }, 2500);

    
}
const translations = {
    es: {
        home: "Inicio",
        projects: "Proyectos",
        contact: "Contacto",
        tagline: "INGENIERO EN SISTEMAS",
        connect: "Conectemos",
        featuredProjects: "Proyectos Destacados",
        contactTitle: "Contacto",
        sendMessage: "Enviar Mensaje",
        liveUnavailable: "Aún no se puede ver este proyecto en vivo",

        // 🔵 PROYECTOS (ES)
        p1_title: "Sistema de Inventario en SQL",
        p1_desc: "Diseño completo del sistema desde el modelo entidad–relación, normalización, consultas avanzadas y optimización.",

        p2_title: "Automatización con Selenium y JUnit",
        p2_desc: "Scripts que redujeron los tiempos de prueba en más de un 40%.",

        p3_title: "Página Web para Compras en Línea",
        p3_desc: "Proyecto en desarrollo usando HTML, CSS y JavaScript.",

        p4_title: "Portafolio Web Personal",
        p4_desc: "Diseño y construcción de mi portafolio profesional.",
    },

    en: {
        home: "Home",
        projects: "Projects",
        contact: "Contact",
        tagline: "SYSTEMS ENGINEER",
        connect: "Let's Connect",
        featuredProjects: "Featured Projects",
        contactTitle: "Contact",
        sendMessage: "Send Message",
        liveUnavailable: "This project is not available to view live yet",

        // 🔵 PROJECTS (EN)
        p1_title: "SQL Inventory System",
        p1_desc: "Complete system design including ER modeling, normalization, advanced queries and optimization.",

        p2_title: "Automation with Selenium & JUnit",
        p2_desc: "Automated scripts that reduced testing times by more than 40%.",

        p3_title: "Online Shopping Website",
        p3_desc: "Project in development using HTML, CSS and JavaScript.",

        p4_title: "Professional Web Portfolio",
        p4_desc: "Design and development of my professional portfolio.",
    }
};

let currentLang = "es";

// Función para cambiar el idioma
function updateLanguage(lang) {
    document.querySelector('a[href="#home"]').textContent = translations[lang].home;
    document.querySelector('a[href="#projects"]').textContent = translations[lang].projects;
    document.querySelector('a[href="#contact"]').textContent = translations[lang].contact;
    document.querySelector(".tagline").textContent = translations[lang].tagline;
    document.querySelector(".cta-button").textContent = translations[lang].connect;
    document.querySelector("#projects h2").textContent = translations[lang].featuredProjects;
    document.querySelector("#contact h2").textContent = translations[lang].contactTitle;
    document.querySelector(".submit-btn").textContent = translations[lang].sendMessage;
    document.getElementById("p1-title").textContent = translations[lang].p1_title;
document.getElementById("p1-desc").textContent = translations[lang].p1_desc;
document.getElementById("p2-title").textContent = translations[lang].p2_title;
document.getElementById("p2-desc").textContent = translations[lang].p2_desc;
document.getElementById("p3-title").textContent = translations[lang].p3_title;
document.getElementById("p3-desc").textContent = translations[lang].p3_desc;
document.getElementById("p4-title").textContent = translations[lang].p4_title;
document.getElementById("p4-desc").textContent = translations[lang].p4_desc;

}

document.getElementById("lang-toggle").addEventListener("click", () => {
    currentLang = currentLang === "es" ? "en" : "es";
    updateLanguage(currentLang);
    document.getElementById("lang-toggle").textContent = currentLang === "es" ? "EN" : "ES";
});

// Inicializar idioma
updateLanguage(currentLang);

function showLiveUnavailable() {
    const alertBox = document.getElementById("live-alert");
    const alertText = document.getElementById("live-alert-text");

    // idioma dinámico
    alertText.textContent = translations[currentLang].liveUnavailable;

    alertBox.classList.remove("hidden");
    alertBox.classList.add("show");

    setTimeout(() => {
        alertBox.classList.remove("show");
        alertBox.classList.add("hidden");
    }, 2500);
}
