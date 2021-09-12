/** Hoved routing
 * Her går alle routes gjennom
 * @author Ørjan Dybevik - 233530, Sivert - 233518, Sigve - 233511, Govert - 233565
 */

const express = require('express');
const router = express.Router();

router.use("/admin", require('./admindashboard'));
router.use("/mediainfo", require('./mediainfo'));
router.use("/auth", require('./userAuth'));
router.use("/infosider", require('./info'));
router.use("/user", require('./dashboard'));
router.use("/person", require('./personinfo'));
router.use("/home", require('./homepage'));
router.use("/list", require('./list'));
router.use("/api", require('./api'));

module.exports = router;