const reviewCreater = require('../review/reviewCreater');

async function makeAMovieReview(socket, review) {
    const aReview = await reviewCreater.makeReview(new reviewCreater.ReviewMovie(review.userId, review.movieId, review.tekst, review.stars));
    console.log(aReview);
    socket.emit('makeAMovieReview_result', aReview);
}

module.exports = makeAMovieReview;