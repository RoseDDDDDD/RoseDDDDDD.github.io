
let tags =
{
    // time tags
    roblox: false,
    college: false,
    university: false,

    // skill tags
    programming: false,
    audio: false,
    art: false,
    ThreeDModeling: false,
    teamwork: false,

    // number of tags enabled
    tagCount: 0
}

lastTag = "none";

let folderLinks = document.getElementsByClassName("folderLink");

let tagButtons = document.getElementsByClassName("tag");

for (let i = 0; i < tagButtons.length; i++)
{
    tagButtons[i].addEventListener("click", ToggleButton);
}

function UpdateFolderLinks()
{
    if (tags.tagCount == 0)
    {
        for (let i = 0; i < folderLinks.length; i++)
            {
                folderLinks[i].style.display = "block";
            }
        return "no tags to filter" ;
    }

    for (let i = 0; i < folderLinks.length; i++)
    {
        //console.log(folderLinks[i]);
        let filtered = false;    
        for (let j = 0; j < Object.keys(tags).length -1; j++)
        {
            if (folderLinks[i].classList.contains(Object.keys(tags)[j]) && tags[Object.keys(tags)[j]] ) filtered = true;
        }

        folderLinks[i].style.display = filtered ? "block" : "none";
    }
}

function ToggleButton(e)
{
    for (let i = 0; i < Object.keys(tags).length; i++)
        {
            if (e.target.classList.contains(Object.keys(tags)[i]))
            {
                tags[Object.keys(tags)[i]] = !tags[Object.keys(tags)[i]];
                if(tags[Object.keys(tags)[i]]) // enable tag
                    {
                        
                        e.target.classList.add("selectedTag");
                        document.getElementById("edgeBlend").className = Object.keys(tags)[i];
                        lastTag = Object.keys(tags)[i];
                        console.log("enabled " + lastTag);
                        tags.tagCount++;
                    } 
                    else // dissable tag
                    {    
                        
                        e.target.classList.remove("selectedTag");
                        tags.tagCount--;

                        if (tags.tagCount > 0 && Object.keys(tags)[i] == lastTag)
                        {
                            console.log(lastTag);

                            let curTag = Math.floor(Math.random() * (Object.keys(tags).length -1));
                            while ( tags[Object.keys(tags)[curTag]] == false)
                            {
                                curTag = Math.floor(Math.random() * (Object.keys(tags).length -1));
                            }
                            console.log("> " + curTag + " - " + Object.keys(tags)[curTag] + ": " + tags[Object.keys(tags)[curTag]]);

                            document.getElementById("edgeBlend").className = Object.keys(tags)[curTag];
                        }else if (tags.tagCount == 0)
                        {
                            document.getElementById("edgeBlend").className = "";
                        }
                    }
                
                    console.log(tags.tagCount);
                    UpdateFolderLinks();

            }
        }
}