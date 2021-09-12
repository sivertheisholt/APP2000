const logger = require("../logging/logger");
const reviewGetter = require('../systems/reviewSystem/reviewGetter');

//**** Reviews *****/

exports.review_get_approved = async function(req, res) {
    const reviewApprovedResult = await reviewGetter.getApprovedReviewById(req.params.reviewId);
    if(!reviewApprovedResult.status) {
        res.send(reviewApprovedResult.information);
    }
    res.json(reviewApprovedResult.information);
}


//**** Bruker *****/
