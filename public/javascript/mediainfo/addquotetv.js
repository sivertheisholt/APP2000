let tvQuoteForm = document.getElementById('serieinfo-quote-form');
let tvQuoteBtn = document.getElementById('serieinfo-quote-button');
let tvQuote = document.getElementById('serieinfo-quote-input');
let tvQuoteId = tvQuote.getAttribute('data-quote-tvid');
let tvQuoteResult = document.getElementById('serieinfo-quote-result');

/**
 * EventListener for å legge quote til i serie
 * @author Ørjan Dybevik - 233530, Sigve E. Eliassen - 233511.
 */
tvQuoteBtn.addEventListener("click", function(){
    tvQuote = tvQuote.value;
    socket.emit('submitQuote', {mediaId: tvQuoteId, quote: tvQuote, mediaType: 'tv'});
});

/**
 * Viser svar fra socket om quote er lagt til eller ikke
 * @author Ørjan Dybevik - 233530, Sigve E. Eliassen - 233511.
 */
socket.on('quoteResult', function(result){
    tvQuoteForm.style.display = 'none';
    tvQuoteResult.innerHTML = result;
});