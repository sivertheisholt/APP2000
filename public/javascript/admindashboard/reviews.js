let denyBtn = document.getElementById('admin-review-deny');
let approveBtn = document.getElementById('admin-review-approve');
let denyData = denyBtn.getAttribute('data-deny-media-id');
let approveData = approveBtn.getAttribute('data-approve-media-id');
let reviewForm = document.getElementById('admin-review-form');
let reviewOutput = document.getElementById('admin-review-output');
let adminswitcher = document.getElementById('admin-switcher');
let adminAccordion = document.getElementById('admin-review-accordion');
let reviewId = document.getElementById('admin-review-id');
let reviewDenialReason = document.getElementById('admin-review-denial-reason');
approveBtn.addEventListener("click", ()=>{
    socket.emit('approveReview', reviewId.value);
    reviewDenialReason.value = '';
    reviewId.value = '';
});

denyBtn.addEventListener("click", ()=>{
    socket.emit('denyReview', {reviewId: reviewId.value, reason: reviewDenialReason.value});
    reviewDenialReason.value = '';
    reviewId.value = '';
}); 

socket.on('approveReviewResult', (result)=>{
    //reviewForm.style.display = 'none';
    reviewOutput.innerHTML = result.information;
});

socket.on('denyReviewResult', (result)=>{
    //reviewForm.style.display = 'none';
    console.log("client");
    reviewOutput.innerHTML = result.information;
});