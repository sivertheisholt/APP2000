var socket = io();

$('#searchBox').on('input',function() {
    if($(this).val() == "") {
        document.getElementById('searchDiv').innerHTML = ``;
    } else {
        socket.emit("userInputSearch", $(this).val())
    }
});

socket.on('connect', function () {
    console.log('Connected to the server.')
});

socket.on('disconnect', function () {
    console.log('Disconnected to the server.')
});

function maxText(data, max){
    if(data.length > max){
        for(let i = max; i < max+20; i++){
            if(data.charAt(i) == ' '){
                return data.slice(0,i-1) + '...';
            }
        }
    }
    return data;
}

socket.on('resultatFilm', (resultatFilm) => {
    document.getElementById('searchDiv').innerHTML = ``;
    for(const movie of resultatFilm) {
        document.getElementById('searchDiv').innerHTML += `<div class="uk-card uk-card-default uk-grid uk-grid-collapse uk-width-3-4 search-result">
                                                                <a href= "http://localhost:3000/mediainfo/filminfo/${movie.id}">
                                                                    <div class="uk-card-media-left uk-cover-container uk-width-auto">
                                                                        <img class="search-image-style center" src="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movie.poster_path}" alt="">
                                                                    </div>
                                                                </a>
                                                                <div class="uk-width-expand">
                                                                    <div class="uk-card-body">
                                                                        <h3 class="uk-card-title">${movie.title}</h3>
                                                                        <p>${maxText(movie.overview, 120)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>`
    }
});
            