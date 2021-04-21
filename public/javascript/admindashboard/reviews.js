let denyBtn = document.getElementById('admin-review-deny');
let approveBtn = document.getElementById('admin-review-approve');
let denyData = denyBtn.getAttribute('data-deny-media-id');
let approveData = approveBtn.getAttribute('data-approve-media-id');
let reviewForm = document.getElementById('admin-review-form');
let reviewOutput = document.getElementById('admin-review-output');
let reviewId = document.getElementById('admin-review-id');
let reviewDenialReason = document.getElementById('admin-review-denial-reason');

/**
 * Edit
 */
 let editGetBtn = document.getElementById('admin-review-edit-get');
let reviewEditType = document.getElementById('admin-review-edit-media-type');
let reviewEditMediaId = document.getElementById('admin-review-edit-media-id');
let reviewGetEditForm = document.getElementById('admin-edit-get-review-form');
let reviewEditForm = document.getElementById('admin-edit-edit-review-form');
let reviewEditSubmitBtn = document.getElementById('admin-review-edit-btn');
let reviewEditCancelBtn = document.getElementById('admin-review-edit-cancel');
let reviewEditReviewId = document.getElementById('admin-review-edit-reviewid');
let reviewEditNewRating = document.getElementById('admin-review-edit-new-rating');
let reviewEditNewText = document.getElementById('admin-review-edit-new-text');
let reviewEditListOutput = document.getElementById('admin-edit-reviews-list');

/**
 * EventListener for godkjenning av anmeldelse
 */
approveBtn.addEventListener("click", ()=>{
    socket.emit('approveReview', reviewId.value);
    reviewDenialReason.value = '';
    reviewId.value = '';
});

/**
 * EventListener for å avslå anmeldelse
 */
denyBtn.addEventListener("click", ()=>{
    socket.emit('denyReview', {reviewId: reviewId.value, reason: reviewDenialReason.value});
    reviewDenialReason.value = '';
    reviewId.value = '';
});

/**
 * EventListener for å kansellere endringer
 */
reviewEditCancelBtn.addEventListener("click", ()=>{
    reviewEditForm.innerHTML = '';
    reviewEditForm.style.display = 'none';
    reviewEditListOutput.innerHTML = '';
    reviewEditListOutput.style.display = 'none';
    reviewGetEditForm.style.display = 'block';
});

/**
 * EventListener for å hente anmeldelser
 */
reviewEditSubmitBtn.addEventListener("click", ()=>{
    socket.emit('editReview', {reviewId: reviewEditReviewId.value, newText: reviewEditNewText.value, newRating: reviewEditNewRating.value});
    reviewEditNewText.value = '';
    reviewEditNewRating.value = '';
    reviewEditReviewId.value = '';
});

/**
 * Viser informasjon etter du har godkjent en anmeldelse
 */
socket.on('approveReviewResult', (result)=>{
    //reviewForm.style.display = 'none';
    reviewOutput.innerHTML = result.information;
});

/**
 * Viser informasjon etter du har avslått en anmeldelse
 */
socket.on('denyReviewResult', (result)=>{
    //reviewForm.style.display = 'none';
    reviewOutput.innerHTML = result.information;
});

/**
 * EventListener for å hente anmeldelse som skal redigeres
 */
editGetBtn.addEventListener("click", ()=>{
    socket.emit('getReviewsFromMedia', {type: reviewEditType.value, mediaId: reviewEditMediaId.value});
    reviewEditType.value = '';
    reviewEditMediaId.value = '';
});

/**
 * Viser anmeldelser som er hentet
 */
socket.on('getReviewsFromMediaResult', (result)=>{
    reviewGetEditForm.style.display = 'none';
    //reviewEditForm.innerHTML = '';
    reviewEditForm.style.display = 'block';
    if(result.status){
        for(let item of result.information){
            reviewEditListOutput.innerHTML += reviewCard(item);
        }
        
    }
    //reviewOutput.innerHTML = result.information;
});

socket.on('editReviewResult', (result) => {
    console.log(result);
});

/**
 *  Lager html kort for hver anmeldelse
 * @param {Object} data 
 * @returns HTML
 */
function reviewCard(data){
    return `<article class="uk-comment uk-comment-primary">
                <header class="uk-comment-header">
                    <div class="uk-grid-medium uk-flex-middle" uk-grid>
                        <div class="uk-width-auto">
                            <img class="uk-comment-avatar" src="${data.avatar}" width="80" height="80" alt="">
                        </div>
                        <div class="uk-width-expand">
                            <h4 class="uk-comment-title uk-margin-remove">${data.author}</h4>
                            <p class="uk-comment-meta uk-text-bolder">ReviewId: ${data._id}</p>
                            <ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">
                                <li>${data.date}</li>
                                <li>Rating: ${data.stars}</li>
                            </ul>
                        </div>
                    </div>
                </header>
                <div class="uk-comment-body">
                    <p>${data.text}</p>
                </div>
            </article>`
}