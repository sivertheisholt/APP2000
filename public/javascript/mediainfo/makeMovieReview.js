let postReview = document.getElementById('reviewPoster');
let reviewText = document.getElementById('reviewText');
let stars = document.querySelectorAll('input[name="rate"]');
let reviewResult = document.getElementById('filminfo-review-result');
let reviewForm = document.getElementById('filminfo-review-form');

/**
 * Setter sammen variabler fra review fra filminfo til et objekt
 * @returns {Object} Objekt med tekst, stjerner, brukerId, filmId.
 * @author Sigve E. Eliassen - 233511
 */
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
/**
 * Eventlistener som sender review informasjon til server via socket.
 * @author Sigve E. Eliassen - 233511, Ørjan Dybevik - 233530
 */
if(isLoggedIn && !hasPendingReview && !hasAnyReview && !isReviewed){
    postReview.addEventListener("click", ()=>{
        socket.emit('makeAMovieReview', lagObjekt());
    });
}


/**
 * Funksjon som ser etter svar på server via socket om review informasjon kom fler ordentlig.
 * Hvis den kom fram så skjuler den reviewForm.
 * @author Sigve E. Eliassen - 233511
 */
socket.on('makeAMovieReview_result', (result)=>{
    reviewResult.innerHTML=result.information;
    if (result.status){
        reviewForm.style.display='none';
    }
});