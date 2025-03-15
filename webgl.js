// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor("white", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const box = new THREE.BoxGeometry(1, 1, 1);

  // Setup a material
  const palette = random.pick(palettes);

  // Setup a mesh with geometry + material
  for (let index = 0; index < random.range(7, 12); index++) {
    const color = new THREE.MeshStandardMaterial({
      color: random.pick(palette),
    });
    const mesh = new THREE.Mesh(box, color);
    scene.add(mesh);
    mesh.position.set(
      random.range(-.5, .5),
      random.range(-.75, .5), 
      random.range(-.5, .5)
    );
    mesh.scale.set(
      random.range(-2.5, 2.5),
      random.range(.5, 1), 
      random.range(.5, 1)
    );
    mesh.scale.multiplyScalar(0.35);

  }

  const count = 30;
  for (let x = 0; x < count; x++) {
    for (let y = 0; y < count; y++) {
      for (let z = 0; z < count; z++) {
        const color = new THREE.MeshStandardMaterial({
          color: 'white',
        });
        const mesh = new THREE.Mesh(box, color);
        scene.add(mesh);
        mesh.position.set(
          x*0.1,
          y*0.1, 
          z*0.1
        );
        mesh.scale.set(
          0.15, 0.01, 0.01
        );
        mesh.scale.multiplyScalar(0.35);
      }
    }
  }

  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(0, 4, 0);
  scene.add(light);

  scene.add(new THREE.AmbientLight('hsl(257, 10%, 15%)'));

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);

      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 1.5;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      // mesh.rotation.y = time * 0.15;
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
