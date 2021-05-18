/**
 * ValidationHandler klassen brukes for å ha en felles return metode
 * En klasse som inneholder status (Boolean) som er statusen på operasjonen og informasjon (*) som kan være hva som helst
 */
class ValidationHandler
{
    constructor(status, information) {
        this.status = status;
        this.information = information
    }
}

module.exports = ValidationHandler;