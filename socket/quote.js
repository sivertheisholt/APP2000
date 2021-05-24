const ValidationHandler = require('../handling/ValidationHandler');
const quoteCreater = require('../systems/quoteSystem/quoteCreater');

/**
 * Bruker sender en quote til en film/tv-serie til godkjenning
 * @param {Object} socket
 * @param {Object} quote Id til media, quoten og type tv/movie
 * @author Ørjan Dybevik - 233530, Sigve Eliassen - 233511
 */
async function submitQuoteMovie(socket, quote) {
    let result;
    switch(quote.mediaType){
        case 'movie':
            result = await quoteCreater.addQuote({id: socket.handshake.session.userId, mediaId: quote.mediaId, text: quote.quote}, quote.mediaType);
            break;
        case 'tv':
            result = await quoteCreater.addQuote({id: socket.handshake.session.userId, mediaId: quote.mediaId, text: quote.quote}, quote.mediaType);
            break;
    }
    socket.emit('quoteResult', result.information);
}

module.exports = {submitQuoteMovie};