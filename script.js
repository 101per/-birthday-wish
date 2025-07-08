// 翻页功能
let currentPage = 0;
const pages = document.querySelectorAll('.page');

function nextPage() {
  if (currentPage < pages.length - 1) {
    pages[currentPage].classList.remove('active');
    currentPage++;
    pages[currentPage].classList.add('active');
  }
}

// 3D 视差滚动效果
let enable3D = false;
let layers = document.querySelectorAll('.parallax-layer');

function init3DEffect() {
  // 添加点击事件，用于触发 iOS 权限请求
  document.body.addEventListener('click', () => {
    if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
      window.DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            enable3D = true;
            document.body.classList.add('enable-3d');
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      enable3D = true;
      document.body.classList.add('enable-3d');
      window.addEventListener('deviceorientation', handleOrientation);
    }
  });
}

function handleOrientation(event) {
  if (!enable3D) return;

  let beta = event.beta;  // 前后倾斜
  let gamma = event.gamma; // 左右倾斜

  layers.forEach(layer => {
    let depth = parseFloat(window.getComputedStyle(layer).transform.split('translateZ(')[1].split('px')[0]);
    let offsetX = gamma * (depth / 10);
    let offsetY = beta * (depth / 10);

    layer.style.transform = `translateX(-50%) translateY(-50%) translateZ(${depth}px) rotateX(${beta}deg) rotateY(${gamma}deg)`;
  });
}

// 初始化 3D 效果
init3DEffect();

// 烟花动画
canvas = document.getElementById('fireworksCanvas');
ctx = canvas.getContext('2d');

let fireworks = [];

function createFirework() {
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height / 2;
  let particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: x,
      y: y,
      radius: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 5 + 2,
      alpha: 1
    });
  }
  fireworks.push(particles);
}

function animateFireworks() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((particles, index) => {
    particles.forEach(p => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.alpha -= 0.01;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    if (particles[0].alpha <= 0) {
      fireworks.splice(index, 1);
    }
  });

  requestAnimationFrame(animateFireworks);
}

// 每隔一段时间生成新的烟花
setInterval(createFirework, 800);
animateFireworks();