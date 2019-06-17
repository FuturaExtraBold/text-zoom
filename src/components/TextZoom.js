import React, { Component } from "react";

import { ReactComponent as Logo } from "../images/ipad_logo.svg";

class TextZoom extends Component {

  componentDidMount() {
    console.log("TextZoom componentDidMount");
    let obj = {};
    obj.canvas = document.querySelector("canvas");
    obj.ctx = obj.canvas.getContext("2d");
    obj.scale = 1;
    obj.metrics = {
      width: 0,
      height: 0,
      retinaScale: window.devicePixelRatio,
      canvasWidth: 100,
      canvasHeight: 100,
      svgWidth: 0,
      svgHeight: 0
    };
    console.log("obj:", obj);

    function draw() {
      getSVG();
      drawBackgroundRect();
      drawPath();
    }

    function drawBackgroundRect() {
      console.log("drawBackgroundRect");
      // obj.ctx.globalCompositeOperation = "source-over";
      // obj.ctx.setTransform(1, 0, 0, 1, 0, 0);
      // obj.ctx.fillStyle = "rgba(255, 0, 0, 1.0)";
      // obj.ctx.fillRect(0, 0, obj.metrics.canvasWidth, obj.metrics.canvasHeight);
    }

    function drawPath() {
      console.log("drawPath");
    }

    function getSVG() {
      console.log("getSVG");
      let t = document.querySelector("svg");
      let e = t.attributes.viewBox.value.split(" ").splice(2, 2).map(parseFloat);
      t.setAttribute("width", e[0]);
      t.setAttribute("height", e[1]);
      let r = new Blob([t.outerHTML], {
        type: "image/svg+xml"
      });
      let n = (window.URL || window.webkitURL).createObjectURL(r);
      let img = new Image;
      img.src = n;
      console.log("img:", img);
      img.addEventListener("load", function() {
        console.log("image loaded");
      });
    }

    draw();
  }

  render() {
    return (
      <section className="zoom">
        <canvas id="canvie"></canvas>
        <Logo />
      </section>
    );
  }
}

export default TextZoom;
