var partyCount = 1;

function newparty() {
    if (partyCount <= 10) {
        partyCount += 1;
        $("#partyinputs-table").append(`<tr id="partyTR${partyCount}"><td><input type="text" class="input is-small" id="party${partyCount}"/></td><td><input class="input is-small" type="text" maxlength="3" onkeyup="this.value = this.value.toUpperCase();" id="acronym${partyCount}"/></td><td><input class="input is-small" type="color" id="colour${partyCount}"/></td><td><input class="input is-small" type="number" id="seats${partyCount}" onkeyup="maxNumberFix('seats${partyCount}', 0, 120);" min="0" max="120" value="0" style="width: 50px;"/></td><td><input class="input is-small" type="number" id="order${partyCount}" onkeyup="maxNumberFix('order${partyCount}', 1, 11);" min="1" max="11" value="${partyCount}" style="width: 50px;"/><input type="hidden" value="${partyCount}" class="partyid"></input></td></td><td onclick="deleteRow('partyTR${partyCount}');" style="cursor: pointer;"><i class="fas fa-trash-alt has-text-danger"></i></td></tr>`)
    
        if (partyCount == 11) {
            document.getElementById("addPartyButton").setAttribute("disabled", true);
            document.getElementById("addPartyButton").setAttribute("title", "The maximum of 11 parties has been reached.");
        }
    }
}

function deleteRow(row) {
    const docRow = document.getElementById(row);
    docRow.parentNode.removeChild(docRow);

    if (partyCount == 11) {
        document.getElementById("addPartyButton").removeAttribute("disabled");
        document.getElementById("addPartyButton").removeAttribute("title");
    }
    
    partyCount -= 1;
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
    tspan.setAttribute("font-family", 'BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif');

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

    SVGToPNG(document.getElementById('seatMapSVG').innerHTML);
}

function generateMapDownload(filename, text) {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function svg2img(svg){
    var svg64 = btoa(svg);
    var b64start = 'data:image/svg+xml;base64,';
    var image64 = b64start + svg64;
    return image64;
};

 /**
  * converts an svg string to base64 png using the domUrl
  * @param {string} svgText the svgtext
  * @param {number} [margin=0] the width of the border - the image size will be height+margin by width+margin
  * @param {string} [fill] optionally backgrund canvas fill
  * @return {Promise} a promise to the bas64 png image
  */
  var svgToPng = function (svgText, margin,fill) {
    // convert an svg text to png using the browser
    return new Promise(function(resolve, reject) {
      try {
        // can use the domUrl function from the browser
        var domUrl = window.URL || window.webkitURL || window;
        if (!domUrl) {
          throw new Error("(browser doesnt support this)")
        }
        
        // figure out the height and width from svg text
        var match = svgText.match(/height=\"(\d+)/m);
        var height = match && match[1] ? parseInt(match[1],10) : 200;
        var match = svgText.match(/width=\"(\d+)/m);
        var width = match && match[1] ? parseInt(match[1],10) : 200;
        margin = margin || 0;
        
        // it needs a namespace
        if (!svgText.match(/xmlns=\"/mi)){
          svgText = svgText.replace ('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ') ;  
        }
        
        // create a canvas element to pass through
        var canvas = document.createElement("canvas");
        canvas.width = (height+margin*2) - 125;
        canvas.height = (width+margin*2) + 110;
        var ctx = canvas.getContext("2d");
        
        
        // make a blob from the svg
        var svg = new Blob([svgText], {
          type: "image/svg+xml;charset=utf-8"
        });
        
        // create a dom object for that image
        var url = domUrl.createObjectURL(svg);
        
        // create a new image to hold it the converted type
        var img = new Image;
        
        // when the image is loaded we can get it as base64 url
        img.onload = function() {
          // draw it to the canvas
          ctx.drawImage(this, margin, margin);
          
          // if it needs some styling, we need a new canvas
          if (fill) {
            var styled = document.createElement("canvas");
            styled.width = canvas.width;
            styled.height = canvas.height;
            var styledCtx = styled.getContext("2d");
            styledCtx.save();
            styledCtx.fillStyle = fill;   
            styledCtx.fillRect(0,0,canvas.width,canvas.height);
            styledCtx.strokeRect(0,0,canvas.width,canvas.height);
            styledCtx.restore();
            styledCtx.drawImage (canvas, -10,0);
            canvas = styled;
          }
          // we don't need the original any more
          domUrl.revokeObjectURL(url);
          // now we can resolve the promise, passing the base64 url
          resolve(canvas.toDataURL());
        };
        
        // load the image
        img.src = url;
        
      } catch (err) {
        reject('failed to convert svg to png ' + err);
      }
    });
  };

function SVGToPNG(svg) {
    svgToPng(svg, 0, "#FFFFFF").then(png => {
        document.getElementById("dlSeatMapPNG").setAttribute("download", "seatmap.png");
        document.getElementById("dlSeatMapPNG").setAttribute("href", png);
    });
}

function maxNumberFix(id, min, max) {
    const element = document.getElementById(id).value;
    if (element > max) document.getElementById(id).value = max;
    if (element < min) document.getElementById(id).value = min;
}

// Get all dropdowns on the page that aren't hoverable.
const dropdowns = document.querySelectorAll('.dropdown:not(.is-hoverable)');

if (dropdowns.length > 0) {
  // For each dropdown, add event handler to open on click.
  dropdowns.forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      el.classList.toggle('is-active');
    });
  });

  // If user clicks outside dropdown, close it.
  document.addEventListener('click', function(e) {
    closeDropdowns();
  });
}

/*
 * Close dropdowns by removing `is-active` class.
 */
function closeDropdowns() {
  dropdowns.forEach(function(el) {
    el.classList.remove('is-active');
  });
}

// Close dropdowns if ESC pressed
document.addEventListener('keydown', function (event) {
  let e = event || window.event;
  if (e.key === 'Esc' || e.key === 'Escape') {
    closeDropdowns();
  }
});