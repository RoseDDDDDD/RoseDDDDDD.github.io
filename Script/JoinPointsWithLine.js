
function lerp(num1 = 0, num2 = 1, t = .5)
{
    return num1 + (num2-num1) *t;
}

const svg = document.getElementById("svg")
let svgRect = svg.getBoundingClientRect();


const points = document.getElementsByClassName("joint");

let linkedPoints = []; // dictionary
let foundID = [];
let lines = {};


const lineWidth = 2;
const lineCol = "rgb(200,200,200)";
function initiatializeLines()
{ 

    for(let i = 0; i < points.length; i++)
    {
        if (!points[i].getAttribute("data-connectId") || foundID.includes(points[i].getAttribute("data-connectId")) ) continue;
        for(let j = 0; j < points.length; j++)
        {
                if (!points[j].getAttribute("data-connectId") || points[i] == points[j] || points[j].getAttribute("data-connectId") != points[i].getAttribute("data-connectId")) continue;
                foundID.push(points[j].getAttribute("data-connectId"));
                linkedPoints.push([points[i],points[j]]);
        }
    }

    for (let pPair of Object.entries(linkedPoints))
    {
        let p1 = pPair[1][0];

        let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');        
        svg.appendChild(newLine);
        lines[p1.getAttribute("data-connectId")] = [newLine];

        newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');        
        svg.appendChild(newLine);
        lines[p1.getAttribute("data-connectId")].push(newLine);

        newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        svg.appendChild(newLine);
        lines[p1.getAttribute("data-connectId")].push(newLine);


        updateLineVisuals(pPair);

    };
}

window.addEventListener("resize", () => {setTimeout(updateLines, 100)} );

function updateLines()
{
    svgRect = svg.getBoundingClientRect();
    console.log("resizing");
    for (let pPair of Object.entries(linkedPoints))
    {
        updateLineVisuals(pPair);
    };
}

function updateLineVisuals(pPair = [[]])
{
    console.log(pPair);
    let p1 = pPair[1][0];
    let p1Rect = p1.getBoundingClientRect();
    let p2 = pPair[1][1];
    let p2Rect = p2.getBoundingClientRect();
    console.log(p1);
    console.log(p1Rect.height);
    let originx = p1Rect.x + p1Rect.width*.5;
    let originy = (p1Rect.y + p1Rect.height*.5) - svgRect.y;
    let targetx = p2Rect.x + p2Rect.width*.5;
    let targety = (p2Rect.y + p2Rect.height*.5) - svgRect.y;

    const lineArr = lines[p1.getAttribute("data-connectId")]
    console.log(lines)
    lineArr[0].setAttribute('stroke-width',lineWidth + 'px');
    lineArr[0].setAttribute("stroke", lineCol);


    lineArr[0].setAttribute('x1',originx +'px');
    lineArr[0].setAttribute('y1', originy + 'px');
    lineArr[0].setAttribute('x2', lerp(originx,targetx, .2) +'px');
    lineArr[0].setAttribute('y2', originy + 'px');



    lineArr[1].setAttribute('stroke-width',lineWidth + 'px');
    lineArr[1].setAttribute("stroke", lineCol);

    lineArr[1].setAttribute('x1', lerp(originx,targetx, .2) +'px');
    lineArr[1].setAttribute('y1', originy + 'px');
    lineArr[1].setAttribute('x2', lerp(originx,targetx, .8) +'px');
    lineArr[1].setAttribute('y2', targety + 'px');



    lineArr[2].setAttribute('stroke-width',lineWidth + 'px');
    lineArr[2].setAttribute("stroke", lineCol);

    lineArr[2].setAttribute('x1', lerp(originx,targetx, .8) +'px');
    lineArr[2].setAttribute('y1', targety + 'px');
    lineArr[2].setAttribute('x2', targetx +'px');
    lineArr[2].setAttribute('y2', targety + 'px');
}

initiatializeLines();