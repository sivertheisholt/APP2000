let postReview = document.getElementById('reviewPoster');
let reviewText = document.getElementById('reviewText');
let stars = document.getElementById('stars');
let reviewResult = document.getElementById('serieinfo-review-result');
let reviewForm = document.getElementById('serieinfo-review-form');

/**
 * Setter sammen variabler fra review fra serieinfo til et objekt
 * @returns objekt
 */
function lagObjekt() {
    var objekt = {};
    objekt.tekst = reviewText.value;
    objekt.stars = stars.value;
    objekt.userId = userID;
    objekt.tvId = serie_Id;

    return objekt;
}
postReview.addEventListener("click", ()=>{
    socket.emit('makeATvReview', lagObjekt());
});

socket.on('makeTvReview_result', (result)=>{
    reviewResult.innerHTML=result.information;
    if (result.status){
        reviewForm.style.display='none';
    }
})