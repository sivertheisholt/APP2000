// @ts-ignore
var socket = io();

$('#searchBox').on('input',function() {
    if($(this).val() == "") {
        document.getElementById('searchDiv').style.display = 'none';
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
    document.getElementById('searchDiv').style.display = 'block';
    for(const movie of resultatFilm) {
        document.getElementById('searchDiv').innerHTML += `<a href= "https://filmatoryeksamen.herokuapp.com/en/mediainfo/filminfo/${movie.id}">
                                                                <div class="uk-card uk-card-default uk-grid uk-grid-collapse uk-width-1-1@s search-result">
                                                                    <div class="uk-card-media-left uk-cover-container uk-width-auto">
                                                                        <img class="search-image-style center" src="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movie.poster_path}" onerror="this.onerror=null; this.src='/images/no-poster-default.jpg'" alt="">
                                                                    </div>
                                                                    <div class="uk-width-expand">
                                                                        <div class="uk-card-body">
                                                                            <h3 class="uk-card-title">${movie.title}</h3>
                                                                            <p>${maxText(movie.overview, 120)}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </a>`
    }
});
            