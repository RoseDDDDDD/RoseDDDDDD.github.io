
const HoverDisplay = document.getElementById("HoverDisplay");
let hovering = false;

let mouseX = 0;
let mouseY = 0;

function InitializeHoverables()
{
    /* 

    The HoverInfo class will make itself invisible in the html document so it only is seen via code

    Psuedo code example:
    <item that will trigger hover>
        <class="HoverInfo">

            Html that will be shown inside the hover display

        </HoverInfo>
    </item that will trigger hover>
    */

    const hoverItem = document.getElementsByClassName("HoverInfo");

    for (let i = 0; i < hoverItem.length; i++)
        {
            console.log( hoverItem[i]);

            hoverItem[i].parentElement.addEventListener("mouseenter", function(){hoverStart(hoverItem[i])});
            hoverItem[i].parentElement.addEventListener("mouseleave", hoverEnd);

        }

}


function hoverStart(hoverInfo)
{
    console.log([HoverDisplay.style.left,HoverDisplay.style.top]);
    if (hovering) return;
    hovering = true;


    console.log(hoverInfo);
    HoverDisplay.innerHTML = hoverInfo.innerHTML;
    HoverDisplay.style.width = "fit-content";
    HoverDisplay.style.height = "fit-content";


    HoverDisplay.style.height = HoverDisplay.innerWidth + "px";
    HoverDisplay.style.borderWidth = ".5vh";
    HoverDisplay.style.padding = "1vh 1vw 1vh 1vw";


    hoverUpdate();
}

function hoverEnd()
{
    HoverDisplay.style.padding = "0vh 1vh 0vw 0vw";

    console.log(HoverDisplay.innerWidth + window.innerWidth * 0.01);
    HoverDisplay.style.borderWidth = "0vw";
    HoverDisplay.style.height = "0px";

    hovering = false;
}

function clamp(x,a,b) { return max( a, min(x, b) )}

function clampInsideScreen()
{
    let displayRect = HoverDisplay.getBoundingClientRect();
    
    //console.log(HoverDisplay.style.left);
    //console.log(displayRect.left);
    //console.log(displayRect.width);

    HoverDisplay.style.left = ( displayRect.left - Math.max((displayRect.left + displayRect.width) - window.innerWidth,0)) + "px"; // forcing the display to on the left of the right side of the screen
    HoverDisplay.style.top = ( displayRect.top - Math.max((displayRect.top + displayRect.height) - window.innerHeight,0)) + "px"; // forcing the display to on top of the bottom of the screen
}

function hoverUpdate()
{
    if (hovering == true)
        {
            clampInsideScreen();
            requestAnimationFrame(hoverUpdate);
        }
}

document.addEventListener("mousemove", (e) => {
    HoverDisplay.style.left = (e.clientX + 20 ) + "px";
    HoverDisplay.style.top = e.clientY + "px";

})

InitializeHoverables();