

// theres must be a 
const clickSFXID = "click";
const hoverSFXID = "hover";


// example of how to format a folder

//<div class="folderLink">commiting & pushing</div> 
//<div class="folder" data-parentBound="2">
//      <div class="handleBar dragable"> <p>drag me</p> <div class="x"></div></div>
//</div>

//data-parentBound refers to what div the folder will be allowed to move in. eg.
/*
    <div>
        <div>
            <div class="folder" data-parentBound="1"> 
    
            </div>
        </div>
    </div>

the parent of the folder will constrain the draggble to be within it's visual bounds
if no value is given it will default to the entire website window

*/


//the draggable classs can be used on anything and not just folders.


//#region genericFunctions

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

//#endregion genericFunctions

//#region draggable objects

var MousePosDown = [
    x = 0,
    y = 0
]
var MouseMoveAmmount = [
    x = 0,
    y = 0
]
var MouseChange = [
    x = 0,
    y = 0
]

lastUpdateScrollAmmount = 0;
scrollAmount = 0;


var parentRectOffset = [
    x = 0,
    y = 0,
]

var mouseDown = false;

document.onmousedown = (event) => {
    mouseDown = true;
    MousePosDown.x = event.clientX;
    MousePosDown.y = event.clientY
}

document.onmouseup = (event) => {
    mouseDown = false;

    if (constraints.draggedElement != null)
    {
        StopDrag();
    }
    
}

document.onscroll = () => {
    //console.log(window.scrollY);
    //console.log(lastUpdateScrollAmmount);
    console.log(scrollAmount);

    scrollAmount = lastUpdateScrollAmmount - window.scrollY;
    lastUpdateScrollAmmount = window.scrollY;

    MousePosDown.y += scrollAmount;
    MouseChange.y -= scrollAmount

    Drag();
}

document.onmousemove = (event) => {

    MouseMoveAmmount.x = event.clientX - (MouseChange.x + MousePosDown.x);
    MouseMoveAmmount.y = event.clientY - (MouseChange.y + MousePosDown.y);

    MouseChange.x = event.clientX - MousePosDown.x;
    MouseChange.y = event.clientY - MousePosDown.y;

    Drag();
}




// #region element Constraints Class

class ElementConstraint
{
    constructor (elem, bound){
        this.draggedElement = null;
        this.draggedElemntBounds = null;
        this.parBound = bound;

        this.OriginalElementPos = [
            x = 0,
            y = 0
        ]

        this.rectOffset = [
            x = 0,
            y = 0,
        ]

        if (typeof elem === 'undefined') return;

        this.NewConstraints(elem,bound);
    }

    NewConstraints(elem, bound)
    {

        this.draggedElement = elem;
        this.draggedElemntBounds = this.draggedElement.parentElement;
        this.parBound = bound;

        this.OriginalElementPos.x = parseInt(this.draggedElement.style.left) || 0;
        this.OriginalElementPos.y = parseInt(this.draggedElement.style.top) || 0;

        this.rectOffset.x = 0;
        this.rectOffset.y = 0;

        if (typeof bound === 'undefined') return;

        this.CalcRectOffset();
    }

    CalcRectOffset()
    {

        console.log("parentBound = " + this.parBound);

        if ( typeof this.parBound !== 'undefined' )
        {
            this.rectOffset.x = (parseInt(this.draggedElemntBounds.style.left) || 0);
            this.rectOffset.y = (parseInt(this.draggedElemntBounds.style.top) || 0);

            for (let i = 0; i < this.parBound; i++)
            {


                this.draggedElemntBounds = this.draggedElemntBounds.parentElement;


                this.rectOffset.x -= (parseInt(this.draggedElemntBounds.parentElement.style.left) || 0) - (parseInt(this.draggedElemntBounds.style.left) || 0);
                this.rectOffset.y -= (parseInt(this.draggedElemntBounds.parentElement.style.top) || 0) - (parseInt(this.draggedElemntBounds.style.top) || 0);
                console.log("offsetRect = " + this.rectOffset.x + "," + this.rectOffset.y);
                
            }
        }
    }

