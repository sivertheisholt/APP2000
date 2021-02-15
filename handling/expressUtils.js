//Denne blir brukt for å håndtere errors, sender til express sin Error
const asyncExpress = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

module.exports = asyncExpress;