var partyCount = 1;

function newparty() {
    if (partyCount <= 10) {
        partyCount += 1;
        $("#partyinputs-table").append(`<tr id="partyTR${partyCount}"><td><input type="text" id="party${partyCount}"/></td><td><input type="text" maxlength="3" onkeyup="this.value = this.value.toUpperCase();" id="acronym${partyCount}"/></td><td><input type="color" id="colour${partyCount}"/></td><td><input type="number" id="seats${partyCount}" max="120" value="0" style="width: 50px;"/></td><td><input type="number" id="order${partyCount}" max="11" value="${partyCount}" style="width: 50px;"/><input type="hidden" value="${partyCount}" class="partyid"></input></td></td><td onclick="deleteRow('partyTR${partyCount}');" style="cursor: pointer;"><i class="fas fa-trash-alt"></i></td></tr>`)
    
        if (partyCount == 11) {
            document.getElementById("addPartyButton").setAttribute("disabled", true);
            document.getElementById("addPartyButton").setAttribute("title", "The maximum of 11 parties has been reached.");
        }
    }
}

function deleteRow(row) {
    const docRow = document.getElementById(row);
    docRow.parentNode.removeChild(docRow);
}

function partyInfoOrderer() {
    const partyOrder = [];
    var orderItr = -1;

    for (const party of (document.getElementById("partyinputs-table")).getElementsByTagName("tr")) {
        orderItr += 1;
        
        if (orderItr > 0) {
            let id = Number(party.getElementsByClassName("partyid")[0].value);
            let acronym = document.getElementById(`acronym${id}`).value;
            let colour = document.getElementById(`colour${id}`).value;
            let seats = Number(document.getElementById(`seats${id}`).value);
            
            partyOrder.push({acronym: acronym, colour: colour, seats: seats});
        }   
    }

    partyOrder.sort((a, b) => {
        return b.seats-a.seats
    });

    for (let i = 0; i < partyOrder.length; i++) {
        partyInfo(partyOrder[i].acronym, partyOrder[i].colour, partyOrder[i].seats)
    }
}

function partyInfo(acronym, colour, seats) {
    var NS = "http://www.w3.org/2000/svg";
    var tspan = document.createElementNS(NS, "tspan");
    tspan.appendChild(document.createTextNode((`${acronym} ${seats}`)));

    tspan.setAttribute("x", "50%");
    tspan.setAttribute("dy", "1.2em");
    tspan.setAttribute("fill", colour);
    tspan.setAttribute("font-weight", "bold");

    document.getElementById("partyinfo-texts").appendChild(tspan);
}

function clearMap() {
    var seatsItr = 1;

    for (const seat of document.getElementById("pog").getElementsByTagName("circle")) {
        if (seatsItr <= 120) {
            seatsItr += 1;
            seat.style.fill = "#c9c9c9";
            seat.innerHTML = "";
        } else if (seatsItr > 120 && seatsItr <= 124) {
            seatsItr += 1;
            seat.style.fill = "white";
            seat.innerHTML = "";
        }
    }
}

function fillmap() {
    clearMap();

    const partyOrder = [];
    var orderItr = -1;

    for (const party of (document.getElementById("partyinputs-table")).getElementsByTagName("tr")) {
        orderItr += 1;
        
        if (orderItr > 0) {
            let id = Number(party.getElementsByClassName("partyid")[0].value);
            let order = Number(document.getElementById(`order${id}`).value);
            
            partyOrder.push({id: id, order: order});
        }   
    }

    partyOrder.sort((a, b) => {
        return a.order-b.order
    });

    document.getElementById("partyinfo-texts").innerHTML = "";

    var filledSeats = 0;
    partyInfoOrderer();

    for (let i = 0; i < partyOrder.length; i++) {
        const partyInOrderN = partyOrder[i].id;
        const party = document.getElementById("partyinputs-table").getElementsByTagName("tr")[partyInOrderN];

        const name = document.getElementById(`party${partyInOrderN}`);
        const acronym = document.getElementById(`acronym${partyInOrderN}`);
        const colour = document.getElementById(`colour${partyInOrderN}`);
        const seats = document.getElementById(`seats${partyInOrderN}`); 
    
        var seatsItr = 0;
        
        for (const seat of document.getElementById("pog").getElementsByTagName("circle")) {
            if (filledSeats < Number((seat.id).substring(4))) {
                if (seatsItr < seats.value) {
                    seat.style.fill = colour.value;
                    seat.innerHTML = `<title>${name.value} Party</title>`;
                    seatsItr += 1;
                    filledSeats += 1;
                }
            }
        }
    }   
}