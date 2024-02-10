const introMusic = document.getElementById("introSfx");
const introDuration = 1;

const roseOpeningPath = "Assets/RoseFlowering.gif";
const roseBreathingPath = "Assets/roseBreathing.gif";


let played = false;



function intro(img)
{
    if (played) return;
    
    played = true;
    introMusic.play();

    img.src = roseOpeningPath;

    setTimeout(() =>
    {
        img.src = roseBreathingPath;

    },5000);
}


