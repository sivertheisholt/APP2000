let adminTicketId = document.getElementById('admin-ticket-id');
let adminTicketReponse = document.getElementById('admin-ticket-response');
let adminTicketBtn = document.getElementById('admin-ticket-send');
let adminTicketResult = document.getElementById('admin-ticket-result');

/**
 * EventListener for å svare på en ticket
 */
adminTicketBtn.addEventListener("click", ()=>{
    socket.emit('respondTicket', {ticketId: adminTicketId.value, response: adminTicketReponse.value});
    adminTicketId.value = '';
    adminTicketReponse.value = '';
});

/**
 * Viser informasjon om hvilken ticket som ble svart på
 */
socket.on('respondTicketResult', (result) => {
    adminTicketResult.innerHTML = result.information;
});