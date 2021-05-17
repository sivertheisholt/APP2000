const reviewCreater = require('../systems/reviewSystem/reviewCreater');
/**
 * kaller på review, og tar inn socket, og sender det tilbake til klienten
 * @param {*} socket 
 * @param {*} review
 */

async function makeAMovieReview(socket, review) {
    const aReview = await reviewCreater.makeReview(new reviewCreater.ReviewMovie(review.userId, review.movieId, review.tekst, review.stars));
    socket.emit('makeAMovieReview_result', aReview);
}

module.exports = makeAMovieReview;