(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  let mouse = { x: 0, y: 0 };
  let particles = [];

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    for (let i = 0; i < 3; i++) {
      particles.push(new Particle(mouse.x, mouse.y, false));
    }
  });

  window.addEventListener('click', e => {
    for (let i = 0; i < 30; i++) {
      particles.push(new Particle(e.clientX, e.clientY, true));
    }
  });

  const colors = ['#00fff7', '#00cfff', '#7b2fff', '#ff2fd8', '#00ff88'];

  function Particle(x, y, explode) {
    this.x = x;
    this.y = y;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.size = explode ? Math.random() * 4 + 2 : Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * (explode ? 8 : 2);
    this.speedY = (Math.random() - 0.5) * (explode ? 8 : 2);
    this.life = explode ? 80 : 40;
    this.maxLife = this.life;
  }

  Particle.prototype.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX *= 0.96;
    this.speedY *= 0.96;
    this.life--;
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  animate();
})();
