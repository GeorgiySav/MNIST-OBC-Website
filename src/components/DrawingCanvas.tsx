import React, { Component, MouseEvent } from "react";

type CanvasState = {
  isDrawing: boolean
};

export class DrawingCanvas extends Component<NonNullable<unknown>, CanvasState> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  contextRef: React.RefObject<CanvasRenderingContext2D>; 

  constructor() {
    super({});

    this.canvasRef = React.createRef<HTMLCanvasElement>();
    this.contextRef = React.createRef<CanvasRenderingContext2D>();

    this.state = {
      isDrawing: false
    };
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;

    if (!canvas) return;

    canvas.width = 28;
    canvas.height = 28;
    canvas.style.width = "392px";
    canvas.style.height = "392px";
    canvas.style.imageRendering = "pixelated";

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(28 / 392, 28 / 392);
    context.lineCap = "square";
    context.strokeStyle = "black";
    context.lineWidth = 1;

    this.contextRef.current!.lineCap = context.lineCap;
    this.contextRef.current!.strokeStyle = context.strokeStyle;
    this.contextRef.current!.lineWidth = context.lineWidth;
  }

  startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { nativeEvent } = event;
    const { offsetX, offsetY } = nativeEvent;
    this.contextRef.current?.beginPath();
    this.contextRef.current?.moveTo(offsetX, offsetY);
    this.setState({isDrawing: true});
  };

  endDrawing = () => {
    this.contextRef.current?.closePath();
    this.setState({ isDrawing: false });
  };

  draw = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!this.state.isDrawing) return;
    const { nativeEvent } = event;
    const { offsetX, offsetY } = nativeEvent;
    this.contextRef.current?.lineTo(offsetX, offsetY);
    this.contextRef.current?.stroke();
  };


  render() {
    return (
      <canvas
        ref={this.canvasRef}
        onMouseDown={this.startDrawing}
        onMouseUp={this.endDrawing}
        onMouseMove={this.draw}
      />
    );
  }
}

export default DrawingCanvas;
