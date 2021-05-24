let adminTicketId = document.getElementById('admin-ticket-id');
let adminTicketReponse = document.getElementById('admin-ticket-response');
let adminTicketBtn = document.getElementById('admin-ticket-send');
let adminTicketResult = document.getElementById('admin-ticket-result');

/**
 * EventListener for å svare på en ticket
 * @author Ørjan Dybevik - 233530
 */
adminTicketBtn.addEventListener("click", ()=>{
    socket.emit('respondTicket', {ticketId: adminTicketId.value, response: adminTicketReponse.value});
    adminTicketId.value = '';
    adminTicketReponse.value = '';
});

/**
 * Viser informasjon om hvilken ticket som ble svart på
 * @author Ørjan Dybevik - 233530
 */
socket.on('respondTicketResult', (result) => {
    adminTicketResult.innerHTML = result.information;
});