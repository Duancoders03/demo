// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initTypewriter();
  initGsapAnimations();
  initCardTilt();
  initProjectModal();
});

/* =========================================================================
   1. CANVAS PARTICLE SYSTEM
   ========================================================================= */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  const particles = [];
  const properties = {
    particleColor: 'rgba(0, 242, 254, 0.25)',
    lineColor: 'rgba(155, 81, 224, 0.12)',
    particleRadius: 2.5,
    particleCount: calculateCount(),
    particleMaxSpeed: 0.6,
    lineLength: 120,
    mouseRadius: 160
  };

  function calculateCount() {
    // Fewer particles on smaller screens
    return window.innerWidth < 768 ? 40 : 100;
  }

  let mouse = { x: null, y: null };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    properties.particleCount = calculateCount();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.velocityX = (Math.random() - 0.5) * properties.particleMaxSpeed;
      this.velocityY = (Math.random() - 0.5) * properties.particleMaxSpeed;
    }

    position() {
      // Bounce boundaries
      if (this.x + this.velocityX > width || this.x + this.velocityX < 0) {
        this.velocityX = -this.velocityX;
      }
      if (this.y + this.velocityY > height || this.y + this.velocityY < 0) {
        this.velocityY = -this.velocityY;
      }
      this.x += this.velocityX;
      this.y += this.velocityY;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
      ctx.fillStyle = properties.particleColor;
      ctx.fill();
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        
        if (dist < properties.lineLength) {
          const alpha = 1 - (dist / properties.lineLength);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(155, 81, 224, ${alpha * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      
      // Connect to mouse
      if (mouse.x !== null && mouse.y !== null) {
        const mouseDist = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
        if (mouseDist < properties.mouseRadius) {
          const alpha = 1 - (mouseDist / properties.mouseRadius);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    particles.length = 0;
    for (let i = 0; i < properties.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    
    // Smooth grid lines
    drawLines();
    
    particles.forEach(p => {
      p.position();
      p.draw();
    });
    
    requestAnimationFrame(loop);
  }

  init();
  loop();
}

/* =========================================================================
   2. NAVBAR & HEADER ACTIONS
   ========================================================================= */
function initNavbar() {
  const header = document.querySelector('header');
  const menuToggle = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-item');

  // Sticky navbar logic
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Highlight Active Nav Links based on Scroll Section
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href').includes(current)) {
        item.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.classList.replace('fa-bars-staggered', 'fa-xmark');
    } else {
      icon.classList.replace('fa-xmark', 'fa-bars-staggered');
    }
  });

  // Close mobile menu on item click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars-staggered');
    });
  });
}

/* =========================================================================
   3. TYPEWRITER EFFECT
   ========================================================================= */
function initTypewriter() {
  const words = ["Kỹ sư phần mềm.", "UI/UX Designer.", "Creative Technologist.", "Lập trình viên Front-End."];
  let i = 0;
  let timer;

  function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function() {
      if (word.length > 0) {
        document.getElementById('typewriter-text').innerHTML += word.shift();
      } else {
        setTimeout(deletingEffect, 2000);
        return false;
      }
      timer = setTimeout(loopTyping, 100);
    };
    loopTyping();
  }

  function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function() {
      if (word.length > 0) {
        word.pop();
        document.getElementById('typewriter-text').innerHTML = word.join("");
      } else {
        if (words.length > (i + 1)) {
          i++;
        } else {
          i = 0;
        }
        setTimeout(typingEffect, 500);
        return false;
      }
      timer = setTimeout(loopDeleting, 60);
    };
    loopDeleting();
  }

  typingEffect();
}

/* =========================================================================
   4. GSAP SCROLLTRIGGER ANIMATIONS
   ========================================================================= */
