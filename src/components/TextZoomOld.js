import React, { Component } from "react";
import $ from "jquery";
import TweenMax from "gsap/TweenMax";

import { ReactComponent as Logo } from "../images/kajabi_logo.svg";

class TextZoom extends Component {

  componentDidMount() {

    console.log("TextZoom componentDidMount");

    var canvas = document.getElementById("my-canvas");

    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    console.log("dpr:", dpr);

    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    console.log("rect:", rect);

    // Give the canvas pixel dimensions of their CSS size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    var ctx = canvas.getContext("2d");

    // Scale all drawing operations by the dpr, so you don't have to worry about the difference.
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(100, 100, 200, 200);

    TweenMax.to($(canvas), 5, { scale: 10, ease: "linear", transformOrigin: "top left" });
  }

  render() {
    const bgImgUrl = require(`../images/bg.jpg`);
    return (
      <section className="text-zoom">
        <div className="text-zoom__bg"></div>
        <canvas id="my-canvas"></canvas>
      </section>
    );
  }
}

export default TextZoom;
