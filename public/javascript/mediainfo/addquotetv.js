let tvQuoteForm = document.getElementById('serieinfo-quote-form');
let tvQuoteBtn = document.getElementById('serieinfo-quote-button');
let tvQuote = document.getElementById('serieinfo-quote-input');
let tvQuoteId = tvQuote.getAttribute('data-quote-tvid');
let tvQuoteResult = document.getElementById('serieinfo-quote-result');

tvQuoteBtn.addEventListener("click", function(){
    tvQuote = tvQuote.value;
    socket.emit('submitQuote', {mediaId: tvQuoteId, quote: tvQuote, mediaType: 'tv'});
});



socket.on('quoteResult', function(result){
    tvQuoteForm.style.display = 'none';
    tvQuoteResult.innerHTML = result;
});