const express = require('express');
const router = express.Router();

router.use("/admin", require('./admindashboard'));
router.use("/mediainfo", require('./mediainfo'));
router.use("/auth", require('./userAuth'));
router.use("/infosider", require('./info'));
router.use("/user", require('./dashboard'));
router.use("/actor", require('./actorinfo'));
router.use("/homepage", require('./homepage'));

module.exports = router;