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
    bgImage.src = require(`../images/bg3.jpg`);

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
      // console.log("drawBackground");
      let scale = bgScale * retinaScale;
      ctx.setTransform(1, 0, 0, 1, 0.5 * canvasWidth, 0.5 * canvasHeight);
      ctx.translate(-bgWidth / 2 * scale, -bgHeight / 2 * scale);
      ctx.scale(scale, scale);
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

    $window.on("resize", function(event) {
      windowWidth = $window.outerWidth();
      windowHeight = $window.outerHeight();
      draw();
    });
  }

  render() {
    return (
      <Fragment>
        {/* <img src={ require(`../images/bg.jpg`) } id="bg-image" /> */}
        <section className="zoom">
          <canvas id="canvie"></canvas>
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 253" width="960" height="253" className="logo">
            <path d="M125.22 77.16q7.58 13.94 10.43 46.19t2.84 39.21q0 31.62-17.7 48.7-30.36-12.64-53.12-10.75 17.7-13.27 17.7-39.85 0-8.85-1.89-41.12Q81.57 103.1 80.32 86q-.64-22.78 6.33-31 27.81 5.07 38.57 22.13zm-51.86-24Q48.7 78.44 48.69 111.32a231.93 231.93 0 0 0 1.9 27.2Q55 170.79 55 180.9q0 14.57-5.07 23.41-20.24 6.31-40.47 24a143.17 143.17 0 0 1 36.05-4.42q37.93 0 60.7 17.06 43-43 43.64-44.26 20.24-25.93 20.24-63.26a104.54 104.54 0 0 0-1.27-15.81q-4.42-53.76-26.55-75.27-19.59-20.2-63.85-20.85Q15.81 20.89 0 0q5.06 26 32.25 41.12 11.37 7 41.11 12zm141 118.92v-69q0-25.29-16.44-36l-22.74 18.31q10.74 4.42 10.75 17.71v69q0 25.95 16.45 36.68l23.39-18.34q-11.39-4.44-11.38-18.34zm1.89-133.46a22 22 0 0 0 7-1.27q-7.59 21.51-26.56 21.51-11.38 0-22.77-15.19l23.4-18.34q10.13 13.29 19 13.29zM227.67 112q0 20.24 18.34 30.35 29.72 16.45 31.62 19 3.8 4.42 3.8 13.91-.65 8.22-3.8 13.28-17.08.64-26.56-27.19-14.55 11.37-21.5 17.07 10.74 27.21 34.78 31.63l32.88-24q9.48-7 9.49-24 0-20.25-17.71-30.37-29.73-16.44-31.62-19-10.75-11.39-1.89-25.94 17.7-2.52 27.82 24.67l21.5-15.81q-9.49-26.57-36.68-29.1l-25.93 18.26Q227.66 94.89 227.67 112zm138.49-8.86v69q0 25.95 16.45 36.68l22.77-18.34q-10.75-4.44-10.75-18.34v-69q0-27.19-25.93-36l-26.57 20.15a33.43 33.43 0 0 0-14.54-20.24l-23.4 18.34q11.38 4.42 11.39 17.71v69q0 25.95 16.43 36.68l22.77-18.34Q343.4 186 343.4 172.05V99.3l13.27-10.12q9.49 5.7 9.49 13.92zm89.18-37.95l-19 10.12Q406 91.08 406 139.16q0 29.73 12.34 48.7t35.1 20.24l31-25.3a34.2 34.2 0 0 1-12 1.89q-25.31 0-34.78-20.86a87.63 87.63 0 0 1-4.43-12.65l47.43-37.33-25.29-48.7zM437 87.29l17.08 32.89-23.4 19Q425 101.84 437 87.29zm51.23 15.81v72.11q0 8.85 8.22 20.25t20.24 13.27l23.4-19.61q0 2.53 3.15 12.66a120.77 120.77 0 0 1 3.81 19.6q2.52 23.4-25.93 23.4-20.88 0-20.87-15.81a14.3 14.3 0 0 1 3.16-9.48l-20.23-18.35q-9.51 9.5-9.49 22.14.63 13.29 15.17 21.5t34.77 8.22q20.88 0 35.1-9.49t14.24-24q0-8.22-2.85-22.77t-2.85-21.51V103.1q0-25.29-15.82-36l-23.38 18.29q11.37 4.42 11.37 17.71v72.74l-10.75 8.85q-12-3.78-12-16.44V103.1q0-25.29-16.44-36l-23.42 18.29q11.39 4.42 11.39 17.71zm125.85 69V46.17q0-25.29-15.81-36.68l-23.4 18.34q11.37 3.8 11.38 18.34v125.88q0 25.95 15.81 36.68l23.4-18.34q-11.38-4.44-11.38-18.34zm91.07 36l22.12-19.61q-16.44-1.89-16.43-13.28V103.1q0-12.64-9.8-23.08a50 50 0 0 0-25-14.23L652 82.23q-21.51 14.55-21.51 64.51 0 53.77 31.62 61.36l22.77-20.87Q690 203 705.14 208.1zm-29.72-26.56q-15.83-8.22-18.67-21.54a134.83 134.83 0 0 1-2.85-28.47q0-25.92 8.22-44.27 20.24.63 20.24 15.81v65.78q0 6.33-7 12.66zm107.5-78.44v69q0 25.95 16.45 36.68l23.39-18.34Q811.4 186 811.39 172.1v-69q0-27.19-25.93-36l-26.57 20.19q-2.53-12.66-14.55-20.24L721 85.39q11.37 4.42 11.38 17.71v69q0 25.95 16.45 36.68l22.76-18.34q-10.75-4.44-10.75-18.34v-69s-.21-1.27-.64-3.8l13.29-10.12q9.48 5.7 9.48 13.92zm88.54-4.74q-9.5-8.53-17.08-8.54-10.11 31-1.26 68.94 3.78 17.09 17.7 24.67 10.13-8.85 10.13-15.81v-55q0-5.7-9.49-14.23zm9.53-21.2V47.44q0-15.81-12.65-19.61l22.71-18.34q17.7 12 17.71 36.68v125.88q0 12 16.44 18.34l-22.76 17.71q-14.55-7.59-19-20.87l-22.11 20.87q-41.12-9.48-36-77.17 3.15-36.68 20.86-48.7l22.77-15.18q6.32 2.53 12 10.11zm67 132.2q12 0 12-12t-12-12q-12.66 0-12.66 12t12.66 12zm-10.13-12q0-9.49 10.13-9.49 9.48 0 9.48 9.49 0 10.13-9.48 10.12-10.14 0-10.13-10.12zm9.49 1.26l3.79 5.7h2.53l-3.79-5.7a3.51 3.51 0 0 0 3.16-3.79c0-3-1.47-4.43-4.43-4.43h-5.69v13.92h2.53v-5.7zm-1.9-6.32H948c2.1 0 3.15.64 3.15 1.89 0 1.7-1 2.54-3.15 2.54h-2.54v-4.43z" fill-rule="evenodd"/>
          </svg> */}
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
