let postsToShowOnClick = 16;
let lastDisplayedPost = 16;
var loadMore = document.getElementById('loadMore');
var noMoreMedia = document.getElementById('noMoreMedia');

function mediaCard(data){
    return `<div class='uk-card uk-card-default upcoming-card-padding'>
            <div class='uk-card-media-top'><img src=https:\\\\www.themoviedb.org\\t\\p\\w600_and_h900_bestv2\\${data.pictureUrl.substring(1)} alt=''></div>
            <div class='uk-card-body'><h3 class='uk-card-title'>${data.title}</h3><p>${data.releaseDate}</p></div></div>`
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