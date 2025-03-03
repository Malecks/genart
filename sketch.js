const canvasSketch = require('canvas-sketch')
const { lerp } = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')
const palettes = require('nice-color-palettes')

const settings = {
  dimensions: [2048, 2048],
  suffix: random.getSeed()
};

const sketch = () => {

  random.setSeed(random.getRandomSeed());
  console.log(random.getSeed())

  const margin = 2048*0.2
  const colorCount = random.rangeFloor(1, 6)
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount)

  const createGrid = () => {
    const points = []
    const count = 100
    for (let x = 0; x < count; x ++) {
      for (let y = 0; y < count; y ++) {
        const u = count <= 1 ? 0.5 : x / (count - 1)
        const v = count <= 1 ? 0.5 : y / (count - 1)

        const bwidth = random.range(1.5, 3.5)
        const bheight = Math.abs(random.noise2D(u, v, 0.5, 2)) * 10 + random.range(5, 9)
        points.push({
          color: random.pick(palette),
          position: [ u, v ],
          bwidth,
          bheight,
          rotation: random.noise2D(u, v, .5, 0.5) * 5
        });
      }
    }
    return points;
  };

  const createSecondGrid = () => {
    const points = []
    const count = 5
    const color = random.pick(palette)
    for (let x = 0; x < count; x ++) {
      for (let y = 0; y < count; y ++) {
        const u = count <= 1 ? 0.5 : x / (count - 1)
        const v = count <= 1 ? 0.5 : y / (count - 1)
        const size = Math.abs(random.noise2D(u, v, 0.5, 5) * 20)
        points.push({
          color: color,
          position: [u, v],
          size
        })
        console.log(size)
      }
    }

    return points
  }

  const points = createGrid()
    .filter(() => random.value() > 0.5)

  // const squares = createSecondGrid()

  return ({ context, width, height }) => {

    context.fillStyle = 'white'
    context.fillRect(0, 0, width, height)
    
    points.forEach(data => {
      const {
        color,
        position,
        bwidth,
        bheight,
        rotation
      } = data

      const [u, v] = position;

      const x = lerp(margin, width - margin, u)
      const y = lerp(margin, height - margin, v)

      context.save()
      context.beginPath()
      context.ellipse(x, y, bwidth, bheight, rotation, 0, Math.PI*2, false)
      context.fillStyle = color
      context.globalAlpha = 1
      context.fill()
      context.restore()
    });

    // squares.forEach(data => {
    //   const {
    //     color,
    //     position,
    //     size
    //   } = data

    //   const [u, v] = position;

    //   context.save()
    //   context.fillStyle = color
    //   context.fillRect(u, v, size, size)
    //   context.restore()
    // })

  };
};

canvasSketch(sketch, settings);

// context.fillStyle = color
// context.font = `${radius * width}px "Helvetica"`
// context.translate(x, y)
// context.rotate(rotation)
// context.globalAlpha = 0.7
// context.fillText('-', 0, 0)