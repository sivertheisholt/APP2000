var socket = io();

socket.on('connect', function () {
    console.log('Connected to the server.')
});

socket.on('disconnect', function () {
    console.log('Disconnected to the server.')
});

socket.on('skaffFilm', (testFilm) => {
    testFilm = testFilm;
    console.log(testFilm);
});
