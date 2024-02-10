
class Vector2 {

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
        return Math.sqrt(this.x^2 + this.y^2) ;
    }

    get perpendicular()
    {
        return new Vector2([this.y, -this.x]);
    }

    get inverse()
    {
        return new Vector2([-this.x, -this.y]);
    }

    distance(other = Vector2)
    {
        return new Vector2(this.x - other.x, this.y - other.y).magnitude;
    }

    mult(scaler = 1)
    {
        return new Vector2([this.x*scaler, this.y*scaler]);
    }

    add(otherVector = Vector2)
    {
        return new Vector2([this.x + otherVector.x, this.y + otherVector.y]);
    }

    sub(otherVector = Vector2)
    {
        return new Vector2([this.x - otherVector.x, this.y - otherVector.y]);
    }

}


const canv = document.getElementById("canv"); 
const ctx = canv.getContext("2d");


const usbPickUpDist = 30;
let holding = false;
let usbPos = new Vector2([canv.width * .5, canv.height * .5]);






document.onmousedown = (e) =>
{
    
    if (!holding) 
    {

    }
}

document.onmousemove = (e) =>
{




}


function drawScreen()
{
    canv.width = window.innerWidth;
    canv.height =  window.innerHeight;
    usbPos = new Vector2([canv.width * .5, canv.height * .5]);


    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,1)"
    ctx.clearRect(0,0,canv.width,canv.height);
    ctx.arc(usbPos.x,usbPos.y,usbPickUpDist,0,Math.PI*2);
    ctx.fill();

    window.requestAnimationFrame(drawScreen);
}

window.requestAnimationFrame(drawScreen);