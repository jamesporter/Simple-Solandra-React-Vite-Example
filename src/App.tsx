import { useEffect, useRef } from "react"
import { useWindowSize } from "react-use"
import { Line, SCanvas, perlin2 } from "solandra"
import { useControls } from "leva"

function draw(s: SCanvas, c: number) {
  s.background(30, 20, 90)

  s.forTiling({ n: 100, type: "square", margin: 0.1 }, ([x, y], [w, h]) => {
    const n1 = perlin2(x, y)
    const n2 = perlin2(x + 100, Math.sin(y + 234))
    const n3 = perlin2(2 * Math.cos(x + 0), 35 * Math.sin(y + 14))

    if (n3 < 0) return

    s.setStrokeColor(s.gaussian({ mean: c, sd: 3 }), 70, 40, 0.5)
    s.lineWidth = 0.005

    s.draw(
      new Line(s.perturb({ at: [x, y], magnitude: 0.001 }), [
        x + w * 2 * n1,
        y + h * n2,
      ])
    )
  })
}

function App() {
  const { c } = useControls({
    c: {
      value: 190,
      min: 0,
      max: 360,
      step: 1,
    },
  })

  const { width, height } = useWindowSize()

  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const sCanvas = new SCanvas(ctx, {
      width: canvas.width,
      height: canvas.height,
    })
    draw(sCanvas, c)
  }, [width, height, c])

  const size = Math.min(width, height) - 32

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      className="mx-auto my-4 shadow-lg"
    />
  )
}

export default App
