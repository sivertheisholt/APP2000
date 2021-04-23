let postReview = document.getElementById('reviewPoster');
let reviewText = document.getElementById('reviewText');
let stars = document.querySelectorAll('input[name="rate"]');
let reviewResult = document.getElementById('serieinfo-review-result');
let reviewForm = document.getElementById('serieinfo-review-form');

/**
 * Setter sammen variabler fra review fra serieinfo til et objekt
 * @returns objekt
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