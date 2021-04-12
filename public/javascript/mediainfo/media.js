let postsToShowOnClick = 16;
let lastDisplayedPost = 16;
var loadMore = document.getElementById('loadMore');
var noMoreMedia = document.getElementById('noMoreMedia');
var socket = io.connect();
let currentMediaDisplayed = popularMedia;
currentMediaDisplayed.slice(0, 16);
var url = url;
var urlPath = urlPath;

document.querySelectorAll('.tv-shows-filter-list ul a').forEach(item => {
    item.addEventListener('click', event => {
        socket.emit(item.id, popularMedia);
    })
});

document.querySelectorAll('.movies-filter-list ul a').forEach(item => {
    item.addEventListener('click', event => {
        socket.emit(item.id, popularMedia);
    })
});

document.querySelectorAll('.media-genre-list ul a').forEach(item => {
    item.addEventListener('click', event => {
        socket.emit('filterByGenre', {arr: popularMedia, genreId: item.id});
    })
});

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

function mediaCard(data){
    return `<a href='/${urlPath}/${url}/${data.id}'
            <div class='uk-card uk-card-default upcoming-card-padding'>
            <div class='uk-card-media-top'><img src=https:\\\\www.themoviedb.org\\t\\p\\w600_and_h900_bestv2\\${data.pictureUrl.substring(1)} alt=''></div>
            <div class='uk-card-body'><h3 class='uk-card-title'>${data.title}</h3><p>${data.releaseDate}</p></div></div></a>`
}

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
