const reviewCreater = require('../review/reviewCreater');

async function makeATvReview(socket, review) {
    console.log('Hei jeg eksisterer!')
    console.log('Hei jeg eksisterer!')
    console.log('Hei jeg eksisterer!')
    console.log('Hei jeg eksisterer!')
    console.log('Hei jeg eksisterer!')
    console.log('Hei jeg eksisterer!')
    const aReview = await reviewCreater.makeReview(new reviewCreater.ReviewTv(review.userId, review.tvId, review.tekst, review.stars))
    console.log(aReview);
    socket.emit('makeTvReview_result', aReview);
}

module.exports = makeATvReview;