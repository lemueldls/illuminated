/**
 * Vec2 represents a 2D position or a 2D vector.
 * It is used everywhere in Illuminated.
 *
 * Vec2 is based on Box2D's Vec2 except that in Illuminated, a Vec2 vector is immutable.
 * It means every method creates a new Vec2 instance and you can safely use a same Vec2 instance
 * everywhere because the immutability guarantees that properties will not be modified.
 */
export default class Vec2 {
  /**
   * @param x - X coordinate for the vector.
   * @param y - Y coordinate for the vector.
   */
  public constructor(public x = 0, public y = 0) {}

  /**
   * Returns a copy of the vector.
   *
   * @returns A new vector that is a copy of the vector.
   */
  public copy(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  /**
   * Calculates the dot product of the vector and the given vector.
   *
   * @param v - A vector with which to calculate the dot product.
   * @returns The result of the dot product.
   */
  public dot(v: Vec2): number {
    return v.x * this.x + v.y * this.y;
  }

  /**
   * Subtracts the given vector from the vector.
   *
   * @param v - A vector to subtract from the vector.
   * @returns A new vector that is the result of the subtraction.
   */
  public sub(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  /**
   * Adds the given vector to the vector.
   *
   * @param v - A vector to add to the vector.
   * @returns A new vector that is the result of the addition.
   */
  public add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  /**
   * Multiplies the given vector with the vector.
   *
   * @param n - A number to multiply with the vector.
   * @returns A new vector that is the result of the multiplication.
   */
  public mul(n: number): Vec2 {
    return new Vec2(this.x * n, this.y * n);
  }

  /**
   * Returns the inverse of the vector.
   *
   * @returns A new vector that is the inverse of the vector.
   */
  public inv(): Vec2 {
    return this.mul(-1);
  }

  /**
   * Calculates the squared distance between the vector and the given vector.
   *
   * @param v - A vector with which the squared distance is calculated.
   * @returns The squared distance.
   */
  public dist2(v: Vec2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;

    return dx ** 2 + dy ** 2;
  }

  /**
   * Calculates the normalized form of the vector.
   *
   * @returns A new vector in normalized form.
   */
  public normalize(): Vec2 {
    const length = Math.sqrt(this.length2());

    return new Vec2(this.x / length || 0, this.y / length || 0);
  }

  /**
   * Calculates the squared length of the vector.
   *
   * @returns The squared length.
   */
  public length2(): number {
    return this.x ** 2 + this.y ** 2;
  }

  /**
   * Returns a string representing the vector.
   *
   * @returns A string representing the vector.
   */
  public toString(): string {
    return `${this.x},${this.y}`;
  }

  /**
   * Determines if the vector is within the bounds defined by the given vectors.
   *
   * @param topLeft - A vector that is the top-left of the bounds.
   * @param bottomRight - A vector that is the bottom-right of the bounds.
   * @returns `true` if the vector is within the given bounds.
   */
  public inBound(topLeft: Vec2, bottomRight: Vec2): boolean {
    return (
      topLeft.x < this.x && this.x < bottomRight.x && topLeft.y < this.y && this.y < bottomRight.y
    );
  }
}
