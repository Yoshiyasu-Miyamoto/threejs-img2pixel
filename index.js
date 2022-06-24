// ページの読み込みを待つ
window.addEventListener('DOMContentLoaded', init);

// シーンを作成
const scene = new THREE.Scene();
let renderer;

/** 画像設定 */
let imageList = []
const img = new Image();
img.crossOrigin = "anonymous";
img.src = './img/kaku.png';
img.onload = function() {
  imageList.push(ImagePixel(this, this.width, this.height, 2.0));

  const geometry = new THREE.BufferGeometry();
  const position = new THREE.BufferAttribute(new Float32Array(imageList[0].position), 3);
  const color = new THREE.BufferAttribute(new Float32Array(imageList[0].color), 3);
  const alpha = new THREE.BufferAttribute(new Float32Array(imageList[0].alpha), 1);
  geometry.setAttribute('position', position);
  geometry.setAttribute('color', color);
  geometry.setAttribute('alpha', alpha);

  const material = new THREE.PointsMaterial({
    vertexColors: THREE.VertexColors,
    size:3,
    transparent:true,
    opacity:1,
    blending:THREE.AdditiveBlending,
    depthTest:false
  });
  const mesh = new THREE.Points(geometry, material);
  scene.add(mesh);
};

/** 画像読み込み時の処理 */
function ImagePixel(path, w, h, ratio) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const width = w;
  const height = h;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(path, 0, 0);
  const data = ctx.getImageData(0, 0, width, height).data;
  const position = [];
  const color = [];
  const alpha = [];

  for (let y = 0; y < height; y += ratio) {
    for (let x = 0; x < width; x += ratio) {
      const index = (y * width + x) * 4;
      const r = data[index] / 255;
      const g = data[index + 1] / 255;
      const b = data[index + 2] / 255;
      const a = data[index + 3] / 255;

      const pX = x - width / 2;
      const pY = -(y - height / 2);
      //const pZ = 0;
      const pZ = Math.max(data[index], data[index + 1], data[index + 2]) / 5;

      position.push(pX, pY, pZ), color.push(r, g, b), alpha.push(a);
    }
  }

  return { position, color, alpha };
}

function init() {
  // サイズを指定
  const width = 960;
  const height = 540;

  // レンダラーを作成
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas'),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(-300, -300, 400);
  //camera.position.set(0, 400, 700);
  const controls = new THREE.OrbitControls(camera, document.body);

  // 地面を作成
  // scene.add(new THREE.GridHelper(600));
  // scene.add(new THREE.AxesHelper(300));

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {    
    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}