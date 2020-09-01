/**
 * Vec2 represents a 2d position or a 2d vector.
 * It is used everywhere in Illuminated.js.
 * Vec2 is based on Box2d's Vec2 except that in Illuminated.js a Vec2
 * vector is immutable. It means every method creates a new Vec2 instance and
 * you can safely use a same Vec2 instance everywhere because the immutability
 * guarantees that properties will not be modified.
 *
 * @class Vec2
 * @namespace illuminated
 * @constructor
 * @param {Number} [x=0] X coordinate for the vector.
 * @param {Number} [y=0] Y coordinate for the vector.
 */
export default class Vec2 {
  constructor(x = 0, y = 0) {}
}
