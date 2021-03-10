var upcomingMovies = upcomingMovies;
let postsToShowOnClick = 16;
let lastDisplayedPost = 16;
var loadMore = document.getElementById('loadMore');
var noMoreMovies = document.getElementById('noMoreMovies');

function movieCard(data){
  return `<div class='uk-card uk-card-default upcoming-card-padding'>
          <div class='uk-card-media-top'><img src=https:\\\\www.themoviedb.org\\t\\p\\w600_and_h900_bestv2\\${data.pictureUrl.substring(1)} alt=''></div>
          <div class='uk-card-body'><h3 class='uk-card-title'>${data.title}</h3><p>${data.releaseDate}</p></div></div>`
}

document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('movieCard').innerHTML += "";
  for (const movie of upcomingMovies.slice(0,16)){
    document.getElementById('movieCard').innerHTML += movieCard(movie);
  }
});
function loadMoreMovies(e){
  e.preventDefault();
  
  if(upcomingMovies.length - lastDisplayedPost < 16){
    postsToShowOnClick = upcomingMovies.length - lastDisplayedPost
    console.log(postsToShowOnClick);
    for (let i = lastDisplayedPost; i < postsToShowOnClick + lastDisplayedPost; i++) {
      document.getElementById('movieCard').innerHTML += movieCard(upcomingMovies[i]);
    }
    lastDisplayedPost = lastDisplayedPost + postsToShowOnClick;
      if(postsToShowOnClick == 0){
        loadMore.style.display = 'none';
        noMoreMovies.style.display = 'block';
      }
  } else {
    for (let i = lastDisplayedPost; i < lastDisplayedPost + postsToShowOnClick; i++) {
      document.getElementById('movieCard').innerHTML += movieCard(upcomingMovies[i]);
    } 

    lastDisplayedPost = lastDisplayedPost + postsToShowOnClick;
  }
}
