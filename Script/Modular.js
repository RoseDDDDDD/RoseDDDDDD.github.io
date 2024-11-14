export function lerp(a = 0, b=1, t=.1)
{
    return a + (b - a) * t;
}

export function inRect(rect, pos = Vector2)
{
    if (rect == null) return false;
    return rect.x < pos.x && rect.x + rect.width > pos.x && rect.y < pos.y && rect.y + rect.height > pos.y;
}

export function isOverlapping(rect1, rect2) {
	return (rect1.x < rect2.x + rect2.width &&
		rect1.x + rect1.width > rect2.x &&
		rect1.y < rect2.y + rect2.height &&
		rect1.height + rect1.y > rect2.y);
}

export class Vector2 {

    constructor(components = [0,0])
    {
        this.components = components;
    }

    get x() {
        return this.components[0];
    }
    set x(val = 0) {
        this.components[0] = val;
    }

    get y() {
        return this.components[1];
    }
    set y(val = 0) {
        this.components[1] = val;
    }



    get magnitude() {
        return Math.sqrt(this.x *this.x + this.y * this.y) ;
    }

    get normalized()
    {
        let mag = this.magnitude;
        return (mag == 0) ? new Vector2([0,0]) : (new Vector2([this.x/mag, this.y/mag]));
    }

    get perpendicular()
    {
        return new Vector2([this.y, -this.x]);
    }

    get angle()
    {
        return Math.atan2(this.normalized.y,this.normalized.x) * 180/Math.PI;
    }

    get inverse()
    {
        return new Vector2([-this.x, -this.y]);
    }

    // raw vector math
    distance(other = new Vector2())
    {
        console.log(this);
        console.log(other);
        console.log(this.sub(other).magnitude);
        return new Vector2([this.x - other.x, this.y - other.y]).magnitude;
    }

    mult(scaler = 1)
    {
        return new Vector2([this.x*scaler, this.y*scaler]);
    }

    add(other = new Vector2())
    {
        return new Vector2([this.x + other.x, this.y + other.y]);
    }

    sub(other = new Vector2())
    {
        return new Vector2([this.x - other.x, this.y - other.y]);
    }

    lerp(other = new Vector2(),t)
    {
        return new Vector2( [ this.x + (other.x - this.x) * t, this.y + (other.y - this.y) * t ] );
    }

    rotate(angle)
    {
        return new Vector2([Math.cos(x) - Math.sin(y),Math.sin(x) + Math.cos(y)]);
    }

    // element related functions
    elementCenter(el)
    {
        var rect = el.getBoundingClientRect();
        return new Vector2([rect.left + rect.width * .5,rect.top + rect.height * .5]);
    }

    // element related functions
    rectCenter(rect)
    {
        return new Vector2([rect.left + rect.width * .5,rect.top + rect.height * .5]);
    }
}
