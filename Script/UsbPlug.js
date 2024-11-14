import {Vector2, lerp, inRect} from "./Modular.js";

class cubicBezzier
{
    constructor(origin = Vector2 , p1 = Vector2 , p2 = Vector2 , end = Vector2)
    {
        this.origin = origin;
        this.p1 = p1;
        this.p2 = p2;
        this.end = end;
        this.context = null
    }

    getPoint(t = 0)
    {

        let a = this.origin.lerp(this.p1,t);
        let b = this.p1.lerp(this.p2,t);
        let c = this.p2.lerp(this.end,t);

        let d =  a.lerp(b,t);
        let e =  b.lerp(c,t);
        return d.lerp(e,t);
    }

    draw(segments = 10)
    {
        let step = 1/segments;
        let curP = Vector2;

        this.context.beginPath();
        this.context.moveTo(this.origin.x,this.origin.y);
        for (let i =  0; i <= segments; i++)
        {
            curP = this.getPoint(i * step);

            this.context.lineTo(curP.x,curP.y);
        }

        this.context.lineTo(this.end.x,this.end.y);

        this.context.stroke();
    }
}

const plugSfx = document.getElementById("plugSfx");
const unPlugSfx = document.getElementById("unPlugSfx");

const Iframe = document.getElementById("socketFrame");
const canv = document.getElementById("canv"); 
const ctx = canv.getContext("2d");


const usbPickUpDist = 30;
let holding = false;
const usb = document.getElementById("usb");
let usbRect = usb.getBoundingClientRect();
let usbPos = new Vector2([window.innerWidth * .5, window.innerHeight]);
let targetUsbPos = new Vector2([window.innerWidth * .5, window.innerHeight * .5]);



let mouseOffset = new Vector2([0,0]);
let mousePos = new Vector2([0,0]);
document.onmousemove = (e) =>
{

    mousePos.x = e.clientX;
    mousePos.y = e.clientY;

    if (!holding && socketRect && inRect(socketRect,mousePos))
    {
        document.body.style.cursor = "grab";
    }else if (!holding) 
    {
        document.body.style.cursor = "auto";
    }

    console.log(holding)
    if (!holding) return;

    targetUsbPos = new Vector2([ e.clientX, e.clientY]);
    targetUsbPos = targetUsbPos.sub(mouseOffset);
    
}


function tryPickUpUsb()
{
    const inUsbRect = inRect(usbRect,mousePos);
    const inSocketRect = inRect(socketRect,mousePos);

    if (!inUsbRect && !inSocketRect) return;

    if (!holding)
    {
        if (plugged == true)
        {
            plugged = false;
            unPlugSfx.play();
        }else
        {
            socket = null;
        }

        document.body.style.setProperty("user-select","none");    
        document.body.style.cursor = "grabbing";   
        usb.style.cursor = "grabbing"; 

        usb.setAttribute("draggable","false");

        if (inUsbRect)
        {
            mouseOffset = mousePos.sub(targetUsbPos);
        }else mouseOffset = new Vector2([0,-usbRect.height*.5]);
        holding = true;
        usb.style.zIndex = 100;
    }
}

let plugged = false;
let socket = null;
let socketRect = null;
function dropUsb()
{
    mouseOffset.x = 0;
    mouseOffset.y = 0;

    document.body.style.setProperty("user-select","auto");
    document.body.style.cursor = "auto";    
    usb.style.cursor = "grab"; 


    usb.setAttribute("draggable","true");

    if (holding)
    {
        holding = false;
        
        // checking for socket to plug
        usbRect = usb.getBoundingClientRect();
        const plugPos = new Vector2([usbRect.x + usbRect.width *.5,usbRect.y]);
        const sockets = document.getElementsByClassName("socket");

        let foundSocket = false;
        for (let i = 0; i < sockets.length; i++)
        {
            socketRect = sockets[i].getBoundingClientRect();
            // check if the plug is within bounding rect
            if(inRect(socketRect,plugPos) && socket != sockets[i])
            {
                targetThronSize = 20;
                plugged = true;
                plugSfx.play();

                socket = sockets[i];
                
                const plugEvent = new CustomEvent("plug",{
                    detail: { elem: socket},
                    bubbles: true,
                    cancelable: true
                })

                foundSocket = true;
                socket.dispatchEvent(plugEvent);
                usb.style.zIndex = 0;
            }
        }

        if (!foundSocket) socket == null;
    }


}


document.onmouseup = (e) => {if (e.button == 0)dropUsb()};
document.onmousedown = (e) => {if (e.button == 0)tryPickUpUsb()};

