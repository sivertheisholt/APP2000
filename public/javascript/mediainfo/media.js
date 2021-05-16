let postsToShowOnClick = 16;
let lastDisplayedPost = 16;
var loadMore = document.getElementById('loadMore');
var noMoreMedia = document.getElementById('noMoreMedia');
var socket = io.connect();
let currentMediaDisplayed = popularMedia;
currentMediaDisplayed.slice(0, 16);
var url = url;
var urlPath = urlPath;
/**
 * Henter hvilken type sortering brukeren skal ha og sender videre til socket
 */
document.querySelectorAll('.tv-shows-filter-list ul a').forEach(item => {
    item.addEventListener('click', event => {
        socket.emit(item.id, popularMedia);
    })
});

/**
 * Henter hvilken type sortering brukeren skal ha og sender videre til socket
 */
document.querySelectorAll('.movies-filter-list ul a').forEach(item => {
    item.addEventListener('click', event => {
        socket.emit(item.id, popularMedia);
    })
});

/**
 * Henter hvilken type sjanger brukeren vil sortere etter og sender videre til socket
 */
document.querySelectorAll('.media-genre-list ul a').forEach(item => {
    item.addEventListener('click', event => {
        socket.emit('filterByGenre', {arr: popularMedia, genreId: item.id});
    })
});

/**
 * Viser de 16 første filmene/seriene
 */
socket.on('displayFilteredMedia', function(args){
    currentMediaDisplayed = args;
    document.getElementById('mediaCard').innerHTML = "";
    for(let i = 0; i < 16; i++){
        document.getElementById('mediaCard').innerHTML += mediaCard(args[i]);
    }
    postsToShowOnClick = 16;
    lastDisplayedPost = 16;
    loadMore.style.display = 'block';
    noMoreMedia.style.display = 'none';
});

/**
 * Lager HTML for hver film/serie som skal vises
 * @param {Object} data 
 * @returns HTML
 */
function mediaCard(data){
    return `<a href='/${urlPath}/${url}/${data.id}'
            <div class='uk-card uk-card-default upcoming-card-padding'>
            <div class='uk-card-media-top'><img src=https:\\\\www.themoviedb.org\\t\\p\\w600_and_h900_bestv2\\${data.pictureUrl} onerror="this.onerror=null; this.src='/images/no-poster-default.jpg'" alt=''></div>
            <div class='uk-card-body'><h3 class='uk-card-title'>${data.title}</h3><p>${data.releaseDate}</p></div></div></a>`
}

/**
 * Knapp for å loade 16 filmer om gangen
 * @param {Object} media 
 * @param {event} e 
 */
function load(media, e){
    e.preventDefault();
    if(media.length - lastDisplayedPost < 16){
        postsToShowOnClick = media.length - lastDisplayedPost
        for (let i = lastDisplayedPost; i < postsToShowOnClick + lastDisplayedPost; i++) {
        document.getElementById('mediaCard').innerHTML += mediaCard(media[i]);
        }
        lastDisplayedPost = lastDisplayedPost + postsToShowOnClick;
        if(postsToShowOnClick == 0){
            loadMore.style.display = 'none';
            noMoreMedia.style.display = 'block';
        }
    } else {
        for (let i = lastDisplayedPost; i < lastDisplayedPost + postsToShowOnClick; i++) {
        document.getElementById('mediaCard').innerHTML += mediaCard(media[i]);
        } 

        lastDisplayedPost = lastDisplayedPost + postsToShowOnClick;
    }
}
