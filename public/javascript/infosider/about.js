let contactBtn = document.getElementById('contactPostBtn');
let contactForm = document.getElementById('contactForm');


contactBtn.addEventListener("submit", function(e){
    e.preventDefault();
    swal("Submitted!", "Your ticket has been sent to our epic admin team", "success")
    .then(function(value){
        if(value){
            contactForm.submit();
        }
    });
});



/* $(document).on('click', '#contactPostBtn', function(e) {
    e.preventDefault();
    let form = $(this).parents('form');
    swal({
        title: 'Are you sure?',
        text: 'Before post please recheck all transaction and your closing balance is correct, As you cannot alter/delete the transaction after post?',
        icon: 'warning',
        buttons: ["Make Changes", "Yes!"],
    }).then(function(value) {
        if(value){
            form.on("submit", cb);
        }
    });
}); */