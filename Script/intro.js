
const introMusic = document.getElementById("introSfx");
const roseImg = document.getElementById("rose");
const introDuration = 1;

const roseOpeningPath = "Assets/Visual/Gifs/RoseFlowering.gif";
const roseBreathingPath = "Assets/Visual/Gifs/RoseBreathing.gif";


let played = false;



roseImg.parentElement.addEventListener("plug", function(event)
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
    document.getElementById("portfollio").classList.add("animated");
    document.getElementById("about").classList.add("animated");

    setTimeout(() =>
    {
        thornSize = 20
        roseImg.src = roseBreathingPath;
    },5000);
}


