let movieQuoteForm = document.getElementById('filminfo-quote-form');
let movieQuoteBtn = document.getElementById('filminfo-quote-button');
let movieQuote = document.getElementById('filminfo-quote-input');
let movieQuoteId = movieQuote.getAttribute('data-quote-movieid');
let movieQuoteResult = document.getElementById('filminfo-quote-result');

/**
 * EventListener for å legge quote til i film
 * @author Ørjan Dybevik - 233530
 */
movieQuoteBtn.addEventListener("click", function(){
    movieQuote = movieQuote.value;
    socket.emit('submitQuote', {mediaId: movieQuoteId, quote: movieQuote, mediaType: 'movie'});
});

/**
 * Viser svar fra socket om quote er lagt til eller ikke
 * @author Ørjan Dybevik - 233530
 */
socket.on('quoteResult', function(result){
    movieQuoteForm.style.display = 'none';
    movieQuoteResult.innerHTML = result;
});