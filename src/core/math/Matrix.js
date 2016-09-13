// @todo - ignore the too many parameters warning for now
// should either fix it or change the jshint config
// jshint -W072

import Point from './Point';

/**
 * The pixi Matrix class as an object, which makes it a lot faster,
 * here is a representation of it :
 * | a | b | tx|
 * | c | d | ty|
 * | 0 | 0 | 1 |
 *
 * @class
 * @memberof PIXI
 */
class Matrix
{
    constructor()
    {
        /**
         * @member {number}
         * @default 1
         */
        this.a = 1;

        /**
         * @member {number}
         * @default 0
         */
        this.b = 0;

        /**
         * @member {number}
         * @default 0
         */
        this.c = 0;

        /**
         * @member {number}
         * @default 1
         */
        this.d = 1;

        /**
         * @member {number}
         * @default 0
         */
        this.tx = 0;

        /**
         * @member {number}
         * @default 0
         */
        this.ty = 0;

        this.array = null;
    }

   /**
    * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
    *
    * a = array[0]
    * b = array[1]
    * c = array[3]
    * d = array[4]
    * tx = array[2]
    * ty = array[5]
    *
    * @param array {number[]} The array that the matrix will be populated from.
    */
   fromArray(array)
   {
       this.a = array[0];
       this.b = array[1];
       this.c = array[3];
       this.d = array[4];
       this.tx = array[2];
       this.ty = array[5];
   }


   /**
    * sets the matrix properties
    *
    * @param {number} a
    * @param {number} b
    * @param {number} c
    * @param {number} d
    * @param {number} tx
    * @param {number} ty
    *
    * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
    */
   set(a, b, c, d, tx, ty)
   {
       this.a = a;
       this.b = b;
       this.c = c;
       this.d = d;
       this.tx = tx;
       this.ty = ty;

       return this;
   }


   /**
    * Creates an array from the current Matrix object.
    *
    * @param transpose {boolean} Whether we need to transpose the matrix or not
    * @param [out=new Float32Array(9)] {Float32Array} If provided the array will be assigned to out
    * @return {number[]} the newly created array which contains the matrix
    */
   toArray(transpose, out)
   {
       if (!this.array)
       {
           this.array = new Float32Array(9);
       }

       let array = out || this.array;

       if (transpose)
       {
           array[0] = this.a;
           array[1] = this.b;
           array[2] = 0;
           array[3] = this.c;
           array[4] = this.d;
           array[5] = 0;
           array[6] = this.tx;
           array[7] = this.ty;
           array[8] = 1;
       }
       else
       {
           array[0] = this.a;
           array[1] = this.c;
           array[2] = this.tx;
           array[3] = this.b;
           array[4] = this.d;
           array[5] = this.ty;
           array[6] = 0;
           array[7] = 0;
           array[8] = 1;
       }

       return array;
   }

   /**
    * Get a new position with the current transformation applied.
    * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
    *
    * @param pos {PIXI.Point} The origin
    * @param [newPos] {PIXI.Point} The point that the new position is assigned to (allowed to be same as input)
    * @return {PIXI.Point} The new point, transformed through this matrix
    */
   apply(pos, newPos)
   {
       newPos = newPos || new Point();

       let x = pos.x;
       let y = pos.y;

       newPos.x = this.a * x + this.c * y + this.tx;
       newPos.y = this.b * x + this.d * y + this.ty;

       return newPos;
   }

   /**
    * Get a new position with the inverse of the current transformation applied.
    * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
    *
    * @param pos {PIXI.Point} The origin
    * @param [newPos] {PIXI.Point} The point that the new position is assigned to (allowed to be same as input)
    * @return {PIXI.Point} The new point, inverse-transformed through this matrix
    */
   applyInverse(pos, newPos)
   {
       newPos = newPos || new Point();

       let id = 1 / (this.a * this.d + this.c * -this.b);

       let x = pos.x;
       let y = pos.y;

       newPos.x = this.d * id * x + -this.c * id * y + (this.ty * this.c - this.tx * this.d) * id;
       newPos.y = this.a * id * y + -this.b * id * x + (-this.ty * this.a + this.tx * this.b) * id;

       return newPos;
   }

   /**
    * Translates the matrix on the x and y.
    *
    * @param {number} x How much to translate x by
    * @param {number} y How much to translate y by
    * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
    */
   translate(x, y)
   {
       this.tx += x;
       this.ty += y;

       return this;
   }

   /**
    * Applies a scale transformation to the matrix.
    *
    * @param {number} x The amount to scale horizontally
    * @param {number} y The amount to scale vertically
    * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
    */
   scale(x, y)
   {
       this.a *= x;
       this.d *= y;
       this.c *= x;
       this.b *= y;
       this.tx *= x;
       this.ty *= y;

       return this;
   }


   /**
    * Applies a rotation transformation to the matrix.
    *
    * @param {number} angle - The angle in radians.
    * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
    */
   rotate(angle)
   {
       let cos = Math.cos( angle );
       let sin = Math.sin( angle );

       let a1 = this.a;
       let c1 = this.c;
       let tx1 = this.tx;

       this.a = a1 * cos-this.b * sin;
       this.b = a1 * sin+this.b * cos;
       this.c = c1 * cos-this.d * sin;
       this.d = c1 * sin+this.d * cos;
       this.tx = tx1 * cos - this.ty * sin;
       this.ty = tx1 * sin + this.ty * cos;

       return this;
   }

