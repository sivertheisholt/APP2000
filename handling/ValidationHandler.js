/**
 * ValidationHandler klassen brukes for å ha en felles return metode
 * En klasse som inneholder status (Boolean) og informasjon (*)
 */
class ValidationHandler
{
    constructor(status, information) {
        this.status = status;
        this.information = information
    }
}

module.exports = ValidationHandler;