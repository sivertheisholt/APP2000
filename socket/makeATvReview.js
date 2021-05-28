const reviewCreater = require('../systems/reviewSystem/reviewCreater');

/**
 * kaller på review, og tar inn socket, og sender det tilbake til klienten
 * @param {Object} socket Socket som brukes
 * @param {Object} review
 * @author Sigve E. Eliassen - 233511
 */
async function makeATvReview(socket, review) {
    const aReview = await reviewCreater.makeReview(new reviewCreater.ReviewTv(socket.handshake.session.userId, review.tvId, review.tekst, review.stars));
    socket.emit('makeTvReview_result', aReview);
}

module.exports = makeATvReview;