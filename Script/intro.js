
const introMusic = document.getElementById("introSfx");
const roseImg = document.getElementById("rose");
const introDuration = 1;

const roseOpeningPath = "Assets/Visual/RoseFlowering.gif";
const roseBreathingPath = "Assets/Visual/RoseBreathing.gif";


let played = false;



roseImg.addEventListener("plug", function(event)
{
    console.log(event);
    intro(event);
});

function intro(e)
{
    if (played) return;
    
    played = true;
    introMusic.play();
    
    roseImg.src = roseOpeningPath;

    setTimeout(() =>
    {
        thornSize = 20
        roseImg.src = roseBreathingPath;
    },5000);
}


