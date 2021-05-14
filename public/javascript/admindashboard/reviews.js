/**
 * Approve/Deny
 */

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
let reviewEditType = document.getElementsByName('admin-review-edit-media-type');
let reviewEditMediaId = document.getElementById('admin-review-edit-media-id');
let reviewGetEditForm = document.getElementById('admin-edit-get-review-form');
let reviewEditForm = document.getElementById('admin-edit-edit-review-form');
let reviewEditSubmitBtn = document.getElementById('admin-review-edit-btn');
let reviewEditCancelBtn = document.getElementById('admin-review-edit-cancel');
let reviewEditReviewId = document.getElementById('admin-review-edit-reviewid');
let reviewEditNewRating = document.getElementById('admin-review-edit-new-rating');
let reviewEditNewText = document.getElementById('admin-review-edit-new-text');
let reviewEditListOutput = document.getElementById('admin-edit-reviews-list');
let reviewEditResult = document.getElementById('admin-edit-result');

/**
 * Delete
 */
let reviewDeleteMediaType = document.getElementsByName('admin-review-delete-mediatype');
let reviewDeleteGetBtn = document.getElementById('admin-review-delete-get');
let reviewDeleteSubmitBtn = document.getElementById('admin-review-delete-btn');
let reviewDeleteCancelBtn = document.getElementById('admin-review-delete-cancel');
let reviewDeleteMediaId = document.getElementById('admin-review-delete-media-id');
let reviewDeleteReviewId = document.getElementById('admin-review-delete-reviewid');
let reviewDeleteForm = document.getElementById('admin-delete-review-form');
let reviewDeleteList = document.getElementById('admin-delete-reviews-list');
let reviewDeleteGetForm = document.getElementById('admin-delete-get-review-form');
let reviewDeleteResult = document.getElementById('admin-delete-review-result');

/**
 * Link id
 */
let reviewIdApprovalCard = document.getElementsByClassName('reviewIdApprovalClass');

//Setter funksjon til paragraf til å fylle inn ID
let bindToCardApproval = function() {
    reviewId.value = this.innerHTML;
}
let bindToCardDelete = function() {
    reviewDeleteReviewId.value = this.innerHTML;
}

/**
 * EventListener for å sette inn id
 */
for (let i = 0; i < reviewIdApprovalCard.length; i++) {
    reviewIdApprovalCard[i].addEventListener("click", bindToCardApproval.bind(reviewIdApprovalCard[i]));                 
}

/**
 * EventListener for godkjenning av anmeldelse
 */
approveBtn.addEventListener("click", ()=>{
    socket.emit('approveReview', reviewId.value);
    reviewDenialReason.value = '';
    document.getElementById(reviewId.value).innerHTML = "";
    reviewId.value = '';
});

/**
 * EventListener for å avslå anmeldelse
 */
denyBtn.addEventListener("click", ()=>{
    socket.emit('denyReview', {reviewId: reviewId.value, reason: reviewDenialReason.value});
    reviewDenialReason.value = '';
    document.getElementById(reviewId.value).innerHTML = "";
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
 * EventListener for å endre anmeldelse
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
    reviewOutput.innerHTML = result.information;
});

/**
 * Viser informasjon etter du har avslått en anmeldelse
 */
socket.on('denyReviewResult', (result)=>{
    reviewOutput.innerHTML = result.information;
});

/**
 * EventListener for å hente anmeldelse som skal redigeres
 */
editGetBtn.addEventListener("click", ()=>{
    for(let i = 0; i < reviewEditType.length; i++){
        if(reviewEditType[i].checked){
            socket.emit('getReviewsFromMedia', {type: reviewEditType[i].value, mediaId: reviewEditMediaId.value});
            reviewEditMediaId.innerHTML = "";
            break;
        } else {
            reviewEditResult.innerHTML = "You have to select a mediatype";
        }
    }

});

/**
 * Viser anmeldelser som er hentet
 */
