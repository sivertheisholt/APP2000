let postReview = document.getElementById('reviewPoster');
let reviewText = document.getElementById('reviewText');
let stars = document.getElementById('stars');
let reviewResult = document.getElementById('filminfo-review-result');
let reviewForm = document.getElementById('filminfo-review-form');


function lagObjekt() {
    var objekt = {};
    objekt.tekst = reviewText.value;
    objekt.stars = stars.value;
    objekt.userId = userID;
    objekt.movieId = movieId;

    return objekt;
}

postReview.addEventListener("click", ()=>{
    socket.emit('makeAMovieReview', lagObjekt());
});

socket.on('makeAMovieReview_result', (result)=>{
    console.log(result);
    console.log('!!!!!!!!!!!!!!!!!!!!!');
    reviewResult.innerHTML=result.information;
    if (result.status){
        reviewForm.style.display='none';
    }
});