function initGsapAnimations() {
  // Hero entry animation sequence
  const heroTl = gsap.timeline();
  heroTl.to('.hero-subtitle-top', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 })
        .to('.hero-title', { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }, '-=0.5')
        .to('.hero-typewriter', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .to('.scroll-indicator', { opacity: 1, duration: 0.5 }, '-=0.2');

  // Generic Reveal Headers animations
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%'
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out'
    });
  });

  // Bio Stats Counter-up Animation
  const statsSection = document.querySelector('.about-stats');
  if (statsSection) {
    const statsNumbers = document.querySelectorAll('.stat-number');
    gsap.from(statsNumbers, {
      scrollTrigger: {
        trigger: statsSection,
        start: 'top 85%'
      },
      duration: 2,
      innerText: 0,
      snap: { innerText: 1 },
      ease: 'power2.out'
    });
  }

  // Skills Progress Bars reveal
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach(card => {
    const progress = card.querySelector('.skill-progress');
    const width = progress.getAttribute('data-width');
    
    gsap.to(progress, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%'
      },
      width: width,
      duration: 1.5,
      ease: 'power4.out'
    });
  });

  // Projects staggered card entry
  gsap.from('.project-card', {
    scrollTrigger: {
      trigger: '.projects-grid',
      start: 'top 80%'
    },
    opacity: 0,
    y: 60,
    duration: 1.2,
    stagger: 0.2,
    ease: 'power3.out'
  });

  // Timeline Slide-In Reveal
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    const xVal = index % 2 === 0 ? -100 : 100;
    
    gsap.from(item.querySelector('.timeline-content'), {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%'
      },
      opacity: 0,
      x: xVal,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from(item.querySelector('.timeline-dot'), {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%'
      },
      scale: 0,
      duration: 0.5,
      ease: 'back.out(2)'
    });
  });

  // Contact elements reveal
  gsap.from('.contact-info', {
    scrollTrigger: {
      trigger: '.contact-container',
      start: 'top 85%'
    },
    opacity: 0,
    x: -50,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.from('.contact-form', {
    scrollTrigger: {
      trigger: '.contact-container',
      start: 'top 85%'
    },
    opacity: 0,
    x: 50,
    duration: 1,
    ease: 'power3.out'
  });
}

/* =========================================================================
   5. 3D TILT EFFECT ON CARDS
   ========================================================================= */
function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');
  
  // Disable 3D tilt on smaller/mobile devices for performance
  if (window.innerWidth < 1024) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const cardRect = card.getBoundingClientRect();
      
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;
      
      // Coordinate values relative to the card center (-0.5 to 0.5)
      const mouseX = (e.clientX - cardRect.left) / cardWidth - 0.5;
      const mouseY = (e.clientY - cardRect.top) / cardHeight - 0.5;
      
      // Calculate rotation intensities (max 10 degrees)
      const rotateX = -mouseY * 15;
      const rotateY = mouseX * 15;

      // Transform translation and rotations
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* =========================================================================
   6. INTERACTIVE PROJECT DETAILS MODAL
   ========================================================================= */
const projectsDb = {
  1: {
    title: "Aether Dashboard Analytics",
    tags: ["Web App", "React", "Analytics", "Tailwind"],
    image: "assets/project_1.png",
    client: "Helix Solutions LLC",
    date: "Tháng 03, 2026",
    role: "Lead Front-end Developer",
    body: `<p>Aether Dashboard là một ứng dụng phân tích đám mây thông minh được thiết kế đặc biệt cho các kỹ sư Devops và giám sát viên hạ tầng công nghệ cao. Dự án yêu cầu hệ thống thu nhận dữ liệu lên tới 10,000 sự kiện/giây và kết xuất biểu đồ đồ họa mượt mà không gặp hiện tượng trễ hoặc đứng hình.</p>
           <p>Tôi đã thiết kế hệ thống luồng dữ liệu tối ưu hóa bằng React Context kết hợp với Web Workers để phân phối tính toán phân tích biểu đồ ra ngoài tiến trình UI. Canvas rendering được ứng dụng tối đa cho các biểu đồ thời gian thực.</p>
           <p>Hơn thế nữa, hệ thống theme của dashboard được phát triển dưới dạng kiến trúc modular CSS Variables cao cấp, cho phép tùy chỉnh màu nền theo nhu cầu khách hàng doanh nghiệp hoặc chuyển trạng thái Dark/Light mode chỉ với 1 click.</p>`,
    link: "#"
  },
  2: {
    title: "Valo DeFi Crypto Wallet",
    tags: ["Mobile App", "React Native", "Crypto", "UI/UX"],
    image: "assets/project_2.png",
    client: "Valo Cryptic Foundation",
    date: "Tháng 12, 2025",
    role: "UI/UX & Mobile Developer",
    body: `<p>Valo Wallet là một sản phẩm ví tài sản phi tập trung thế hệ mới tập trung tối đa vào tính năng bảo mật và trải nghiệm tối giản hóa. Dự án giải quyết bài toán lớn về sự phức tạp trong quản lý khóa bảo mật và cụm từ hạt giống (seed phrase) cho người mới tham gia thị trường.</p>
           <p>Giao diện ứng dụng sử dụng phong cách Glassmorphic kết hợp các lớp mờ chồng khéo léo để tạo chiều sâu trực quan trên thiết bị di động. Biểu đồ thay đổi số dư được phát triển với hiệu ứng hoạt họa mượt mà sử dụng React Native Reanimated.</p>
           <p>Chúng tôi đã tích hợp trực tiếp cổng hoán đổi (Swap API) và staking thông qua hợp đồng thông minh, giúp người dùng tiết kiệm thời gian tương tác với mạng lưới lên đến 60%.</p>`,
    link: "#"
  },
  3: {
    title: "Chronos 3D WebGL Sphere",
    tags: ["Creative Web", "ThreeJS", "WebGL", "GSAP"],
    image: "assets/project_3.png",
    client: "Chronos Time Museum",
    date: "Tháng 08, 2025",
    role: "Creative Interactive Developer",
    body: `<p>Dự án Chronos 3D Sphere được xây dựng để kỷ niệm triển lãm kỹ thuật số lớn của Bảo tàng Thời gian Chronos. Giao diện trang web dẫn dắt người xem qua lịch sử dòng chảy của thời gian từ cổ đại tới kỷ nguyên số thông qua mô hình tương tác 3D WebGL.</p>
           <p>Tôi đã sử dụng ThreeJS cùng với custom GLSL shaders để sinh ra một quả cầu năng lượng phát sáng khổng lồ gồm hơn 50,000 hạt particles nhỏ tự chuyển động theo quỹ đạo xoắn ốc Fibonacci.</p>
           <p>Mỗi lần cuộn trang, GSAP ScrollTrigger sẽ điều chỉnh tọa độ Camera và thay đổi màu sắc phát sáng của hạt năng lượng tương ứng với các cột mốc lịch sử, tạo cảm giác vô cùng lôi cuốn và trực quan sinh động.</p>`,
    link: "#"
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const projectCards = document.querySelectorAll('.project-card');

  // Modal elements
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalTags = document.getElementById('modalTags');
  const modalClient = document.getElementById('modalClient');
  const modalDate = document.getElementById('modalDate');
  const modalRole = document.getElementById('modalRole');
  const modalBody = document.getElementById('modalBody');
  const modalLink = document.getElementById('modalLink');

  function openModal(id) {
    const data = projectsDb[id];
    if (!data) return;

    modalImg.src = data.image;
    modalTitle.textContent = data.title;
    modalClient.textContent = data.client;
    modalDate.textContent = data.date;
    modalRole.textContent = data.role;
    modalBody.innerHTML = data.body;
    modalLink.href = data.link;

    // Populate tags
    modalTags.innerHTML = '';
    data.tags.forEach(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      modalTags.appendChild(span);
    });

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scroll
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-project');
      openModal(id);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);

  // Close on overlay background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
