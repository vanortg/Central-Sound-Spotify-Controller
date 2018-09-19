
let artist = "";
let upvote = "<svg height='1792' id='0' viewBox='0 0 1792 1792' width='1792' xmlns='http://www.w3.org/2000/svg'><path class='fill' d='M384 1344q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm1152-576q0-51-39-89.5t-89-38.5h-352q0-58 48-159.5t48-160.5q0-98-32-145t-128-47q-26 26-38 85t-30.5 125.5-59.5 109.5q-22 23-77 91-4 5-23 30t-31.5 41-34.5 42.5-40 44-38.5 35.5-40 27-35.5 9h-32v640h32q13 0 31.5 3t33 6.5 38 11 35 11.5 35.5 12.5 29 10.5q211 73 342 73h121q192 0 192-167 0-26-5-56 30-16 47.5-52.5t17.5-73.5-18-69q53-50 53-119 0-25-10-55.5t-25-47.5q32-1 53.5-47t21.5-81zm128-1q0 89-49 163 9 33 9 69 0 77-38 144 3 21 3 43 0 101-60 178 1 139-85 219.5t-227 80.5h-129q-96 0-189.5-22.5t-216.5-65.5q-116-40-138-40h-288q-53 0-90.5-37.5t-37.5-90.5v-640q0-53 37.5-90.5t90.5-37.5h274q36-24 137-155 58-75 107-128 24-25 35.5-85.5t30.5-126.5 62-108q39-37 90-37 84 0 151 32.5t102 101.5 35 186q0 93-48 192h176q104 0 180 76t76 179z'/></svg>";
let removevote = "<svg height='32px' version='1.1' viewBox='0 0 32 32' width='32px' xmlns='http://www.w3.org/2000/svg' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns' xmlns:xlink='http://www.w3.org/1999/xlink'><g fill='none' fill-rule='evenodd' stroke='none' stroke-width='1'><g><path class='fill' d='M21,6 L25,6 L25,7 L8,7 L8,6 L12,6 L12,5 C12,3.88772964 12.8942627,3 13.9973917,3 L19.0026083,3 C20.1041422,3 21,3.8954305 21,5 L21,6 L21,6 Z M8,8 L8,26.9986131 C8,28.6562333 9.33396149,30 11.0001262,30 L21.9998738,30 C23.6567977,30 25,28.6569187 25,26.9986131 L25,8 L8,8 L8,8 Z M12,11 L12,27 L13,27 L13,11 L12,11 L12,11 Z M16,11 L16,27 L17,27 L17,11 L16,11 L16,11 Z M20,11 L20,27 L21,27 L21,11 L20,11 L20,11 Z M14.0029293,4 C13.4490268,4 13,4.44386482 13,5 L13,6 L20,6 L20,5 C20,4.44771525 19.5621186,4 18.9970707,4 L14.0029293,4 L14.0029293,4 Z' /></g></g></svg>";
let idCount = 0;
let liCount = 0;
let response;
let clock;
let timer;
let cons;
let percent;
let k;
let queue = [];

function id(id) {
    return document.getElementById(id);
}

function getPlaylist () {

}

function findSongs () {
    let url = "https://deckofcardsapi.com/api/deck/new/";
    fetch(url) 
        .then(checkStatus)
        .then(JSON.parse)
        .then(function(responseText) {
            //success: do something with the responseText
            response = responseText;
        })
        .catch(function(error) {
            //error: do something with error
        });
}

function getTracks(player) {
    player.on('player_state_changed', state => {
        player.getCurrentState().then(state => {
            if (state) {
                console.log(state);
                clear();
                console.log(state.track_window.current_track);
                setcover(state.track_window.current_track);
                let nextTracks = state.track_window.next_tracks;
                for (let i = 0; i < nextTracks.length; i++) {
                    buildLi(nextTracks[i]);
                }
            }
        });
    });
}

function setcover(currentTrack) {
    if (currentTrack.name != $("songname").innerText) {
        clearInterval(clock);
        id("mufill").style.width = 0 + "%";
        timer = currentTrack.duration_ms;
        cons = id("backmu").offsetWidth;
        k = (cons / timer) * 50;
        console.log(k, timer, cons);
        percent = 0;
        let sec = timer * 0.001;
        let rem = sec % 60;
        let min = sec / 60;
        id("songdata").innerText = Math.floor(min) + " mins " + Math.ceil(rem) + " sec";
        id("songname").innerText = currentTrack.name;
        id("songartist").innerText = currentTrack.artists[0].name;
        id("playlistcover").style.background = "url(" + currentTrack.album.images[0].url + ")";
        clock = setInterval(progressbar, 50);
    }
}

