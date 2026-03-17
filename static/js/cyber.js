(function () {
  // 粒子画布
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // 背景网格画布
  const bgCanvas = document.createElement('canvas');
  bgCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;';
  document.body.appendChild(bgCanvas);
  const bgCtx = bgCanvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
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

  // 背景网格
  let time = 0;
  function drawGrid() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    const spacing = 40;
    const cols = Math.ceil(bgCanvas.width / spacing) + 1;
    const rows = Math.ceil(bgCanvas.height / spacing) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing;
        const y = j * spacing;

        // 计算离鼠标的距离
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;
        const influence = Math.max(0, 1 - dist / maxDist);

        // 波动偏移
        const offsetX = Math.sin(time * 0.02 + i * 0.5) * 3 * influence;
        const offsetY = Math.cos(time * 0.02 + j * 0.5) * 3 * influence;

        const px = x + offsetX;
        const py = y + offsetY;

        // 颜色根据鼠标距离变化
        const alpha = 0.08 + influence * 0.25;
        const r = Math.floor(0 + influence * 123);
        const g = Math.floor(200 + influence * 55);
        const b = Math.floor(247 - influence * 50);

        bgCtx.beginPath();
        bgCtx.arc(px, py, 1 + influence * 2, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        bgCtx.fill();
      }
    }

    // 连线
    bgCtx.strokeStyle = 'rgba(0, 220, 255, 0.06)';
    bgCtx.lineWidth = 0.5;
    for (let i = 0; i < cols - 1; i++) {
      for (let j = 0; j < rows - 1; j++) {
        const x = i * spacing;
        const y = j * spacing;
        bgCtx.beginPath();
        bgCtx.moveTo(x, y);
        bgCtx.lineTo(x + spacing, y);
        bgCtx.stroke();
        bgCtx.beginPath();
        bgCtx.moveTo(x, y);
        bgCtx.lineTo(x, y + spacing);
        bgCtx.stroke();
      }
    }
  }

  function animate() {
    time++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    drawGrid();
// 随机生成流星
    if (Math.random() < 0.08) meteors.push(new Meteor());
    meteors = meteors.filter(m => !m.isDead());
    meteors.forEach(m => { m.update(); m.draw(); });

    requestAnimationFrame(animate);
  }

  animate();
})();

// 流星雨
  let meteors = [];

  function Meteor() {
    this.x = Math.random() * bgCanvas.width * 2;
    this.y = -20;
    this.length = Math.random() * 150 + 50;
    this.speed = Math.random() * 8 + 4;
    this.opacity = Math.random() * 0.8 + 0.2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  Meteor.prototype.update = function () {
    this.x -= this.speed * 0.5;
    this.y += this.speed;
  };

  Meteor.prototype.draw = function () {
    bgCtx.save();
    bgCtx.globalAlpha = this.opacity;
    bgCtx.strokeStyle = this.color;
    bgCtx.lineWidth = 1.5;
    bgCtx.shadowBlur = 8;
    bgCtx.shadowColor = this.color;
    bgCtx.beginPath();
    bgCtx.moveTo(this.x, this.y);
    bgCtx.lineTo(this.x + this.length * 0.5, this.y - this.length);
    bgCtx.stroke();
    bgCtx.restore();
  };

  Meteor.prototype.isDead = function () {
    return this.y > bgCanvas.height + 100;
  };
