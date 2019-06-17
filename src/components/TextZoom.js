import React, { Component } from "react";
import $ from "jquery";
import * as PIXI from "pixi.js";
import TweenMax from "gsap";
import PixiPlugin from "gsap/PixiPlugin";

class TextZoom extends Component {

  componentDidMount() {
    console.log("TextZoom componentDidMount");

    let $window = $(window);

    const app = new PIXI.Application({
      width: $window.outerWidth(),
      height: $window.outerHeight(),
      backgroundColor: 0xffffff,
      resolution: window.devicePixelRatio || 1
    });
    document.querySelector(".zoom__positioner").appendChild(app.view);

    app.stage.interactive = true;

    const bg = PIXI.Sprite.from(require("../images/bg.jpg"));
    app.stage.addChild(bg);

    var beeSvg = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/bee.svg";
    // var beeSvg = require(`../images/new_kajabi_logo.svg`);

    const beeTexture = PIXI.Texture.from(beeSvg, undefined, undefined, 1.0);
    const mask = new PIXI.Sprite(beeTexture);
    mask.anchor.set(0.5);
    mask.x = 310;
    mask.y = 190;

    bg.mask = mask;

    app.stage.addChild(mask);

    const target = new PIXI.Point();

    reset();

    function reset() {
      target.x = Math.floor(Math.random() * 550);
      target.y = Math.floor(Math.random() * 300);
    }

    // app.ticker.add(() => {
    //   mask.x += (target.x - mask.x) * 0.1;
    //   mask.y += (target.y - mask.y) * 0.1;
    //   mask.rotation += 0.2;

    //   if (Math.abs(mask.x - target.x) < 1) {
    //     reset();
    //   }
    // });
  }

  render() {
    return (
      <section className="zoom">
        <div className="zoom__positioner">
        </div>
      </section>
    );
  }
}

export default TextZoom;