    ConstrainAndMove()
    {
        this.draggedElement.style.transition = "transform .1s";
        this.draggedElement.style.transform = "rotate(" + clamp(MouseMoveAmmount.x,-30,30) + "deg)";



        var tempLeft = (this.OriginalElementPos.x + MouseChange.x);
        var tempTop = (this.OriginalElementPos.y + MouseChange.y);

        tempLeft = Math.max(tempLeft , 0 - this.rectOffset.x);
        tempTop = Math.max(tempTop , 0 - this.rectOffset.y);

        tempLeft = Math.min(tempLeft,  (this.draggedElemntBounds.clientWidth - this.rectOffset.x)- this.draggedElement.clientWidth );
        tempTop = Math.min(tempTop,  (this.draggedElemntBounds.clientHeight - this.rectOffset.y )- this.draggedElement.clientHeight );

        this.draggedElement.style.left = tempLeft + "px";
        this.draggedElement.style.top = tempTop + "px";

    }


    Constrain()
    {
        this.draggedElemntBounds = this.draggedElement.parentElement;
        this.CalcRectOffset();


        this.draggedElement.style.left = this.OriginalElementPos.x + "px";
        this.draggedElement.style.top = this.OriginalElementPos.y + "px";

        this.rectOffset.x = 0;
        this.rectOffset.y = 0;

        var boundRect = this.draggedElemntBounds.getBoundingClientRect();
        var elemRect = this.draggedElement.getBoundingClientRect();

        this.rectOffset.x = Math.max(0, boundRect.x - elemRect.x) + Math.min(0, boundRect.right - elemRect.right);
        this.rectOffset.y = Math.max(0,boundRect.y - elemRect.y) + Math.min(0,boundRect.bottom - elemRect.bottom);


        this.draggedElement.style.left = this.OriginalElementPos.x + this.rectOffset.x + "px";
        this.draggedElement.style.top = this.OriginalElementPos.y + this.rectOffset.y + "px";
    }
}

// #endregion element Constraints Class

var constraints = new ElementConstraint();

var childFolderConstraints = [0,0];

function Drag()
{
    if (constraints.draggedElement == null) return;
    constraints.ConstrainAndMove();

    ConstrainChildFolders();
    
}

function ConstrainChildFolders()
{
    if (childFolderConstraints.length > 0)
    {
        console.log("trying to constrain");
        for (let i = 0; i < childFolderConstraints.length; i++)
        {
            childFolderConstraints[i].Constrain();
        }
    }   
}

function CreateChildFolderConstraints(elem)
{
    var kids = elem.parentElement.querySelectorAll('.folder');
    console.log(kids);
    for (let i = 0; i < kids.length; i++)
    {
        childFolderConstraints.push(new ElementConstraint(kids[i], kids[i].dataset.parentbound));
    }
    
    console.log(childFolderConstraints);
}

function ReleaseChildFolders()
{
    if (!childFolderConstraints.length > 0) return;

    //for (let i = 0; i < childFolderConstraints.length; i++)
    {

    }
    childFolderConstraints.splice(0,childFolderConstraints.length);
}

function StopDrag()
{

    constraints.draggedElement.style.transition = "transform 1s";

    document.body.classList.remove('noTextSelection');
    MouseMoveAmmount.x = 0;
    constraints.draggedElement.style.transform = "rotate(" + MouseMoveAmmount.x + "deg)";

    constraints.draggedElement = null;
    ReleaseChildFolders();
}


function StartDrag(elem)
{
    constraints.NewConstraints(elem.parentElement,elem.parentElement.dataset.parentbound);

    childFolderConstraints.splice(0,childFolderConstraints.length);
    CreateChildFolderConstraints(elem);

    MouseMoveAmmount.x = 0 ;
    constraints.draggedElement.style.transition = "transform 1s";
    constraints.draggedElement.style.transform = "rotate(" + 0 + "deg)";

    constraints.draggedElement.style.left = constraints.OriginalElementPos.x + "px";
    constraints.draggedElement.style.top = constraints.OriginalElementPos.y + "px";

    document.body.classList.add('noTextSelection');


}

//#endregion draggable objects

//#region FolderPopUp

