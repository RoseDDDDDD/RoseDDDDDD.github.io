const bgDrag = document.getElementsByClassName("bgDrag");

let mX = 0;
let mY = 0;

for (let i = 0; i < bgDrag.length; i++)
{

    bgDrag[i].addEventListener("mouseenter", (e) => {
        mX = e.clientX;
        mY = e.clientY;

        

    });

    (function(element) {
        element.addEventListener("mousemove", (e) => bgDragMouseMove(element));
    })(bgDrag[i]);
}



const bgOvershoot = .1;
function bgDragMouseMove(elemnt)
{
    const e = window.event;

    if (elemnt.style.backgroundPositionX == "" || elemnt.style.backgroundPositionY == "") {
        elemnt.style.backgroundPositionX = "0px"; 
        elemnt.style.backgroundPositionY = "0px"; 
        return;
    }

    let bgpX = parseInt(elemnt.style.backgroundPositionX.replace("px",""),10);
    let bgpY = parseInt(elemnt.style.backgroundPositionY.replace("px",""),10);

    bgpX = bgpX + (e.clientX - mX) + ((e.clientX - mX) * (e.clientX - mX) * Math.sign(e.clientX - mX) * bgOvershoot);
    bgpY = bgpY + (e.clientY - mY) + ((e.clientY - mY) * (e.clientY - mY) * Math.sign(e.clientY - mY) * bgOvershoot);
    
    elemnt.style.backgroundPositionX = bgpX + "px";
    elemnt.style.backgroundPositionY = bgpY + "px";

    mX = e.clientX;
    mY = e.clientY;
}
