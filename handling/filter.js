/**
 * Sorterer et array alfabetisk
 * @param {String} type 
 * @returns Array
 * @author Ørjan Dybevik - 233530
 */

function getSortOrderAZ(type) {    
    return function(a, b) {
        if (a[type] > b[type]) {
            return 1;
        } else if (a[type] < b[type]) {
            return -1;
        }
        return 0;    
    } 
}

/**
 * Sorterer et array motsatt av alfabetisk
 * @param {String} type 
 * @returns Array
 * @author Ørjan Dybevik - 233530
 */
function getSortOrderZA(type) {
    return function(a, b) {
        if (a[type] < b[type]) {
            return 1;
        } else if (a[type] > b[type]) {
            return -1;    
        }
        return 0;
    }
}
/**
 * Sorterer array etter dato fra nyest til eldst
 * @param {Date} a 
 * @param {Date} b 
 * @returns Sortert array
 * @author Ørjan Dybevik - 233530
 */
function getSortOrderDateAsc(a, b){
    return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
}

/**
 * Sorterer array etter dato fra eldst til nyest
 * @param {Date} a 
 * @param {Date} b 
 * @returns Sortert array
 * @author Ørjan Dybevik - 233530
 */

function getSortOrderDateDesc(a, b){
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
}

module.exports = {getSortOrderAZ, getSortOrderZA, getSortOrderDateAsc, getSortOrderDateDesc}