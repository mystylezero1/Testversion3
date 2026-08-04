/* ======================================
   Wedding App 2.0
   Hauptprogramm
   Hochzeitsgesellschaft Anja & Dino
====================================== */


let guests = [];

let tables = {};



/* ======================================
   START
====================================== */


document.addEventListener(
    "DOMContentLoaded",
    startApp
);



async function startApp(){


    console.log(
        "💍 Wedding App 2.0 gestartet"
    );


    await loadGuests();


    createTables();


    createSeats();


}





/* ======================================
   DATEN LADEN
====================================== */


async function loadGuests(){


    try {


        const response =
            await fetch(
                CONFIG.data.file
            );


        guests =
            await response.json();



        console.log(
            "Gäste geladen:",
            guests.length
        );


        prepareTables();



    }
    catch(error){


        console.error(
            "Fehler beim Laden der Gäste:",
            error
        );


    }


}





/* ======================================
   TISCHE VORBEREITEN
====================================== */


function prepareTables(){


    tables = {};



    guests.forEach(
        guest => {



            const table =
                guest.tisch;



            if(
                !tables[table]
            ){

                tables[table] = [];

            }



            tables[table].push(
                guest
            );



        }
    );


    console.log(
        "Tische:",
        tables
    );


}





/* ======================================
   SVG TISCHE ERSTELLEN
====================================== */


function createTables(){


    const container =
        document.getElementById(
            "table-container"
        );



    if(!container)
        return;



    let positionX = 250;

    let positionY = 220;



    Object.keys(tables)
        .forEach(
            tableNumber => {



            if(
                tableNumber === "Braut"
            )
            {

                return;

            }



            const group =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "g"
                );



            group.setAttribute(
                "id",
                `table-${tableNumber}`
            );



            group.classList.add(
                "table"
            );



            group.dataset.table =
                tableNumber;



            const circle =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "ellipse"
                );



            circle.setAttribute(
                "cx",
                positionX
            );


            circle.setAttribute(
                "cy",
                positionY
            );


            circle.setAttribute(
                "rx",
                80
            );


            circle.setAttribute(
                "ry",
                45
            );



            group.appendChild(
                circle
            );



            const text =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );



            text.setAttribute(
                "x",
                positionX
            );


            text.setAttribute(
                "y",
                positionY + 5
            );


            text.setAttribute(
                "text-anchor",
                "middle"
            );



            text.textContent =
                "Tisch " + tableNumber;



            group.appendChild(
                text
            );



            container.appendChild(
                group
            );



            positionX += 220;



            if(
                positionX > 1000
            ){

                positionX = 250;

                positionY += 170;

            }



        });



}





/* ======================================
   SITZPLÄTZE ERZEUGEN
====================================== */


function createSeats(){


    Object.keys(tables)
    .forEach(
        table => {



        const svgTable =
            document.getElementById(
                `table-${table}`
            );



        if(!svgTable)
            return;



        const guestsAtTable =
            tables[table];



        guestsAtTable.forEach(
            (guest,index)=>{



            const seat =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "circle"
                );



            const angle =
                (
                    index /
                    guestsAtTable.length
                )
                *
                Math.PI *
                2;



            const cx =
                Math.cos(angle)
                *
                110;


            const cy =
                Math.sin(angle)
                *
                70;



            seat.setAttribute(
                "cx",
                cx
            );


            seat.setAttribute(
                "cy",
                cy
            );


            seat.setAttribute(
                "r",
                12
            );


            seat.classList.add(
                "seat"
            );



            seat.dataset.name =
                guest.name;



            seat.dataset.place =
                guest.platz;



            seat.addEventListener(
                "click",
                ()=>{
                    showGuest(
                        guest
                    );
                }
            );



            svgTable.appendChild(
                seat
            );



        });



    });


}





/* ======================================
   GAST ANZEIGEN
====================================== */


function showGuest(
    guest
){


    console.log(
        guest
    );



    window.dispatchEvent(

        new CustomEvent(
            "guestSelected",
            {
                detail:guest
            }
        )

    );


}
