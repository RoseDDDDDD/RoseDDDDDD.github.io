import { isOverlapping, Vector2 } from "./Modular.js";

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

document.onmousemove = (e) => {
    mX = e.clientX;
    mY = e.clientY;
}


const numberedLines = document.getElementsByClassName("numberedLines");
console.log(numberedLines);

for (let i = 0; i < numberedLines.length; i++)
{
    const splitLines = numberedLines[i].innerHTML.split("<br>");

    for (let j = 0; j < splitLines.length; j++)
    {
        const zeroCount = 4 - (j+1).toString().length;
        
        console.log(zeroCount)
        splitLines[j] =  `<tt class="numberedLine"> ` + " ".repeat(zeroCount) + (j+1) + " |</tt> " + splitLines[j];
    }

    numberedLines[i].innerHTML = splitLines.join("<br>");
}



function randomlyPlaceChildrenInRect(element, dist)
{
    console.log(element)
    const bounds = element.getBoundingClientRect();
    for (const el of element.children)
    {
        console.log(el.clientHeight);
        el.style.left = ((Math.random()-.5) * dist * element.clientWidth + (element.clientWidth*.5 - el.clientWidth*.5))+ "px";
        el.style.top = ((Math.random()-.5) * dist * element.clientHeight + (element.clientHeight*.5 - el.clientHeight*.5)) + "px";
    }
}


const timeUntillJostleGivesUp = 10;
const jumbleSpeed = 10;
//this only really works if the current ellement stays the same size over time
function jostleElementChildrenUntillFit(element, randomNum)
{
    let jostleCount = 0;
    const bounds = element.getBoundingClientRect();
    for (const child1 of element.children)
    {

        for (const child2 of element.children)
        {
            // skip if the two ellements are the same
            if (child1 === child2) continue;
            const child1Bound = child1.getBoundingClientRect();
            const child2Bound = child2.getBoundingClientRect();

            let alterPos = new Vector2([0,0]);
            if (isOverlapping(child1Bound,child2Bound))
            {
                alterPos = new Vector2([0,0]).rectCenter(child1Bound).sub(
                    new Vector2([0,0]).rectCenter(child2Bound)).normalized.inverse;
                jostleCount++;
    
    
                alterPos = alterPos.mult(jumbleSpeed);
                
                    console.log(child1)
                console.log(child2)
                console.log(alterPos)
                alterPos.x = alterPos.x + (Math.random()-.5) * 10 ;
                alterPos.y = alterPos.y + (Math.random()-.5) * 10 ;
                
                child1.style.top = (child1Bound.top-bounds.top - alterPos.y) + "px";
                child2.style.top = (child2Bound.top-bounds.top + alterPos.y) + "px";

                child1.style.left = (child1Bound.left-bounds.left - alterPos.x) + "px";
                child2.style.left = (child2Bound.left-bounds.left + alterPos.x) + "px";
                
            }

            // clamp within bounds
            const childRect = child1.getBoundingClientRect();
            if (childRect.left < bounds.left){ child1.style.left = "0px"; }
            if (childRect.top < bounds.top) {child1.style.top = "0px"; }
            if (childRect.right > bounds.right) {child1.style.left = bounds.width-childRect.width + "px"; }
            if (childRect.bottom > bounds.bottom) {child1.style.top = bounds.height-childRect.height + "px"; jostleCount++; }
            
            // clamp within bounds
            const child2Rect = child2.getBoundingClientRect();
            if (child2Rect.left < bounds.left){ child2.style.left = "0px"; }
            if (child2Rect.top < bounds.top) {child2.style.top = "0px"; }
            if (child2Rect.right > bounds.right) {child2.style.left = bounds.width-child2Rect.width + "px"; }
            if (child2Rect.bottom > bounds.bottom) {child2.style.top = bounds.height-child2Rect.height + "px"; jostleCount++; }
        }
        
    }
}

const fitBestElements = document.getElementsByClassName("fitBest");
console.log(fitBestElements);

for (const fitParent of fitBestElements)
{
    randomlyPlaceChildrenInRect(fitParent,.2);

    fitParent.onmousemove = () => {jostleElementChildrenUntillFit(fitParent,Math.random());}
    //setTimeout(() => {
    //    jostleElementChildrenUntillFit(fitParent,Math.random());
    //}, 1000);
}