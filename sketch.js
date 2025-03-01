const canvasSketch = require('canvas-sketch')
const { lerp } = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')
const palettes = require('nice-color-palettes')

const settings = {
  dimensions: [2048, 2048],
  suffix: random.getSeed()
  // dimensions: 'A4',
  // pixelsPerInch: 300,
  // units: 'cm'
};

const sketch = () => {

  random.setSeed(random.getRandomSeed());
  console.log(random.getSeed())

  const margin = 2048*0.2
  const colorCount = random.rangeFloor(1, 6)
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount)

  const createGrid = () => {
    const points = []
    const count = 50
    for (let x = 0; x < count; x ++) {
      for (let y = 0; y < count; y ++) {
        const u = count <= 1 ? 0.5 : x / (count - 1)
        const v = count <= 1 ? 0.5 : y / (count - 1)
        const radius = Math.abs((random.noise2D(u, v, 1.5)) * 0.15)
        points.push({
          color: random.pick(palette),
          position: [ u, v ],
          radius,
          rotation: random.noise2D(u, v, 0.1) * 2
        });
      }
    }
    return points;
  };

  const points = createGrid()
    .filter(() => random.value() > 0.15)

  return ({ context, width, height }) => {
    context.fillStyle = 'white'
    context.fillRect(0, 0, width, height)

    points.forEach(data => {
      const {
        color,
        position,
        radius,
        rotation
      } = data;

      const [u, v] = position;

      const x = lerp(margin, width - margin, u)
      const y = lerp(margin, height - margin, v)


      context.save()
      // context.beginPath()
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false)
      // context.fillStyle = color
      // context.globalAlpha = 0.7
      // context.fill()

      context.fillStyle = color
      context.font = `${radius * width}px "Helvetica"`
      context.translate(x, y)
      context.rotate(rotation)
      context.globalAlpha = 0.7
      context.fillText('—', 0, 0)

      context.restore()
    });

  };
};

canvasSketch(sketch, settings);
