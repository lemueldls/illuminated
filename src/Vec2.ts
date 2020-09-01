/**
 * Vec2 represents a 2d position or a 2d vector.
 * It is used everywhere in Illuminated.js.
 * Vec2 is based on Box2d's Vec2 except that in Illuminated.js a Vec2
 * vector is immutable. It means every method creates a new Vec2 instance and
 * you can safely use a same Vec2 instance everywhere because the immutability
 * guarantees that properties will not be modified.
 */
export default class Vec2 {
  /**
   * @param x - X coordinate for the vector.
   * @param y - Y coordinate for the vector.
   */
  public constructor(public x = 0, public y = 0) {}

  /**
   * Returns a copy of this vector.
   *
   * @returns A new vector that is a copy of this vector.
   */
  public copy(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  /**
   * Calculates the dot product of this vector and the given vector.
   *
   * @param v - A vector with which to calculate the dot product.
   * @returns The result of the dot product.
   */
  public dot(v: Vec2): number {
    return v.x * this.x + v.y * this.y;
  }

  /**
   * Subtracts the given vector from this vector.
   *
   * @param v - A vector to subtract from this vector.
   * @returns A new vector that is the result of the subtraction.
   */
  public sub(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  /**
   * Adds the given vector to this vector.
   *
   * @param v - A vector to add to this vector.
   * @returns A new vector that is the result of the addition.
   */
  public add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  /**
   * Multiplies the given vector with this vector.
   *
   * @param n - A number to multiply with this vector.
   * @returns A new vector that is the result of the multiplication.
   */
  public mul(n: number): Vec2 {
    return new Vec2(this.x * n, this.y * n);
  }

  /**
   * Returns the inverse of this vector.
   *
   * @returns A new vector that is the inverse of this vector.
   */
  public inv(): Vec2 {
    return this.mul(-1);
  }

  /**
   * Calculates the squared distance between this vector and the given vector.
   *
   * @param v - A vector with which the squared distance is calculated.
   * @returns The squared distance.
   */
  public dist2(v: Vec2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;

    return dx * dx + dy * dy;
  }

  /**
   * Calculates the normalized form of this vector.
   *
   * @returns A new vector in normalized form.
   */
  public normalize(): Vec2 {
    const length = Math.sqrt(this.length2());

    return new Vec2(this.x / length, this.y / length);
  }

  /**
   * Calculates the squared length of this vector.
   *
   * @returns The squared length.
   */
  public length2(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Returns a string representing this vector.
   *
   * @returns A string representing this vector.
   */
  public toString(): string {
    return `${this.x},${this.y}`;
  }

  /**
   * Determines if this vector is within the bounds defined by the given vectors.
   *
   * @param topleft - A vector that is the top-left of the bounds.
   * @param bottomright - A vector that is the bottom-right of the bounds.
   * @returns True if this vector is within the given bounds.
   */
  public inBound(topleft: Vec2, bottomright: Vec2): boolean {
    return (
      topleft.x < this.x && this.x < bottomright.x && topleft.y < this.y && this.y < bottomright.y
    );
  }
}