function progressbar() {
    if (timer < 50) {
        clearInterval(clock);
        id("mufill").style.width = 0 + "%";
        percent = 0;
    } else {
        percent = percent + k;
        id("mufill").style.width = percent + "px";
        timer = timer - 50;
    }
}

function checkStatus(response) {  
    if (response.status >= 200 && response.status < 300) {  
        return response.text();
    } else {  
        return Promise.reject(new Error(response.status+": "+response.statusText)); 
    } 
}

function buildLi (response) {
    let song = new Song();
    song.artist = response.artists[0].name;
    for (let i = 1; i < response.artists.length; i++){
        song.artist = song.artist + ", " + response.artists[i].name;
    }
    song.title = response.name;


    let li = document.createElement("li");
    li.track = song;
    li.id = liCount;
    liCount++;

    let title = document.createElement("div");

    let p = document.createElement("p");
    p.innerHTML = song.title;
    title.appendChild(p);
    li.appendChild(title);

    let aside = document.createElement("aside");
    let i = document.createElement("i");
    i.innerHTML = song.artist;
    i.className = "align-centered";
    aside.appendChild(i);
    li.appendChild(aside);

    let spacer = document.createElement("div");
    spacer.className = "spacer";
    li.appendChild(spacer);
    
    let voting = document.createElement("div");
    voting.id = "votes";

    let upvt = document.createElement("button");
    upvt.id = idCount;
    idCount++;
    // upvt.onmouseover = changeColorSVG;
    // upvt.onmouseout = removeColorSVG;
    upvt.onclick = updateUp;
    upvt.innerHTML = upvote;
    voting.appendChild(upvt);

    let popupcvr = document.createElement("div");
    popupcvr.className = "popupcover";
    let popcontain = document.createElement("div");
    popcontain.className = "popup";
    let span = document.createElement("span");
    span.id = "upvotes";
    span.innerHTML = song.upvote;
    popcontain.appendChild(span);
    popupcvr.appendChild(popcontain);
    voting.appendChild(popupcvr);

    let dwnvt = document.createElement("button");
    dwnvt.id = idCount;
    idCount++;
    // dwnvt.onmouseover = changeColorRedSVG;
    // dwnvt.onmouseout = removeColorSVG;
    dwnvt.onclick = updateTrash;
    dwnvt.innerHTML = removevote;
    voting.appendChild(dwnvt);
    
    let popupcvr2 = document.createElement("div");
    popupcvr2.className = "popupcover";
    let popcontain2 = document.createElement("div");
    popcontain2.className = "popup";
    let span2 = document.createElement("span");
    span2.id = "downvotes";
    span2.innerHTML = song.trashvote;
    popcontain2.appendChild(span2);
    popupcvr2.appendChild(popcontain2);
    voting.appendChild(popupcvr2);

    li.appendChild(voting);

    let ul = id("songqueue");
    ul.appendChild(li);
}


// function changeColorSVG () {
//     let fill = document.getElementsByClassName("fill");
//     fill[this.id].style.fill = "#1ed760";
// }

// function changeColorRedSVG () {
//     let fill = document.getElementsByClassName("fill");
//     fill[this.id].style.fill = "red";
// }

// function removeColorSVG () {
//     let fill = document.getElementsByClassName("fill");
//     fill[this.id].style.fill = "#666666";
// }

function updateTrash () {
    let update =  this.parentNode.parentNode;
    update.track.trashvote++;
    if (!this.nextSibling.children[0].style.display) {
        this.nextSibling.children[0].style.display = "flex";
    }
    this.nextSibling.children[0].children[0].innerHTML = update.track.trashvote;
    if (update.track.trashvote >= 10) {
        update.parentNode.removeChild(update);
        refreshQueue();
    }
}

function updateUp () {
    let update = this.parentNode.parentNode;
    let index = queue.indexOf(update);
    update.track.upvote++;
    this.nextSibling.children[0].style.display = "flex";
    this.nextSibling.children[0].children[0].innerHTML = update.track.upvote;
    while (index > 0 && update.track.upvote > queue[index - 1].track.upvote) {
        let previous = queue[index - 1];
        queue[index] = previous;
        queue[index - 1] = update;
        index--;
    }
    runQueue();
}

function runQueue () {
    let ul = id("songqueue");
    for (let i = 0; i < queue.length; i++) {
        if (queue[i] != null) {
            ul.appendChild(queue[i]);
        }
    }
}

function clear() {
    let ul = id("songqueue");
    ul.innerHTML = "";
}

function refreshQueue () {
    let newQ = [];
    let elements = id("songqueue").children;
    for (let i = 0; i < elements.length; i++) {
        newQ.push(elements[i]);
    }
    queue = newQ;
}

class Song {
    constructor() {
        this.title = "Work harder for me";
        this.artist = "Rihanna";
        this.upvote = 0;
        this.trashvote = 0;
      }
}
