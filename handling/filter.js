function getSortOrderAZ(prop) {    
    return function(a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;    
    } 
}

function getSortOrderZA(prop) {
    return function(a, b) {
        if (a[prop] < b[prop]) {
            return 1;
        } else if (a[prop] > b[prop]) {
            return -1;    
        }
        return 0;
    }
}

function getSortOrderDateAsc(a, b){
    return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
}

function getSortOrderDateDesc(a, b){
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
}

module.exports = {getSortOrderAZ, getSortOrderZA, getSortOrderDateAsc, getSortOrderDateDesc}