import "./natal.css";

/**
 * String of lights along the bottom of the fixed Navbar, inside its box and
 * background: content scrolling under the bar never shows through the bulbs.
 */
const NatalHeaderLights = () => (
  <div className="relative h-4" aria-hidden="true">
    <div className="gp-natal-lights top-0" data-natal-deco="lights" />
  </div>
);

export default NatalHeaderLights;
