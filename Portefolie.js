// Enhanced Portfolio Animations
document.addEventListener('DOMContentLoaded', function() {
  // ------------------- SCROLL ANIMATIONS -------------------
  
  // Intersection Observer options
  const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
  };
  
  // Create observer for scroll animations
  const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              scrollObserver.unobserve(entry.target);
          }
      });
  }, observerOptions);
  
  // Observe all elements with .animated class
  document.querySelectorAll('.animated').forEach(element => {
      scrollObserver.observe(element);
  });
  
  // ------------------- NAVIGATION ENHANCEMENTS -------------------
  
  // Smooth scrolling with dynamic offset based on navbar height
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          const navbarHeight = document.querySelector('.navbar').offsetHeight;
          
          if (targetElement) {
              const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
              
              window.scrollTo({
                  top: targetPosition - navbarHeight - 20,
                  behavior: 'smooth'
              });
              
              // Update active state in navigation
              document.querySelectorAll('.navbutton').forEach(btn => btn.classList.remove('active'));
              this.querySelector('.navbutton') && this.querySelector('.navbutton').classList.add('active');
          }
      });
  });
  
  // Active navigation based on scroll position
  window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      const sections = document.querySelectorAll('section');
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      
      sections.forEach(section => {
          const sectionTop = section.offsetTop - navbarHeight - 100;
          const sectionBottom = sectionTop + section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
              const id = section.getAttribute('id');
              document.querySelectorAll('.navbutton').forEach(btn => {
                  btn.classList.remove('active');
                  if (btn.parentElement.getAttribute('href') === `#${id}`) {
                      btn.classList.add('active');
                  }
              });
          }
      });
  });
  
// Create floating effect for profile image
const profileImg = document.querySelector('.profile-img');
let angle = 0;

const floatAnimation = () => {
    angle += 0.02;
    const y = Math.sin(angle) * 10;
    profileImg.style.transform = `translateY(${y}px)`;
    requestAnimationFrame(floatAnimation);
};

// ------------------- ANIMATED BACKGROUND EFFECT -------------------

/**
 * WavyBackground Class
 * Creates a dynamic animated background with colorful gradient waves
 */
class WavyBackground {
    constructor(options = {}) {
      this.options = {
        targetElement: options.targetElement || 'body',
        colors: options.colors || ['#6c5ce7', '#74b9ff', '#a29bfe', '#81ecec'],
        waveSpeed: options.waveSpeed || 0.01,
        waveHeight: options.waveHeight || 50,
        waveCount: options.waveCount || 3,
        blend: options.blend || 'screen',
        density: options.density || 1,
        interactive: options.interactive !== undefined ? options.interactive : true
      };
      
      // Initialize the background
      this.init();
    }
    
    init() {
      // Create canvas element
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      
      // Set canvas styling
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.zIndex = '-1';
      this.canvas.style.pointerEvents = 'none';
      
      // Append canvas to target element
      const target = document.querySelector(this.options.targetElement);
      if (target === document.body) {
        document.body.insertBefore(this.canvas, document.body.firstChild);
      } else if (target) {
        target.style.position = target.style.position || 'relative';
        target.appendChild(this.canvas);
      } else {
        console.warn(`Target element "${this.options.targetElement}" not found, adding to body instead.`);
        document.body.insertBefore(this.canvas, document.body.firstChild);
      }
      
      // Initialize animation properties
      this.time = 0;
      this.waves = [];
      this.mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        moving: false,
        lastMove: 0
      };
      
