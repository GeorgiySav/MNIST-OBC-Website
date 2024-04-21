import React, { useEffect } from "react";
import "./App.css";
import LabeledBar from "./components/LabeledBar";
import { ObcApi } from "./ObcApi";

function App() {
  const service = new ObcApi("http://localhost:18080");

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const contextRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);

  const [model_output, setModelOutput] = React.useState([
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  ]);
  const [prev_output, setPrevOutput] = React.useState([
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  ]);

  // Define a new state variable to force a re-render
  const [render, setRender] = React.useState(false);

  // Use a useEffect hook to update the render state when model_output changes
  useEffect(() => {
    console.log(model_output);
    setRender(!render);
  }, [model_output]);

  const output_dim = 364;
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.width = 28;
    canvas.height = 28;
    canvas.style.width = output_dim.toString() + "px";
    canvas.style.height = output_dim.toString() + "px";
    canvas.style.imageRendering = "pixelated";

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(28 / output_dim, 28 / output_dim);
    context.lineCap = "square";
    context.strokeStyle = "black";
    context.lineWidth = 2;

    contextRef.current = context;
  }, []);

  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX - 0.5, offsetY - 0.5);
    setIsDrawing(true);
  };

  const endDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
    // get the image data from the canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const imageData = context.getImageData(0, 0, 28, 28);
    const rawData = Array.from(imageData.data);
    const processedData: number[] = [];
    for (let i = 3; i < rawData.length; i += 4) {
      processedData.push(rawData[i] / 255.0);
    }
    service.predict(processedData).then((output) => {
      setPrevOutput(model_output);
      setModelOutput(output["prediction"]);
      console.log(model_output);
    });
  };

  const draw = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  useEffect(() => {
    const clear = (event: KeyboardEvent) => {
      if (event.code === "KeyC") {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.clearRect(0, 0, output_dim, output_dim);
        context.beginPath();
        setPrevOutput(model_output);
        setModelOutput([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
      }
    };

    window.addEventListener("keydown", clear);

    return () => {
      window.removeEventListener("keydown", clear);
    };
  }, []);

  return (
    <>
      <div className="">
        <div className="center card card-side bg-base-200 max-h-[392px] shadow-xl w-1/2">
          <figure className="px-4">
            <div
              style={{
                width: output_dim.toString() + "px",
                height: output_dim.toString() + "px",
              }}
              className="bg-base-300"
            >
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={endDrawing}
                onMouseMove={draw}
              ></canvas>
            </div>
          </figure>

          <div className="card-body">
            <div className="card-title">LeNet-5 CNN created with OBC</div>
            <p>Left Mouse: Draw | C: Clear</p>

            <div key={render.toString()} className="grid grid-cols-2 gap-4">
              <LabeledBar
                label="0: "
                prev={prev_output[0]}
                value={model_output[0]}
                max={1.0}
              />
              <LabeledBar
                label="1: "
                prev={prev_output[1]}
                value={model_output[1]}
                max={1.0}
              />
              <LabeledBar
                label="2: "
                prev={prev_output[2]}
                value={model_output[2]}
                max={1.0}
              />
              <LabeledBar
                label="3: "
                prev={prev_output[3]}
                value={model_output[3]}
                max={1.0}
              />
              <LabeledBar
                label="4: "
                prev={prev_output[4]}
                value={model_output[4]}
                max={1.0}
              />
              <LabeledBar
                label="5: "
                prev={prev_output[5]}
                value={model_output[5]}
                max={1.0}
              />
              <LabeledBar
                label="6: "
                prev={prev_output[6]}
                value={model_output[6]}
                max={1.0}
              />
              <LabeledBar
                label="7: "
                prev={prev_output[7]}
                value={model_output[7]}
                max={1.0}
              />
              <LabeledBar
                label="8: "
                prev={prev_output[8]}
                value={model_output[8]}
                max={1.0}
              />
              <LabeledBar
                label="9: "
                prev={prev_output[9]}
                value={model_output[9]}
                max={1.0}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
