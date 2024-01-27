console.log('let wrtie js');


let songs;
let currfolder;

let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currfolder  = folder;

    // let relativePath = "./songs/";

    // let a = await fetch(relativePath);
    let a = await fetch('https://raw.githubusercontent.com/RoshanGupta05/Spotify/main/songs/song1.mp3');
    let response = await a.text();

    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];

    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML  = songUl.innerHTML + `<li>
                            <img  src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div></div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img  src="play.svg" alt="">
                            </div> </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{

        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
        
        
    })
    
}

const playMusic = (track,pause=false)=>{
    // let audio = new Audio("/songs/"+track)
    currentSong.src = `/${currfolder}/`+track
    if(!pause){
        currentSong.play();
        playsong.src="pause.svg"
    }
    
    

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

   
}

async function main(){   
    await getSongs("songs/ncs");
    playMusic(songs[0], true)

    playsong.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            playsong.src="pause.svg"
        }else{
            currentSong.pause()
            playsong.src = "playsong.svg"
        }
    })

    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e =>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent +"%";
        currentSong.currentTime = ((currentSong.duration)* percent)/100
    })

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    // previous and next
    previous.addEventListener("click",()=>{
        console.log('previous');
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if(index-1 >= 0){
            playMusic(songs[index-1]);
        } 
        
    })

    nextsong.addEventListener("click",()=>{
        console.log('nextsongs');
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if(index+1 < songs.length){
            playMusic(songs[index+1]);
        }       
        
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("setting volume to",e.target.value)
        currentSong.volume = parseInt(e.target.value)/100
        if (currentSong.volume === 0) {
            console.log("Volume is zero. Changing SVG.");
            playMusic.src = "lowvol.svg";
        }
    })

    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            

        })
    })
}
main();