      // Generate wave parameters
      this.generateWaves();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Start animation loop
      this.resize();
      this.animate();
    }
    
    generateWaves() {
      this.waves = [];
      
      for (let i = 0; i < this.options.waveCount; i++) {
        // Create waves with randomized properties
        this.waves.push({
          color: this.options.colors[i % this.options.colors.length],
          seed: Math.random() * 10000,
          speed: this.options.waveSpeed * (0.8 + Math.random() * 0.4),
          height: this.options.waveHeight * (0.8 + Math.random() * 0.4),
          frequency: 0.001 + Math.random() * 0.008,
          phase: Math.random() * Math.PI * 2,
          opacity: 0.1 + Math.random() * 0.3
        });
      }
    }
    
    setupEventListeners() {
      // Handle window resize
      window.addEventListener('resize', () => this.resize());
      
      // Handle mouse/touch movements for interactivity
      if (this.options.interactive) {
        window.addEventListener('mousemove', (e) => {
          this.mouse.x = e.clientX;
          this.mouse.y = e.clientY;
          this.mouse.moving = true;
          this.mouse.lastMove = Date.now();
          
          // After 2 seconds of no movement, set moving to false
          setTimeout(() => {
            if (Date.now() - this.mouse.lastMove >= 2000) {
              this.mouse.moving = false;
            }
          }, 2000);
        });
        
        // Touch support for mobile
        window.addEventListener('touchmove', (e) => {
          if (e.touches.length > 0) {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
            this.mouse.moving = true;
            this.mouse.lastMove = Date.now();
            
            setTimeout(() => {
              if (Date.now() - this.mouse.lastMove >= 2000) {
                this.mouse.moving = false;
              }
            }, 2000);
          }
        });
      }
      
      // Handle theme changes
      const themeToggle = document.querySelector('.theme-toggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          const isDarkMode = document.body.classList.contains('dark-mode');
          
          if (isDarkMode) {
            this.options.colors = ['#9f94f0', '#74b9ff', '#a29bfe', '#81ecec'];
            this.options.blend = 'multiply';
          } else {
            this.options.colors = ['#6c5ce7', '#74b9ff', '#a29bfe', '#81ecec'];
            this.options.blend = 'screen';
          }
          
          this.generateWaves();
        });
      }
      
      // Set correct initial theme
      if (document.body.classList.contains('dark-mode')) {
        this.options.colors = ['#9f94f0', '#74b9ff', '#a29bfe', '#81ecec'];
        this.options.blend = 'multiply';
        this.generateWaves();
      }
    }
    
    resize() {
      // Make canvas pixel-perfect for the device
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = window.innerWidth * dpr * this.options.density;
      this.canvas.height = window.innerHeight * dpr * this.options.density;
      this.ctx.scale(dpr * this.options.density, dpr * this.options.density);
    }
    
    drawWave(wave) {
      const { color, seed, speed, height, frequency, phase, opacity } = wave;
      const width = window.innerWidth;
      const yCenter = window.innerHeight / 2;
      
      // Create gradient for the wave
      const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
      
      // Get base color with opacity
      const baseColor = color.replace(/rgba?\(/, '').replace(/\)/, '').split(',');
      const r = parseInt(baseColor[0].trim());
      const g = parseInt(baseColor[1].trim());
      const b = parseInt(baseColor[2].trim());
      
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * 0.8})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${opacity})`);
      
      this.ctx.globalCompositeOperation = this.options.blend;
      this.ctx.fillStyle = gradient;
      
      // Begin the wave path
      this.ctx.beginPath();
      this.ctx.moveTo(0, yCenter);
      
      let curveMultiplier = 1;
      
      // Add interactivity effect if mouse is moving
      if (this.options.interactive && this.mouse.moving) {
        const distX = Math.abs(this.mouse.x - width / 2) / (width / 2);
        const distY = Math.abs(this.mouse.y - yCenter) / (window.innerHeight / 2);
        
        // Adjust wave properties based on mouse position
        curveMultiplier = 1 + (distX * 0.5);
        wave.currentHeight = height + (distY * height * 0.5);
      } else {
        wave.currentHeight = height;
      }
      
      // Draw the wave points
      for (let x = 0; x <= width; x += 10) {
        // Calculate wave equation with time component
        const y = yCenter + 
                Math.sin((x * frequency * curveMultiplier) + phase + (this.time * speed) + seed) * 
                wave.currentHeight;
        
        this.ctx.lineTo(x, y);
      }
      
      // Close the path and fill
      this.ctx.lineTo(width, window.innerHeight);
      this.ctx.lineTo(0, window.innerHeight);
      this.ctx.closePath();
      this.ctx.fill();
    }
    
    animate() {
      // Clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Update the time
      this.time += 1;
      
      // Draw each wave
      this.waves.forEach(wave => this.drawWave(wave));
      
      // Continue the animation loop
      requestAnimationFrame(() => this.animate());
    }
    
    // Method to change colors of the waves
    updateColors(colors) {
      this.options.colors = colors;
      this.generateWaves();
    }
    
    // Method to change wave properties
    updateWaveProperties(properties) {
      Object.assign(this.options, properties);
      this.generateWaves();
    }
    
    // Method to clean up and remove the background
    destroy() {
      if (this.canvas && this.canvas.parentElement) {
        this.canvas.parentElement.removeChild(this.canvas);
      }
      
      window.removeEventListener('resize', this.resize);
      window.removeEventListener('mousemove', this.mousemove);
      window.removeEventListener('touchmove', this.touchmove);
    }
  }
  
  // Initialize the animated background when page loads
  document.addEventListener('DOMContentLoaded', function() {
    // Create wavy background that works in both light and dark modes
    const backgroundEffect = new WavyBackground({
      targetElement: 'body', // Apply to the entire page
      colors: ['#6c5ce7', '#74b9ff', '#a29bfe', '#81ecec'], // Match your color scheme
      waveSpeed: 0.008, // Speed of wave animation
      waveHeight: 80, // Height of waves
      waveCount: 4, // Number of overlapping waves
      blend: 'screen', // Blending mode - 'screen' for light mode
      density: 1, // Quality of the canvas (higher numbers for better quality but slower performance)
      interactive: true // Enable mouse interaction
    });
    
    // Add scroll interaction to reduce wave height when scrolling down
    window.addEventListener('scroll', function() {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const newHeight = 80 * (1 - scrollPercent * 0.7); // Reduce waves as user scrolls
      
      backgroundEffect.updateWaveProperties({
        waveHeight: Math.max(20, newHeight) // Minimum height of 20px
      });
    });
    
    // Check if dark mode is active on page load
    if (localStorage.getItem('darkMode') === 'true') {
      backgroundEffect.updateWaveProperties({
        blend: 'multiply' // Different blend mode for dark theme
      });
      backgroundEffect.updateColors(['#9f94f0', '#74b9ff', '#a29bfe', '#81ecec']);
    }
  });
  
  // Add CSS to make sure the background looks good
  const bgStyleSheet = document.createElement('style');
  bgStyleSheet.textContent = `
    body {
      position: relative;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    /* Make content sections more visible over the background */
    section, .navbar, .card, .form {
    }
    
    /* Add subtle backdrop blur to content sections in dark mode */
    body.dark-mode section, 
    body.dark-mode .card, 
    body.dark-mode .form, 
    body.dark-mode .navbar {
      backdrop-filter: blur(0px);
      transition: backdrop-filter 0.5s ease;
    }
    
    body.dark-mode section:hover, 
    body.dark-mode .card:hover {
      backdrop-filter: blur(2px);
    }
  `;
  
  document.head.appendChild(bgStyleSheet);
  


  // ------------------- HERO SECTION ANIMATIONS -------------------
  
  // Animated text typing effect for landing section
  function typeWriterEffect(element, text, speed = 100) {
      let i = 0;
      element.textContent = '';
      element.style.visibility = 'visible';
      
      function type() {
          if (i < text.length) {
              element.textContent += text.charAt(i);
              i++;
              setTimeout(type, speed);
          }
      }
      
      type();
  }
  
  const qualificationEl = document.querySelector('.qualification');
  if (qualificationEl) {
      const originalText = qualificationEl.textContent;
      qualificationEl.style.visibility = 'hidden';
      
      // Delay the typing effect for a smoother page load experience
      setTimeout(() => {
          typeWriterEffect(qualificationEl, originalText, 70);
      }, 800);
  }
  
  // Parallax effect for hero section elements
  const parallaxElements = document.querySelectorAll('.pinceau, .crayon, .tool, .regle');
  
  window.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      parallaxElements.forEach(element => {
          const speedX = element.dataset.speedX || (Math.random() * 20 - 10);
          const speedY = element.dataset.speedY || (Math.random() * 20 - 10);
          
          const moveX = (x * speedX) - (speedX / 2);
          const moveY = (y * speedY) - (speedY / 2);
          
          element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
  });
  
  // ------------------- SKILLS SECTION ANIMATIONS -------------------
  
  // Animated skill icons with staggered delay
  const skillsSection = document.querySelector('.skills_section');
  const skillIcons = document.querySelectorAll('.img_skills');
  
  if (skillsSection && skillIcons.length) {
      const skillsObserver = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
              skillIcons.forEach((icon, index) => {
                  setTimeout(() => {
                      icon.style.opacity = '1';
                      icon.style.transform = 'translateY(0) scale(1)';
                  }, 150 * index);
              });
              skillsObserver.unobserve(skillsSection);
          }
      }, { threshold: 0.3 });
      
      skillIcons.forEach(icon => {
          icon.style.opacity = '0';
          icon.style.transform = 'translateY(30px) scale(0.8)';
          icon.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      });
      
      skillsObserver.observe(skillsSection);
  }
  
  // ------------------- SERVICES SECTION ANIMATIONS -------------------
  
  // Enhanced hover effects for service cards
  const serviceCards = document.querySelectorAll('.card');
  
  serviceCards.forEach(card => {
      // Create a ripple effect container for each card
      const rippleContainer = document.createElement('div');
      rippleContainer.className = 'ripple-container';
      card.appendChild(rippleContainer);
      
      card.addEventListener('mouseenter', function(e) {
          const cardText = this.querySelector('.card_text');
          if (cardText) {
              cardText.style.transform = 'translateY(-15px)';
              this.style.boxShadow = '0 20px 30px rgba(108, 92, 231, 0.2)';
          }
          
          // Create ripple effect
          const ripple = document.createElement('div');
          ripple.className = 'ripple';
          rippleContainer.appendChild(ripple);
          
          setTimeout(() => {
              ripple.remove();
          }, 1000);
      });
      
      card.addEventListener('mouseleave', function() {
          const cardText = this.querySelector('.card_text');
          if (cardText) {
              cardText.style.transform = 'translateY(0)';
              this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
          }
      });
  });
  
  // ------------------- ABOUT SECTION ANIMATIONS -------------------
  
  // Progressive reveal of about text
  const aboutSection = document.querySelector('#about_me');
  const aboutText = document.querySelector('.about_text');
  
  if (aboutSection && aboutText) {
      const aboutObserver = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
              const text = aboutText.textContent;
              aboutText.textContent = '';
              
              const words = text.split(' ');
              words.forEach((word, index) => {
                  const span = document.createElement('span');
                  span.textContent = word + ' ';
                  span.style.opacity = '0';
                  span.style.transform = 'translateY(10px)';
                  span.style.display = 'inline-block';
                  span.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                  span.style.transitionDelay = `${index * 30}ms`;
                  
                  aboutText.appendChild(span);
                  
                  setTimeout(() => {
                      span.style.opacity = '1';
                      span.style.transform = 'translateY(0)';
                  }, 100);
              });
              
              aboutObserver.unobserve(aboutSection);
          }
      }, { threshold: 0.5 });
      
      aboutObserver.observe(aboutSection);
  }
  
  // ------------------- CV SECTION ANIMATIONS -------------------
  
  // Interactive skill highlights
  const skillHighlights = document.querySelectorAll('.highlight-skill');
  const skillCards = document.querySelectorAll('.skill-card');
  
  if (skillHighlights.length && skillCards.length) {
      skillHighlights.forEach(highlight => {
          highlight.addEventListener('mouseenter', function() {
              const skill = this.getAttribute('data-skill');
              const card = document.getElementById(`${skill}-skill`);
              
              if (card) {
                  // Hide all other cards
                  skillCards.forEach(c => c.classList.remove('active'));
                  
                  // Show this card
                  card.classList.add('active');
                  
                  // Animate skill level bar
                  const skillLevel = card.querySelector('.skill-level');
                  if (skillLevel) {
                      const level = skillLevel.getAttribute('data-level');
                      skillLevel.style.width = `${level}%`;
                  }
              }
          });
      });
      
      // Hide cards when mouse leaves the about section
      document.querySelector('.description_about').addEventListener('mouseleave', function() {
          skillCards.forEach(card => card.classList.remove('active'));
      });
  }
  
  // ------------------- CONTACT FORM ANIMATIONS -------------------
  
  // Form input animations
  const formInputs = document.querySelectorAll('.table_form_text, .table_form_textarea');
  
  formInputs.forEach(input => {
      // Create label for floating label effect
      const wrapper = document.createElement('div');
      wrapper.className = 'input-wrapper';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
      
      const label = document.createElement('span');
      label.className = 'floating-label';
      label.textContent = input.getAttribute('placeholder');
      wrapper.appendChild(label);
      
      // Remove placeholder as we're using the label instead
      input.setAttribute('placeholder', '');
      
      // Handle focus and blur events
      input.addEventListener('focus', function() {
          wrapper.classList.add('focused');
      });
      
      input.addEventListener('blur', function() {
          if (!this.value.trim()) {
              wrapper.classList.remove('focused');
          }
      });
      
      // Check if input already has value (e.g. on page refresh)
      if (input.value.trim()) {
          wrapper.classList.add('focused');
      }
  });
  
  // Form submission animation
  const contactForm = document.querySelector('.form_content');
  const sendButton = document.querySelector('.form_button_send');
  
  if (contactForm && sendButton) {
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const inputs = this.querySelectorAll('input, textarea');
          let isValid = true;
          
          inputs.forEach(input => {
              if (!input.value.trim()) {
                  input.parentNode.classList.add('error');
                  isValid = false;
              } else {
                  input.parentNode.classList.remove('error');
              }
          });
          
          if (isValid) {
              // Button loading state
              sendButton.innerHTML = '<span class="spinner"></span>';
              sendButton.disabled = true;
              
              // Simulate sending (would be replaced with actual form submission)
              setTimeout(() => {
                  // Success animation
                  sendButton.innerHTML = '<i class="fas fa-check"></i> Sent';
                  sendButton.classList.add('success');
                  
                  // Display success message
                  const successMessage = document.createElement('div');
                  successMessage.className = 'success-message';
                  successMessage.innerHTML = '<i class="fas fa-paper-plane"></i> Message sent successfully!';
                  contactForm.appendChild(successMessage);
                  
                  // Reset form
                  setTimeout(() => {
                      inputs.forEach(input => {
                          input.value = '';
                          input.parentNode.classList.remove('focused');
                      });
                      
                      sendButton.innerHTML = 'Send';
                      sendButton.disabled = false;
                      sendButton.classList.remove('success');
                      
                      // Remove success message with fade out
                      successMessage.style.opacity = '0';
                      setTimeout(() => {
                          successMessage.remove();
                      }, 500);
                  }, 3000);
              }, 1500);
          }
      });
  }
  
  // ------------------- DARK MODE TOGGLE -------------------
  
  // Create dark mode toggle if it doesn't exist
  if (!document.querySelector('.theme-toggle')) {
      const themeToggle = document.createElement('button');
      themeToggle.className = 'theme-toggle';
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      themeToggle.setAttribute('aria-label', 'Toggle dark mode');
      document.body.appendChild(themeToggle);
      
      // Check for saved theme preference
      if (localStorage.getItem('darkMode') === 'true') {
          document.body.classList.add('dark-mode');
          themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
      
      // Toggle dark mode with animation
      themeToggle.addEventListener('click', function() {
          document.body.classList.toggle('dark-mode');
          
          // Save preference
          localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
          
          // Animate toggle
          this.classList.add('spin');
          setTimeout(() => {
              this.classList.remove('spin');
          }, 300);
          
          if (document.body.classList.contains('dark-mode')) {
              this.innerHTML = '<i class="fas fa-sun"></i>';
          } else {
              this.innerHTML = '<i class="fas fa-moon"></i>';
          }
      });
  }
  
  // ------------------- PAGE LOAD ANIMATION -------------------
  
  // Create page loader
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
      <div class="loader-content">
          <img src="img/Jodis Logo finale.svg" width="80px" alt="LOGO">
          <div class="loading-bar">
              <div class="loading-progress"></div>
          </div>
      </div>
  `;
  document.body.appendChild(loader);
  
  // Hide loader after page loads
  window.addEventListener('load', () => {
      setTimeout(() => {
          loader.classList.add('loaded');
          setTimeout(() => {
              loader.remove();
          }, 500);
      }, 500);
  });
  
  // If page already loaded
  if (document.readyState === 'complete') {
      loader.classList.add('loaded');
      setTimeout(() => {
          loader.remove();
      }, 500);
  }
  
  // ------------------- CUSTOM CURSOR -------------------
  
  // Create custom cursor elements
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);
  
  // Update cursor position on mouse move
  document.addEventListener('mousemove', (e) => {
      // Position the larger cursor with a slight delay
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      
      // Position the dot cursor immediately
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
  
  // Handle cursor states for interactive elements
  document.querySelectorAll('a, button, .card, .img_skills, .highlight-skill').forEach(element => {
      element.addEventListener('mouseenter', () => {
          cursor.classList.add('cursor-active');
          cursorDot.classList.add('cursor-active');
      });
      
      element.addEventListener('mouseleave', () => {
          cursor.classList.remove('cursor-active');
          cursorDot.classList.remove('cursor-active');
      });
  });
});