socket.on('getReviewsFromMediaResult', (result)=>{
    reviewEditListOutput.innerHTML = '';
    if(result.information.length > 0){
        reviewGetEditForm.style.display = 'none';
        reviewEditForm.style.display = 'block';
        for(let item of result.information){
            reviewEditListOutput.innerHTML += reviewCard(item);
            
        }
    } else {
        reviewEditResult.innerHTML = 'No reviews found';
    }
});

/**
 * Viser brukeren resultat etter submit
 */
socket.on('editReviewResult', (result) => {
    reviewEditResult.innerHTML = result.information;
});

/**
 * EventListener for å hente reviews
 */
reviewDeleteGetBtn.addEventListener("click", ()=>{
    for(let i = 0; i < reviewDeleteMediaType.length; i++){
        if(reviewDeleteMediaType[i].checked){
            socket.emit('getReviewListToDelete', {type: reviewDeleteMediaType[i].value, mediaId: reviewDeleteMediaId.value});
            reviewDeleteMediaId.value = '';
            break;
        } else {
            reviewDeleteResult.innerHTML = "You have to select a mediatype";
        }
    }
});

/**
 * EventListener for å slette review med satt ID
 */
reviewDeleteSubmitBtn.addEventListener("click", ()=>{
    socket.emit('deleteReview', reviewDeleteReviewId.value);
    document.getElementById("deleteId" + reviewDeleteReviewId.value).innerHTML = "";
    reviewDeleteReviewId.value = '';
});

/**
 * EventListenere for å kansellere
 */
reviewDeleteCancelBtn.addEventListener("click", ()=>{
    reviewDeleteForm.style.display = 'none';
    reviewDeleteList.style.display = 'none';
    reviewDeleteGetForm.style.display = 'block';
});

/**
 * Viser reviews fra filmen som bruker ønsker
 */
socket.on('getReviewFromMediaToDeleteResult', (result) => {
    reviewDeleteResult.innerHTML = '';
    if(result.information.length > 0){
        reviewDeleteGetForm.style.display = 'none';
        reviewDeleteForm.style.display = 'block';
        for(let item of result.information){
            reviewDeleteList.innerHTML += reviewCardDelete(item);
        }
        let reviewIdDeleteCard = document.getElementsByClassName('reviewIdDeleteClass');
        for (let i = 0; i < reviewIdDeleteCard.length; i++) {
            reviewIdDeleteCard[i].addEventListener("click", bindToCardDelete.bind(reviewIdDeleteCard[i]));                 
        }
    }else {
        reviewDeleteGetForm.style.display = 'block';
        reviewDeleteForm.style.display = 'none';
        reviewDeleteResult.innerHTML = 'No reviews found';
    }
});

/**
 * Viser resultat etter sletting av review
 */
socket.on('deleteReviewResult', (result) => {
    reviewDeleteResult.innerHTML = result.information;
});


/**
 *  Lager html kort for hver anmeldelse
 * @param {Object} data 
 * @returns HTML
 */
function reviewCard(data){
    return `<article class="uk-comment uk-comment-primary" id="editId${data._id}">
                <header class="uk-comment-header">
                    <div class="uk-grid-medium uk-flex-middle" uk-grid>
                        <div class="uk-width-auto">
                            <img class="uk-comment-avatar" src="${data.avatar}" width="80" height="80" alt="">
                        </div>
                        <div class="uk-width-expand">
                            <h4 class="uk-comment-title uk-margin-remove">${data.author}</h4>
                            <p class="uk-comment-meta"> ReviewId: </p>
                            <p class="uk-comment-meta uk-text-bolder reviewIdDeleteClass">${data._id}</p>
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
function reviewCardDelete(data){
    return `<article class="uk-comment uk-comment-primary" id="deleteId${data._id}">
                <header class="uk-comment-header">
                    <div class="uk-grid-medium uk-flex-middle" uk-grid>
                        <div class="uk-width-auto">
                            <img class="uk-comment-avatar" src="${data.avatar}" width="80" height="80" alt="">
                        </div>
                        <div class="uk-width-expand">
                            <h4 class="uk-comment-title uk-margin-remove">${data.author}</h4>
                            <p class="uk-comment-meta"> ReviewId:</p>
                            <p class="uk-comment-meta uk-text-bolder reviewIdDeleteClass">${data._id}</p>
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