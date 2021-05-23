let contactBtn = document.getElementById('contactPostBtn');
let contactForm = document.getElementById('contactForm');
let contactTitle = document.getElementById('contactTitle'); 
let contactMail = document.getElementById('contactMail');
let contactText = document.getElementById('contactText');

contactBtn.addEventListener("click", function(e){
    e.preventDefault();
    //Lager info
    ticket = {
        title: contactTitle.value,
        text: contactText.value,
        mail: contactMail.value
    }
    //Sender post
    var jqxhr = $.post(`/en/infosider/contactform`, {ticket: ticket});

    //Om suksess
    jqxhr.done(function(result) {
        swal("Nice!", result.message, "success");
        contactTitle.value = '';
        contactText.value = '';
        contactMail.value = '';
    });

    //Om failure
    jqxhr.fail(function(result) {
        swal("Woops!", result.responseJSON.error, "error");
    });
});