document.addEventListener("plug", function(event)
{
    console.log(event);
    let plugLink = event.detail.elem.getElementsByTagName("a");
    console.log(plugLink);
    if (plugLink.length == 0) return;

    if (plugLink[0].target == "_blank")
        {
            plugLink[0].click();
        }

    Iframe.src = plugLink[0].href;
    Iframe.style.transitionDuration = "3s";
    Iframe.style.height = "100vh";
    setTimeout(() => {
        console.warn(Iframe.contentWindow.document);
        Iframe.contentWindow.document.addEventListener("keydown", (e) => {
            if (e.code == 'KeyW') minimizeIframe();
        });
        document.addEventListener("keydown", (e) => {
            if (e.code == 'KeyW' && plugged) minimizeIframe();
        });

    }, 500);

    if(document.getElementById("socketWires")) document.getElementById("socketWires").style.height = "30vh";
    if(document.getElementById("socketBackdrop")) document.getElementById("socketBackdrop").style.height = "100vh";
    document.getElementById("minimizeIframe").style.height = "";
});

document.getElementById("minimizeIframe").addEventListener("click", minimizeIframe)

function minimizeIframe(e)
{
    if(document.getElementById("socketWires")) document.getElementById("socketWires").style.height = "0vh";
    if(document.getElementById("socketBackdrop")) document.getElementById("socketBackdrop").style.height = "0vh";
    Iframe.style.transitionDuration = ".5s";
    Iframe.style.height = "0vh";
    document.getElementById("minimizeIframe").style.height = "0vh";


    setTimeout(() => {
        if (Iframe.getBoundingClientRect().height > 1) return;
        console.warn(Iframe.getBoundingClientRect().height);
        Iframe.src = "";

    }, 3000);
}

canv.width = window.innerWidth;
canv.height =  window.innerHeight;




let targetThronSize = 0;
let thornSize = 0;
function drawThorns(thornCount = 5, curves = [new cubicBezzier(), new cubicBezzier()])
{
    thornSize = lerp(thornSize,targetThronSize,.003);
    let step = 1/thornCount;
    let curVec = new Vector2();
    let thornSide = true; // right = false, left = true
    ctx.fillStyle = "rgba(30,30,200,1)";

    for (let i = 0; i < curves.length;i++)
    {
        for (let thornT = step; thornT <= 1; thornT += step)
        {
            ctx.beginPath();
            curVec = curves[i].getPoint(thornT);
            ctx.moveTo(curVec.x,curVec.y);


            curVec = curves[i].getPoint(thornT);
            curVec = curVec.sub(curves[i].getPoint(thornT+step*.05)).perpendicular.normalized;

            thornSide = !thornSide;
            if (thornSide)
            {
                curVec = curVec.inverse;
            }

            curVec = curves[i].getPoint(thornT+step*.05).add(curVec.mult(thornSize));
            
            ctx.lineTo(curVec.x,curVec.y);

            curVec = curves[i].getPoint(thornT);
            curVec = curVec.add( curVec.sub(curves[i].getPoint(thornT+step*.1)).normalized.mult(10));
            ctx.lineTo(curVec.x,curVec.y);

            ctx.fill();
        }
        
    }
}


const bez = new cubicBezzier(
    new Vector2([canv.width*.5,canv.height]),
    new Vector2([canv.width*.25,canv.height*.8]),
    new Vector2([canv.width*.75,canv.height*.6]),
    new Vector2([canv.width*.5,canv.height*4])
)


bez.context = ctx;

function drawCable()
{
    bez.origin.x = canv.width*.5;
    bez.origin.y = canv.height;

    bez.p1.x = canv.width + -usbPos.x - canv.width*.2;
    bez.p1.y = canv.height*.8;

    bez.p2.x = usbPos.x + (usbPos.x - canv.width*.5) + canv.width*.1;
    bez.p2.y = canv.height*.6 + usb.y *.2;

    bez.end = usbPos;


    bez.draw(50);
}

function drawUsb()
{

    if (plugged)
    {
        socketRect = socket.getBoundingClientRect();
        targetUsbPos.x = (socketRect.x + socketRect.width*.5);
        targetUsbPos.y = socketRect.y + socketRect.height*.8;
    }
    usbPos = usbPos.lerp(targetUsbPos,.1);
    usbRect = usb.getBoundingClientRect();

    usb.style.left = (usbPos.x - usbRect.width*.5) + "px";
    usb.style.top = (usbPos.y - usbRect.height*.9) + "px";

    drawCable();
    drawThorns(10.5,[bez]);
    

}

function drawScreen()
{
    canv.width = window.innerWidth;
    canv.height =  window.innerHeight;

    ctx.beginPath();
    ctx.fillStyle = "rgba(30,30,130,1)";
    ctx.clearRect(0,0,canv.width,canv.height);

    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(30,30,130,1)";

    drawUsb();


    window.requestAnimationFrame(drawScreen);
}

window.requestAnimationFrame(drawScreen);