const reviewCreater = require('../review/reviewCreater');

async function lagEnReview(socket, review) {
    const aReview = await reviewCreater.makeReview(new reviewCreater.ReviewMovie(review.userId, review.movieId, review.tekst, review.stars))
    console.log(aReview);
    socket.emit('lagreview_result', aReview);
}

module.exports = lagEnReview;