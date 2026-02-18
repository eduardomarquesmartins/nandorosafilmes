// Integração GSAP + ScrollTrigger (SEM LENIS - SCROLL NATIVO)
gsap.registerPlugin(ScrollTrigger);

// Smooth scroll nativo do CSS
document.documentElement.style.scrollBehavior = 'smooth';

console.log('✓ Using native browser scroll (no Lenis)');

// Animação de Entrada Hero
document.addEventListener("DOMContentLoaded", () => {
    // LOADER LOGIC
    const loader = document.getElementById('loader');

    window.addEventListener('load', function () {
        setTimeout(() => {
            if (loader) {
                loader.classList.add('fade-out');
                document.body.classList.remove('loading');
            }
        }, 800);
    });

    // Fallback de seguran?a (3 segundos)
    setTimeout(() => {
        if (loader && !loader.classList.contains('fade-out')) {
            loader.classList.add('fade-out');
            document.body.classList.remove('loading');
        }
    }, 3000);
    const tl = gsap.timeline();

    // Nav
    tl.from(".logo", {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    })
        .from(".nav-links li", {
            y: -20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        }, "-=0.5");

    // Hero Elements Animation
    tl.from(".hero-top-logo", {
        y: -30,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
    }, "-=0.8")
        .from("#hero h1", {
            y: 60,
            opacity: 0,
            duration: 1.8,
            ease: "power4.out"
        }, "-=1")
        .from(".hero-cta", {
            y: 40,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out"
        }, "-=1.2");

    // Header Dynamic Background - Scroll listener nativo
    const header = document.querySelector("header");
    const heroSection = document.getElementById("hero");

    function updateHeader() {
        if (!header || !heroSection) return;
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        if (heroBottom <= 0) {
            header.classList.add("header-scrolled");
        } else {
            header.classList.remove("header-scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader);
    updateHeader(); // Checar estado inicial

    // Mobile Menu Toggle
    const menuToggle = document.getElementById("mobile-menu");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.onclick = function () {
            menuToggle.classList.toggle("active");
            navLinks.classList.toggle("active");
            document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "auto";
        };
    }

    // Close menu when link is clicked
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.onclick = function () {
            if (menuToggle && navLinks) {
                menuToggle.classList.remove("active");
                navLinks.classList.remove("active");
                document.body.style.overflow = "auto";
            }
        };
    });

    // Visual Poetry Animation
    setTimeout(() => {
        const poemLines = document.querySelectorAll(".poem-line");

        console.log('Found poem lines:', poemLines.length);

        if (poemLines.length > 0) {
            // Definir estado inicial usando GSAP
            gsap.set(poemLines, {
                opacity: 0,
                y: 30
            });

            // Criar timeline com ScrollTrigger
            const poetryTl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#visual-poetry",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                    onEnter: () => console.log('Poetry section entered')
                }
            });

            poemLines.forEach((line, i) => {
                const isLast = i === poemLines.length - 1;

                // Fade In + Slide Up
                poetryTl.to(line, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out"
                });

                // Hold (tempo de leitura)
                poetryTl.to(line, {
                    duration: isLast ? 2.5 : 1.5
                });

                // Fade Out + Slide Up (exceto a última linha)
                if (!isLast) {
                    poetryTl.to(line, {
                        opacity: 0,
                        y: -30,
                        duration: 1,
                        ease: "power2.in"
                    });
                }
            });

            console.log('✓ Poetry animation created successfully!');
        } else {
            console.error('✗ No poem lines found');
        }

        // Força atualização dos gatilhos de scroll após o carregamento
        ScrollTrigger.refresh();
    }, 100);

    // Refresh Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ================================================
    // VIDEO FULLSCREEN MODAL
    // ================================================
    const videoModal = document.getElementById('videoModal');
    const videoModalPlayer = document.getElementById('videoModalPlayer');
    const videoModalClose = document.getElementById('videoModalClose');
    const videoModalOverlay = videoModal ? videoModal.querySelector('.video-modal-overlay') : null;

    // Selecionar todos os containers de vídeo clicáveis
    const clickableVideoContainers = document.querySelectorAll('.video-main, .video-item, .pw-item');

    function getVideoSrc(container) {
        const video = container.querySelector('video');
        if (!video) return null;

        // Prioridade 1: currentSrc (URL absoluta resolvida pelo navegador - ideal para GitHub Pages)
        if (video.currentSrc) return video.currentSrc;

        // Prioridade 2: Atributo 'src' direto no <video>
        let sourceUrl = video.getAttribute('src');

        // Prioridade 3: Primeiro elemento <source> dentro do <video>
        if (!sourceUrl || sourceUrl === "") {
            const sourceTag = video.querySelector('source');
            if (sourceTag) sourceUrl = sourceTag.getAttribute('src');
        }

        return sourceUrl;
    }

    function openVideoModal(src) {
        if (!videoModal || !videoModalPlayer || !src) return;

        // Atribuir o novo SRC e forçar o carregamento
        videoModalPlayer.src = src;
        videoModalPlayer.load(); // CRUCIAL para GitHub Pages / Produção

        videoModalPlayer.muted = false; // COM SOM
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Dar play após carregar
        videoModalPlayer.play().catch(() => {
            // Autoplay com áudio pode ser bloqueado - tentar muted como fallback
            console.log('Autoplay com som bloqueado pelo navegador, tentando muted...');
            videoModalPlayer.muted = true;
            videoModalPlayer.play();
        });
    }

    function closeVideoModal() {
        if (!videoModal || !videoModalPlayer) return;
        videoModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        videoModalPlayer.pause();
        // Limpar src após animação de saída
        setTimeout(() => {
            videoModalPlayer.removeAttribute('src');
            videoModalPlayer.load();
        }, 400);
    }

    // Adicionar click em cada container de vídeo
    clickableVideoContainers.forEach(container => {
        container.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const src = getVideoSrc(this);
            if (src) {
                openVideoModal(src);
            }
        });
    });

    // Fechar: botão X
    if (videoModalClose) {
        videoModalClose.addEventListener('click', closeVideoModal);
    }

    // Fechar: clique no overlay de fundo
    if (videoModalOverlay) {
        videoModalOverlay.addEventListener('click', closeVideoModal);
    }

    // Fechar: tecla Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    // ================================================
    // OPTIMIZED VIDEO PLAYBACK (Play on Scroll)
    // ================================================
    const allVideos = document.querySelectorAll('video:not(#videoModalPlayer)');

    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;

                if (entry.isIntersecting) {
                    // Vídeo entrou na tela: Tentar dar play
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            // Autoplay pode ser bloqueado se não estiver muted inicialmente
                            // mas nossos vídeos já têm o atributo 'muted'
                            console.log("Autoplay prevented on scroll:", error);
                        });
                    }
                } else {
                    // Vídeo saiu da tela: Pausar para economizar recursos
                    video.pause();
                }
            });
        }, {
            threshold: 0.15 // Inicia quando 15% do vídeo está visível
        });

        allVideos.forEach(video => {
            videoObserver.observe(video);
        });

        console.log('✓ Video scroll optimization initialized (' + allVideos.length + ' videos monitored)');
    }

    console.log('✓ Video Fullscreen Modal initialized (' + clickableVideoContainers.length + ' clickable videos)');

    // ================================================
    // WHATSAPP CONTACT FORM
    // ================================================
    const whatsappForm = document.getElementById('whatsappForm');
    if (whatsappForm) {
        const dateInput = document.getElementById('date');

        if (dateInput) {
            dateInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
                if (value.length > 8) value = value.slice(0, 8); // Limita a 8 dígitos

                let formattedValue = '';
                if (value.length > 0) {
                    formattedValue = value.slice(0, 2);
                    if (value.length > 2) {
                        formattedValue += '/' + value.slice(2, 4);
                        if (value.length > 4) {
                            formattedValue += '/' + value.slice(4, 8);
                        }
                    }
                }

                e.target.value = formattedValue;
            });

            // Evitar que o usuário apague a barra e ela volte imediatamente ao digitar (melhor UX no backspace)
            dateInput.addEventListener('keydown', function (e) {
                if (e.key === 'Backspace') {
                    const value = e.target.value;
                    if (value.endsWith('/')) {
                        // Se apagar a barra, apaga o número anterior também
                        // e.target.value = value.slice(0, -1);
                    }
                }
            });
        }

        whatsappForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const date = document.getElementById('date').value;
            const message = document.getElementById('message').value;
            const phoneNumber = '5511999999999'; // Substitua pelo seu número (DDI + DDD + Número)

            // Montar a mensagem
            let text = `Olá Nando! Meu nome é ${name}.`;
            if (date) text += ` Gostaria de saber sobre a data ${date}.`;
            text += `\n\nMinha mensagem: ${message}`;

            // Codificar para URL
            const encodedText = encodeURIComponent(text);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

            // Abrir em nova aba
            window.open(whatsappUrl, '_blank');
        });
    }
});
