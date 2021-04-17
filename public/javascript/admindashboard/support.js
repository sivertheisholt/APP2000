let adminTicketId = document.getElementById('admin-ticket-id');
let adminTicketReponse = document.getElementById('admin-ticket-response');
let adminTicketBtn = document.getElementById('admin-ticket-send');
let adminTicketResult = document.getElementById('admin-ticket-result');

adminTicketBtn.addEventListener("click", ()=>{
    socket.emit('respondTicket', {ticketId: adminTicketId.value, response: adminTicketReponse.value});
    adminTicketId.value = '';
    adminTicketReponse.value = '';
});

socket.on('respondTicketResult', (result) => {
    console.log("Responded");
    adminTicketResult.innerHTML = result.information;
});