// Add required CSS for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  /* Basic Animation Classes */
  .animated {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s ease, transform 0.8s ease;
  }
  
  .animated.in-view {
      opacity: 1;
      transform: translateY(0);
  }
  
  /* Staggered animations for children */
  .animated.in-view > * {
      animation: fadeInUp 0.5s ease forwards;
  }
  
  .animated.in-view > *:nth-child(1) { animation-delay: 0.1s; }
  .animated.in-view > *:nth-child(2) { animation-delay: 0.2s; }
  .animated.in-view > *:nth-child(3) { animation-delay: 0.3s; }
  .animated.in-view > *:nth-child(4) { animation-delay: 0.4s; }
  .animated.in-view > *:nth-child(5) { animation-delay: 0.5s; }
  
  /* Service Card Hover Effects */
  .card {
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                  box-shadow 0.4s ease;
      overflow: hidden;
      position: relative;
  }
  
  .ripple-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
  }
  
  .ripple {
      position: absolute;
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleEffect 1s ease-out;
      top: 50%;
      left: 50%;
      margin-left: -10px;
      margin-top: -10px;
  }
  
  @keyframes rippleEffect {
      from {
          transform: scale(0);
          opacity: 1;
      }
      to {
          transform: scale(30);
          opacity: 0;
      }
  }
  
  /* Form Input Animations */
  .input-wrapper {
      position: relative;
      margin-bottom: 20px;
  }
  
  .floating-label {
      position: absolute;
      top: 15px;
      left: 15px;
      font-size: 16px;
      color: #999;
      pointer-events: none;
      transition: transform 0.3s ease, color 0.3s ease, font-size 0.3s ease;
  }
  
  .input-wrapper.focused .floating-label {
      transform: translateY(-25px) translateX(-5px);
      font-size: 12px;
      color: #6c5ce7;
  }
  
  .input-wrapper.error .table_form_text,
  .input-wrapper.error .table_form_textarea {
      border: 1px solid #ff3860;
      animation: shake 0.5s linear;
  }
  
  .input-wrapper.error .floating-label {
      color: #ff3860;
  }
  
  @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      50% { transform: translateX(10px); }
      75% { transform: translateX(-10px); }
      100% { transform: translateX(0); }
  }
  
  /* Success message animation */
  .success-message {
      background-color: #23d160;
      color: white;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
      text-align: center;
      animation: slideIn 0.5s ease;
      transition: opacity 0.5s ease;
  }
  
  @keyframes slideIn {
      from {
          transform: translateY(-20px);
          opacity: 0;
      }
      to {
          transform: translateY(0);
          opacity: 1;
      }
  }
  
  /* Send button animations */
  .form_button_send {
      position: relative;
      transition: background-color 0.3s ease;
      min-width: 90px;
  }
  
  .form_button_send.success {
      background-color: #23d160;
  }
  
  .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 0.8s ease-in-out infinite;
  }
  
  @keyframes spin {
      to { transform: rotate(360deg); }
  }
  
  /* Theme toggle animation */
  .theme-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #6c5ce7;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000;
      transition: all 0.3s ease;
  }
  
  .theme-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 5px 15px rgba(108, 92, 231, 0.4);
  }
  
  .theme-toggle.spin {
      animation: spinToggle 0.3s ease;
  }
  
  @keyframes spinToggle {
      0% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.2) rotate(180deg); }
      100% { transform: scale(1) rotate(360deg); }
  }
  
  /* Dark mode transitions */
  body {
      transition: background-color 0.5s ease, color 0.5s ease;
  }
  
  body.dark-mode {
      background-color: #121212;
      color: #e0e0e0;
  }
  
  body.dark-mode .navbar,
  body.dark-mode .card_text,
  body.dark-mode .form,
  body.dark-mode .table_form {
      background-color: #1e1e1e !important;
      color: #e0e0e0;
      transition: background-color 0.5s ease, color 0.5s ease;
  }
  
  body.dark-mode .navbutton,
  body.dark-mode .table_form_text,
  body.dark-mode .table_form_textarea {
      background-color: #2d2d2d;
      color: #e0e0e0;
      border-color: #3d3d3d;
      transition: all 0.5s ease;
  }
  
  /* Page loader animation */
  .page-loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      transition: opacity 0.5s ease, visibility 0.5s ease;
  }
  
  body.dark-mode .page-loader {
      background-color: #121212;
  }
  
  .page-loader.loaded {
      opacity: 0;
      visibility: hidden;
  }
  
  .loader-content {
      text-align: center;
  }
  
  .loading-bar {
      width: 200px;
      height: 4px;
      background-color: #f1f1f1;
      border-radius: 2px;
      margin-top: 20px;
      overflow: hidden;
  }
  
  .loading-progress {
      height: 100%;
      width: 0;
      background-color: #6c5ce7;
      animation: progress 1s ease;
      animation-fill-mode: forwards;
  }
  
  @keyframes progress {
      from { width: 0; }
      to { width: 100%; }
  }
  
  /* Custom cursor */
  .custom-cursor {
      position: fixed;
      width: 30px;
      height: 30px;
      border: 1px solid #6c5ce7;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: width 0.3s ease, height 0.3s ease, background-color 0.3s ease, transform 0.1s ease;
  }
  
  .cursor-dot {
      position: fixed;
      width: 8px;
      height: 8px;
      background-color: #6c5ce7;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transform: translate(-50%, -50%);
      transition: transform 0.05s linear;
  }
  
  .custom-cursor.cursor-active {
      width: 50px;
      height: 50px;
      background-color: rgba(108, 92, 231, 0.2);
      border-width: 2px;
  }
  
  .cursor-dot.cursor-active {
      transform: translate(-50%, -50%) scale(0.5);
  }
  
  /* Make cursor invisible when using touch devices */
  @media (pointer: coarse) {
      .custom-cursor, .cursor-dot {
          display: none;
      }
  }
  
  /* CV section skill cards */
  .skill-card {
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%) translateX(50px);
      width: 220px;
      background: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      opacity: 0;
      visibility: hidden;
      transition: transform 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
      z-index: 10;
  }
  
  body.dark-mode .skill-card {
      background: #2d2d2d;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  }
  
  .skill-card.active {
      transform: translateY(-50%) translateX(0);
      opacity: 1;
      visibility: visible;
  }
  
  .skill-bar {
      width: 100%;
      height: 6px;
      background: #f1f1f1;
      border-radius: 3px;
      margin: 10px 0;
      overflow: hidden;
  }
  
  body.dark-mode .skill-bar {
      background: #3d3d3d;
  }
  
  .skill-level {
      height: 100%;
      width: 0;
      background: #6c5ce7;
      transition: width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .highlight-skill {
      position: relative;
      color: #6c5ce7;
      cursor: pointer;
      transition: color 0.3s ease;
  }
  
  .highlight-skill:after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: #6c5ce7;
      transform: scaleX(0);
      transition: transform 0.3s ease;
      transform-origin: right;
  }
  
  .highlight-skill:hover:after {
      transform: scaleX(1);
      transform-origin: left;
  }
  
  /* General animations */
  @keyframes fadeInUp {
      from {
          opacity: 0;
          transform: translateY(20px);
      }
      to {
          opacity: 1;
          transform: translateY(0);
      }
  }
  
  /* Navbar animation */
  .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }
  
  .scroll-navbar {
      background-color: white;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  body.dark-mode .scroll-navbar {
      background-color: #1e1e1e;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
  
  /* Active navigation styles */
  .navbutton.active {
      color: #6c5ce7;
      font-weight: bold;
      position: relative;
  }
  
  .navbutton.active:after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 5px;
      height: 5px;
      background-color: #6c5ce7;
      border-radius: 50%;
  }
`;

document.head.appendChild(styleSheet);

// Add scroll event for navbar
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
      navbar.classList.add('scroll-navbar');
  } else {
      navbar.classList.remove('scroll-navbar');
  }
});