var socket = io();

$('#searchBox').bind('input',function() {
    socket.emit("userInputSearch", $(this).val())
});

socket.on('connect', function () {
    console.log('Connected to the server.')
});

socket.on('disconnect', function () {
    console.log('Disconnected to the server.')
});

socket.on('resultatFilm', (resultatFilm) => {
    document.getElementById('searchDiv').innerHTML = ``;
    for(const movie of resultatFilm) {
        document.getElementById('searchDiv').innerHTML += ` <div class='uk-card uk-card-default uk-card-body uk-width-1-2@m'> <h3 class='uk-card-title'>${movie.title}</h3> <p>${movie.overview}</p> </div>`;
    }
});
            