import React, { Component } from "react";
import $ from "jquery";
import TweenMax from "gsap/TweenMax";

import { ReactComponent as Logo } from "../images/kajabi_logo.svg";

class TextZoom extends Component {

  componentDidMount() {
    console.log("TextZoom componentDidMount");
    let $logo = $(".logo");
    // TweenMax.set($logo, { xPercent: "-50", yPercent: "-50" });
    // TweenMax.set($(".logo__path"), { attr: { x: "50%", y: "" }});
    // TweenMax.to($(".text-zoom__bg"), 100, { scale: 100, ease: "linear", delay: 1 });
  }

  render() {
    const bgImgUrl = require(`../images/bg.jpg`);
    return (
      <section className="text-zoom">
        <div className="text-zoom__bg"></div>
        <Logo />
      </section>
    );
  }
}

export default TextZoom;
