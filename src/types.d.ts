import Vec2 from "./Vec2";

/**
 * Boundaries with the properties {@linkcode Bounds.topleft | topleft}
 * and {@linkcode Bounds.bottomright | bottomright}. The property values
 * are {@linkcode Vec2} objects representing the corners of the boundary.
 */
export interface Bounds {
  topleft: Vec2;
  bottomright: Vec2;
}
