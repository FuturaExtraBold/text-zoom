import React, { Component, Fragment } from "react";
import $ from "jquery";
import TweenMax from "gsap";

class TextZoom extends Component {

  componentDidMount() {

    console.log("TextZoom componentDidMount");

    // Window
    let $window = $(window);
    let windowWidth = $window.outerWidth();
    let windowHeight = $window.outerHeight();
    let retinaScale = window.devicePixelRatio;

    // Canvas
    let canvas = document.querySelector("canvas");
    let ctx = canvas.getContext("2d");
    let canvasWidth = 0;
    let canvasHeight = 0;

    // Background
    console.log("loading bgImage");
    let bgImage = new Image();
    let bgIsReady = false;
    let bgScale = 1;
    let bgWidth = 0;
    let bgHeight = 0;
    bgImage.onload = function() {
      bgIsReady = true;
      bgWidth = bgImage.naturalWidth;
      bgHeight = bgImage.naturalHeight;
      console.log("bgImage loaded! bgImage:", bgImage, "bgWidth:", bgWidth, "bgHeight:", bgHeight);
    }
    bgImage.src = require(`../images/bg.jpg`);

    // SVG
    let svgEl = document.querySelector("svg");
    let svgImage;
    let svgIsReady = false;
    let svgScale = 1;
    let svgWidth = 0;
    let svgHeight = 0;
    let svgViewBox = svgEl.attributes.viewBox.value.split(" ").splice(2, 2).map(parseFloat);

    svgEl.setAttribute("width", svgViewBox[0]);
    svgEl.setAttribute("height", svgViewBox[1]);

    let blob = new Blob([svgEl.outerHTML], {type: 'image/svg+xml'});
    let url = URL.createObjectURL(blob);
    let img = new Image();
    img.onload = function() {
      console.log("SVG image loaded");
      svgIsReady = true;
      svgImage = img;
      svgWidth = img.naturalWidth;
      svgHeight = img.naturalHeight;
      draw();
    }
    img.src = url;

    function setCanvasSize() {
      retinaScale = window.devicePixelRatio > 1 ? 2 : 1;
      canvasWidth = windowWidth * retinaScale;
      canvasHeight = windowHeight * retinaScale;
      canvas.style.width = windowWidth + "px";
      canvas.style.height = windowHeight + "px";
      canvas.width = windowWidth * retinaScale;
      canvas.height = windowHeight * retinaScale;
    }

    function draw() {
      if (svgIsReady) {
        setCanvasSize();
        if (bgIsReady) drawBackground();
        drawPath();
      }
    }

    function drawBackground() {
      // console.log("drawBackground, bgScale:", bgScale);
      ctx.setTransform(1, 0, 0, 1, 0.5 * canvasWidth, 0.5 * canvasHeight);
      ctx.translate(-bgWidth / 2 * bgScale, -bgHeight / 2 * bgScale);
      ctx.scale(bgScale, bgScale);
      ctx.drawImage(bgImage, 0, 0);
    }

    function drawPath() {
      // console.log("drawPath");
      ctx.globalCompositeOperation = "destination-in";
      let scale = svgScale * retinaScale;
      ctx.setTransform(1, 0, 0, 1, 0.5 * canvasWidth, 0.5 * canvasHeight);
      ctx.translate(-svgWidth / 2 * scale, -svgHeight / 2 * scale);
      ctx.translate(retinaScale, retinaScale);
      ctx.scale(scale, scale);
      ctx.drawImage(svgImage, 0, 0);
    }

    $window.on("mousemove", function(event) {
      // console.log("clientX:", event.clientX, "clientY:", event.clientY);
      let xScale = (event.clientX / windowWidth * 100) / 100;
      console.log("xScale:", xScale);
      svgScale = Math.max(1, xScale * 20);
      bgScale = Math.max(1, 2 - xScale);
      draw();
    });
  }

  render() {
    return (
      <Fragment>
        {/* <img src={ require(`../images/bg.jpg`) } id="bg-image" /> */}
        <section className="zoom">
          <canvas id="canvie"></canvas>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 560" width="960" height="560" className="logo">
            <g>
              <path d="M0,188.6c0-13.1,10.5-22.7,23.5-22.7s23.5,9.6,23.5,22.7c0,12.8-10.5,22.7-23.5,22.7S0,201.4,0,188.6z M1.5,229.1h43.9
                v161.2H1.5V229.1z"></path>
              <path d="M151.6,173.3c44.5,0,75.2,29.6,75.2,74.3c0,44.5-31.7,74.3-77.5,74.3h-40.6v68.4H63.3V173.3H151.6z M108.7,286.4h30.7
                c26,0,41.2-13.8,41.2-38.7c0-24.7-15-38.5-41.1-38.5h-30.8L108.7,286.4L108.7,286.4z"></path>
              <path d="M224.4,343.8c0-29.3,22.6-46,63.9-48.4l39.9-2.4v-10.5c0-15.2-10.5-23.5-27.7-23.5c-15.2,0-26,8-28,19.6h-40
                c1.2-31.1,29-52.3,69.9-52.3c41.5,0,68.9,21.4,68.9,53.5v110.6h-42.4v-24.7H328c-8.9,16.8-28.7,27.1-49.2,27.1
                C247.8,392.7,224.4,372.7,224.4,343.8z M328.2,331.2v-11.6l-33.2,2.1c-17.5,1.2-26.8,8.3-26.8,19.7c0,11.7,9.9,19.4,25.1,19.4
                C312.7,360.8,328.2,348.5,328.2,331.2z"></path>
              <path d="M381.4,309.4c0-50.5,25.9-82.3,66-82.3c23.3,0,41.2,11.7,49.2,29.6h0.9v-83.5h43.9v217.1h-43.3v-27.7h-0.8
                c-7.8,17.7-26.5,29.6-50.2,29.6C407.1,392.3,381.4,360.4,381.4,309.4z M426.4,309.7c0,29,13.8,47.2,35.6,47.2s35.8-18.4,35.8-47.2
                c0-28.7-14-47.2-35.8-47.2S426.4,280.8,426.4,309.7z"></path>
              <path d="M782.9,281.9c0,69-40.5,112.2-104.7,112.2c-64.4,0-104.7-43.2-104.7-112.2c0-69.2,40.3-112.4,104.7-112.4
                C742.5,169.5,782.9,212.7,782.9,281.9z M619.9,281.9c0,45.4,22.7,74.2,58.4,74.2c35.5,0,58.2-28.7,58.2-74.2
                c0-45.6-22.7-74.5-58.2-74.5S619.9,236.3,619.9,281.9z"></path>
              <path d="M829,328.5c2.1,17.9,20.8,29.6,44.8,29.6c24.2,0,40.8-11.6,40.8-27.5c0-14.1-10.4-22-36.5-27.8l-28.3-6.2
                c-40-8.6-59.7-28.9-59.7-60.6c0-40,34.6-66.5,83-66.5c50.5,0,82.3,26,83,65.3h-42.6c-1.5-18.4-17.6-29.5-40.3-29.5
                c-22.4,0-37.5,10.7-37.5,26.8c0,13.4,10.5,20.9,35.5,26.6l26.3,5.6c43.5,9.3,62.4,28,62.4,61.1c0,42.1-34.1,68.7-88,68.7
                c-52.2,0-85.4-24.8-86.8-65.6H829z"></path>
              <rect id="focus" x="505" y="290.7" fill="#FF0000" width="32" height="24.4"></rect>
            </g>
          </svg>
        </section>
      </Fragment>
    );
  }
}

export default TextZoom;