function ToggleFolder(linkPoint,elem)
{
    if (elem.style.display == "inline")
    {
        elem.style.display = "none";
        return;
    }

    elem.style.display = "inline";
    var linkRect = linkPoint.getBoundingClientRect();
    var elemRect = elem.getBoundingClientRect();

    var elemx = (parseInt(elem.style.left) || 0);
    var elemy = (parseInt(elem.style.top) || 0);

    elemx += linkRect.x - elemRect.x;
    elemy += linkRect.bottom - elemRect.y;

    elemx -= elemRect.width * .5 - linkRect.width * .5;

    elem.style.left = elemx + "px";
    elem.style.top = elemy + "px";


    StartDrag(elem.children[0]);
    constraints.Constrain();
    StopDrag();

}


function DissableFolder(elem)
{
    elem.parentElement.parentElement.style.display = "none";
}

//#endregion FolderPopUp

//#region audio

var curAudio = undefined;
function PlaySFX(audioID)
{
    curAudio = document.getElementById(audioID);

    if (typeof curAudio === 'undefined') { console.error("No Audio Found"); return; }

    curAudio.pause();
    curAudio.currentTime = 0;
    curAudio.play();

}

//#endregion audio




//#region setupLoops


var rose = document.getElementById("rose");
var bootingUPAudio = document.getElementById("bootUp");
function StartUp()
{
    if (rose === undefined || bootingUPAudio === undefined) return;

    bootingUPAudio.play();
    rose.src = "RoseOS/images/RoseOpening.gif";

    setTimeout(2310);

    setTimeout(() => {
        rose.src = "RoseOS/images/RoseBreathing.gif";

        setTimeout(() => {
            document.body.style.transition = "all 1s";
            document.body.style.transform = "translate(0%,200%)";

            setTimeout(() => {
                window.location.href = "Pages/Main.html";
        
            }, 1000);
    
        }, 3500);

    }, 2500);
    

}





function FindNextSiblingOfClass(elem, className)
{
    var indx = 0;
    var elemPar = elem.parentElement; 

    console.log(elemPar.tagName);
    if (elemPar.tagName == "P"){
        elemPar = elemPar.parentElement;
        indx = Array.prototype.indexOf.call(elemPar.children,elem.parentElement);
        console.log("p p pp p p p p p p p p p ");
    }else
    {
        indx = Array.prototype.indexOf.call(elemPar.children,elem);
    }

    for (let i = indx; i < elemPar.children.length; i++)
    {
        if (elemPar.children[i].classList.contains(className))
        {
            return elemPar.children[i];
        }
    }

}


var elementsThatClose = document.getElementsByClassName('x');

// Attach the event listener to each element
for (var i = 0; i < elementsThatClose.length; i++) {
    elementsThatClose[i].addEventListener('mousedown', function() {
        DissableFolder(this);
        PlaySFX(clickSFXID);   
    });
  
    elementsThatClose[i].addEventListener('mouseover', (event) => {
        event.stopPropagation();
        
        if (event.target == this) PlaySFX(hoverSFXID);   
});
}

var elementsThatOpen = document.getElementsByClassName('folderLink');
// Attach the event listener to each element
for (var i = 0; i < elementsThatOpen.length; i++) {

    console.log(elementsThatOpen[i]);

    let linkedFolderElem = FindNextSiblingOfClass(elementsThatOpen[i],"folder");

    console.log(linkedFolderElem);
    elementsThatOpen[i].addEventListener('click', (event) => {

        if (! ("buttons" in event)) return;

        ToggleFolder(event.target, linkedFolderElem);
        PlaySFX(clickSFXID);   
    });

    elementsThatOpen[i].addEventListener('mouseover', function(event) {

        if (this == event.target && !this.contains(event.relatedTarget)) PlaySFX(hoverSFXID);
        
    });
}

var elementsThatDrag = document.getElementsByClassName('dragable');
for (var i = 0; i < elementsThatDrag.length; i++) {


            elementsThatDrag[i].addEventListener('mousedown', function() {
                StartDrag(this);
                PlaySFX(clickSFXID);   
            });
}

if (elementsThatDrag.length > 0)
{
    StartDrag(elementsThatDrag[0]);
    StopDrag();
}

//#endregion setupLoops


