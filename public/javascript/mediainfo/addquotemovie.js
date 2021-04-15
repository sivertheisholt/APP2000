let movieQuoteForm = document.getElementById('filminfo-quote-form');
let movieQuoteBtn = document.getElementById('filminfo-quote-button');
let movieQuote = document.getElementById('filminfo-quote-input');
let movieQuoteId = movieQuote.getAttribute('data-quote-movieid');
let movieQuoteResult = document.getElementById('filminfo-quote-result');

movieQuoteBtn.addEventListener("click", function(){
    movieQuote = movieQuote.value;
    socket.emit('submitQuote', {mediaId: movieQuoteId, quote: movieQuote, mediaType: 'movie'});
});



socket.on('quoteResult', function(result){
    movieQuoteForm.style.display = 'none';
    movieQuoteResult.innerHTML = result;
});