var partyCount = 1;

function newparty() {
    if (partyCount <= 10) {
        partyCount += 1;
        $("#partyinputs-table").append(`<tr><td><input type="text" id="party${partyCount}"/></td><td><input type="text" id="acronym${partyCount}"/></td><td><input type="color" id="colour${partyCount}"/></td><td><input type="number" id="seats${partyCount}" max="120" value="0" style="width: 50px;"/></td><td><input type="number" id="order${partyCount}" max="11" value="${partyCount}" style="width: 50px;"/><input type="hidden" value="${partyCount}" class="partyid"></input></td></td></tr>`)
    
        if (partyCount == 11) {
            document.getElementById("addPartyButton").setAttribute("disabled", true);
            document.getElementById("addPartyButton").setAttribute("title", "The maximum of 11 parties has been reached.");
        }
    }
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
            
            partyOrder.push({acronym: acronym, colour: colour, seats: seats})
        }   
    }

    partyOrder.sort((a, b) => {
        return b.seats-a.seats
    });

    console.log(partyOrder)

    for (let i = 0; i < partyOrder.length; i++) {
        partyInfo(partyOrder[i].acronym, partyOrder[i].colour, partyOrder[i].seats)
    }
}

function partyInfo(acronym, colour, seats) {
    var NS = "http://www.w3.org/2000/svg";
    var tspan = document.createElementNS(NS, "tspan");
    tspan.appendChild(document.createTextNode((`${acronym} ${seats}`)));

    tspan.setAttribute("x", "50%")
    tspan.setAttribute("dy", "1.2em")
    tspan.setAttribute("fill", colour)
    tspan.setAttribute("font-weight", "bold")

    document.getElementById("partyinfo-texts").appendChild(tspan)
}

function fillmap() {
    const partyOrder = [];
    var orderItr = -1;

    for (const party of (document.getElementById("partyinputs-table")).getElementsByTagName("tr")) {
        orderItr += 1;
        
        if (orderItr > 0) {
            let id = Number(party.getElementsByClassName("partyid")[0].value);
            let order = Number(document.getElementById(`order${id}`).value);
            
            partyOrder.push({id: id, order: order})
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
                    seatsItr += 1;
                    filledSeats += 1;
                }
            }
        }
    }   
}