let postReview = document.getElementById('reviewPoster');
let reviewText = document.getElementById('reviewText');
let stars = document.querySelectorAll('input[name="rate"]');
let reviewResult = document.getElementById('filminfo-review-result');
let reviewForm = document.getElementById('filminfo-review-form');

function lagObjekt() {
    let numberOfStars;
    for (const star of stars) {
        if(star.checked) {
            numberOfStars = star.value;
            break;
        }
    };

    var objekt = {};
    objekt.tekst = reviewText.value;
    objekt.stars = numberOfStars;
    objekt.userId = userID;
    objekt.movieId = movieId;

    return objekt;
}

postReview.addEventListener("click", ()=>{
    socket.emit('makeAMovieReview', lagObjekt());
});

socket.on('makeAMovieReview_result', (result)=>{
    reviewResult.innerHTML=result.information;
    if (result.status){
        reviewForm.style.display='none';
    }
});