   /**
    * Appends the given Matrix to this Matrix.
    *
    * @param {PIXI.Matrix} matrix
    * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
    */
   append(matrix)
   {
       let a1 = this.a;
       let b1 = this.b;
       let c1 = this.c;
       let d1 = this.d;

       this.a  = matrix.a * a1 + matrix.b * c1;
       this.b  = matrix.a * b1 + matrix.b * d1;
       this.c  = matrix.c * a1 + matrix.d * c1;
       this.d  = matrix.c * b1 + matrix.d * d1;

       this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
       this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;

       return this;
   }

   /**
    * Sets the matrix based on all the available properties
    *
    * @param {number} x Position on the x axis
    * @param {number} y Position on the y axis
    * @param {number} pivotX Pivot on the x axis
    * @param {number} pivotY Pivot on the y axis
    * @param {number} scaleX Scale on the x axis
    * @param {number} scaleY Scale on the y axis
    * @param {number} rotation Rotation in radians
    * @param {number} skewX Skew on the x axis
    * @param {number} skewY Skew on the y axis
    *
    * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
    */
   setTransform(x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY)
   {
       let a, b, c, d, sr, cr, cy, sy, nsx, cx;

       sr  = Math.sin(rotation);
       cr  = Math.cos(rotation);
       cy  = Math.cos(skewY);
       sy  = Math.sin(skewY);
       nsx = -Math.sin(skewX);
       cx  =  Math.cos(skewX);

       a  =  cr * scaleX;
       b  =  sr * scaleX;
       c  = -sr * scaleY;
       d  =  cr * scaleY;

       this.a  = cy * a + sy * c;
       this.b  = cy * b + sy * d;
       this.c  = nsx * a + cx * c;
       this.d  = nsx * b + cx * d;

       this.tx = x + ( pivotX * a + pivotY * c );
       this.ty = y + ( pivotX * b + pivotY * d );

       return this;
   }

   /**
    * Prepends the given Matrix to this Matrix.
    *
    * @param {PIXI.Matrix} matrix
    * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
    */
   prepend(matrix)
   {
       let tx1 = this.tx;

       if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1)
       {
           let a1 = this.a;
           let c1 = this.c;
           this.a  = a1*matrix.a+this.b*matrix.c;
           this.b  = a1*matrix.b+this.b*matrix.d;
           this.c  = c1*matrix.a+this.d*matrix.c;
           this.d  = c1*matrix.b+this.d*matrix.d;
       }

       this.tx = tx1*matrix.a+this.ty*matrix.c+matrix.tx;
       this.ty = tx1*matrix.b+this.ty*matrix.d+matrix.ty;

       return this;
   }

   /**
    * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
    * @param transform {PIXI.Transform|PIXI.TransformStatic} the transform to apply the properties to.
    * @return {PIXI.Transform|PIXI.TransformStatic} The transform with the newly applied properies
   */
   decompose(transform)
   {
       // sort out rotation / skew..
       let a = this.a,
           b = this.b,
           c = this.c,
           d = this.d;

       let skewX = Math.atan2(-c, d);
       let skewY = Math.atan2(b, a);

       let delta = Math.abs(1-skewX/skewY);

       if (delta < 0.00001)
       {
           transform.rotation = skewY;

           if (a < 0 && d >= 0)
           {
               transform.rotation += (transform.rotation <= 0) ? Math.PI : -Math.PI;
           }

           transform.skew.x = transform.skew.y = 0;

       }
       else
       {
           transform.skew.x = skewX;
           transform.skew.y = skewY;
       }

       // next set scale
       transform.scale.x = Math.sqrt(a * a + b * b);
       transform.scale.y = Math.sqrt(c * c + d * d);

       // next set position
       transform.position.x = this.tx;
       transform.position.y = this.ty;

       return transform;
   }


   /**
    * Inverts this matrix
    *
    * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
    */
   invert()
   {
       let a1 = this.a;
       let b1 = this.b;
       let c1 = this.c;
       let d1 = this.d;
       let tx1 = this.tx;
       let n = a1*d1-b1*c1;

       this.a = d1/n;
       this.b = -b1/n;
       this.c = -c1/n;
       this.d = a1/n;
       this.tx = (c1*this.ty-d1*tx1)/n;
       this.ty = -(a1*this.ty-b1*tx1)/n;

       return this;
   }


   /**
    * Resets this Matix to an identity (default) matrix.
    *
    * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
    */
   identity()
   {
       this.a = 1;
       this.b = 0;
       this.c = 0;
       this.d = 1;
       this.tx = 0;
       this.ty = 0;

       return this;
   }

    /**
     * Creates a new Matrix object with the same values as this one.
     *
     * @return {PIXI.Matrix} A copy of this matrix. Good for chaining method calls.
     */
    clone()
    {
        let matrix = new Matrix();
        matrix.a = this.a;
        matrix.b = this.b;
        matrix.c = this.c;
        matrix.d = this.d;
        matrix.tx = this.tx;
        matrix.ty = this.ty;

        return matrix;
    }

    /**
     * Changes the values of the given matrix to be the same as the ones in this matrix
     *
     * @return {PIXI.Matrix} The matrix given in parameter with its values updated.
     */
    copy(matrix)
    {
        matrix.a = this.a;
        matrix.b = this.b;
        matrix.c = this.c;
        matrix.d = this.d;
        matrix.tx = this.tx;
        matrix.ty = this.ty;

        return matrix;
    }

    /**
     * A default (identity) matrix
     *
     * @static
     * @const
     */
    static get IDENTITY() {
       return new Matrix();
    }

	/**
	 * A temp matrix
	 *
	 * @static
	 * @const
	 */
    static get TEMP_MATRIX() {
       return new Matrix();
    }
}

export default Matrix;