const reviewCreater = require('../systems/reviewSystem/reviewCreater');

async function makeATvReview(socket, review) {
    const aReview = await reviewCreater.makeReview(new reviewCreater.ReviewTv(review.userId, review.tvId, review.tekst, review.stars));
    socket.emit('makeTvReview_result', aReview);
}

module.exports = makeATvReview;