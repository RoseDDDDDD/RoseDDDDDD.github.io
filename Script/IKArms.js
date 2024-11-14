import {Vector2, lerp} from './Modular.js';


class Arm {
    
    constructor(origin)
    {
        console.log(origin);
        this.origin = origin;
        this.segments = [];
        this.segmentJoints = [];
        this.target = null;
    }

    addSegment(seg)
    {
        var bounds = seg.getBoundingClientRect();
        this.segments.push(seg);
        this.segmentJoints.push(new Vector2([bounds.left,bounds.top]));
    }

    setTarget(targ)
    {
        this.target = targ;
    }

    solve()
    {
        // constraining the joints of the chain
        for (var i = this.segmentJoints.length -1; i >= 0; i--) // going backwards in the array
        {
            console.log(i);
            if (i == this.segmentJoints.length -1)
            {
                this.segmentJoints[i] = this.segmentJoints[i].sub((new Vector2([0,0]).elementCenter(this.target))).normalized.mult(this.segments[i].clientWidth).add((new Vector2([0,0]).elementCenter(this.target))) ;
            }else
            {
                this.segmentJoints[i] = this.segmentJoints[i].sub(this.segmentJoints[i+1]).normalized.mult(this.segments[i].clientWidth).add(this.segmentJoints[i+1]);
            }
        }

        for (var i = 0; i < this.segmentJoints.length; i++) // going forward in the array
        {
            if (i == 0)
            {
                this.segmentJoints[i] = (new Vector2([0,0]).elementCenter(this.origin));
            }else
            {
                this.segmentJoints[i] = this.segmentJoints[i].sub(this.segmentJoints[i-1]).normalized.mult(this.segments[i-1].clientWidth).add(this.segmentJoints[i-1]);
            }
        }

        //uptade element visuals
        for (var i = 0; i < this.segments.length; i++)
        {
            
            //console.log(i);
            //if (i == 2)console.log(this.segments[i]);
            //if (i == 2)console.log( this.segmentJoints[i]);

            let ParBound = this.segments[i].parentElement.getBoundingClientRect();

            this.segments[i].style.left = (this.segmentJoints[i].x - ParBound.left) + "px"; 
            this.segments[i].style.top = (this.segmentJoints[i].y - ParBound.top) + "px";

            // calculate the rotation of the current joint.
            // ? : expression is used to specify the case for the last element in the chain- making it point towards the target element. The rest of the elements rotate to point at the next link in the chain.
            var rot =  (i == this.segments.length -1) ? this.segmentJoints[i].sub((new Vector2([0,0]).elementCenter(this.target))).normalized.angle : this.segmentJoints[i].sub(this.segmentJoints[i+1]).normalized.angle;
            rot = rot + 180
            
            console.log(rot);

            this.segments[i].style.transform = "rotate("+rot+"deg)";
            this.segments[i].style.transformOrigin = "left";
        }

        console.log(this);

    }
}

var myArm = new Arm(document.getElementsByClassName("armOrigin")[0]);

var curElement = myArm.origin;
console.log(curElement.nextSibling.nextSibling);
while (curElement.nextSibling.nextSibling.classList.contains("IKArm"))
{
    curElement = curElement.nextSibling.nextSibling;
    myArm.addSegment(curElement);
}

myArm.setTarget(curElement.nextSibling.nextSibling);

console.log(myArm);

function anim()
{
    myArm.solve();
    requestAnimationFrame(anim);
}

anim();



document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        
        let armOffset = myArm.target.parentElement.getBoundingClientRect();
        myArm.target.style.left = (event.clientX - armOffset.left)+ "px"; 
        myArm.target.style.top = (event.clientY - armOffset.top)+ "px";
    }

document.onkeydown = triggerSolver;

function triggerSolver(e)
{
    myArm.solve();
}

