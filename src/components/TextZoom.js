import React, { Component } from "react";
import $ from "jquery";
import TweenMax from "gsap/TweenMax";

import { ReactComponent as Logo } from "../images/kajabi_logo.svg";

class TextZoom extends Component {
  render() {
    return (
      <section className="text-zoom">
        <div className="logo">
          <Logo className="logo__svg" />
        </div>
      </section>
    );
  }
}

export default TextZoom;
