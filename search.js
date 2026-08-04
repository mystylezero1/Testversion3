/* ======================================
   Wedding App 2.0
   Suche
   Hochzeitsgesellschaft Anja & Dino
====================================== */


const searchInput =
    document.getElementById(
        "searchInput"
    );


const clearButton =
    document.getElementById(
        "clearSearch"
    );


const resultBox =
    document.getElementById(
        "searchResult"
    );





/* ======================================
   EVENTS
====================================== */


if(searchInput){


    searchInput.addEventListener(
        "input",
        handleSearch
    );


}



if(clearButton){


    clearButton.addEventListener(
        "click",
        ()=>{


            searchInput.value="";


            clearHighlights();


            showDefaultMessage();


        }
    );


}





/* ======================================
   SUCHE
====================================== */


function handleSearch(){


    const value =
        searchInput.value
        .trim()
        .toLowerCase();



    if(!value){


        clearHighlights();


        showDefaultMessage();


        return;


    }



    const matches =
        guests.filter(
            guest=>{


                return (

                    String(
                        guest.name
                    )
                    .toLowerCase()
                    .includes(value)


                    ||

                    String(
                        guest.tisch
                    )
                    .toLowerCase()
                    .includes(value)



                    ||

                    String(
                        guest.platz
                    )
                    .toLowerCase()
                    .includes(value)


                );


            }
        );



    displayResults(
        matches
    );



    highlightMatches(
        matches
    );



}





/* ======================================
   ERGEBNISSE
====================================== */


function displayResults(
    results
){



    if(!resultBox)
        return;



    if(
        results.length === 0
    ){


        resultBox.innerHTML = `

        <div class="result-box">

            <strong>
                ❌ Nicht gefunden
            </strong>

            <span>
                Keine passende Person gefunden.
            </span>

        </div>

        `;


        return;


    }





    let html = `

    <div class="result-box">

    <strong>
        ${results.length}
        Treffer gefunden
    </strong>

    `;



    results.forEach(
        guest=>{


            html += `

            <span
            onclick="
            selectGuest(
                '${guest.name}'
            )"
            >

            👤 ${guest.name}
            |
            Tisch ${guest.tisch}
            |
            Platz ${guest.platz}

            </span>


            `;


        }
    );



    html += `

    </div>

    `;



    resultBox.innerHTML =
        html;



}





/* ======================================
   HIGHLIGHT
====================================== */


function highlightMatches(
    results
){


    clearHighlights();



    results.forEach(
        guest=>{



            const table =
                document.getElementById(
                    `table-${guest.tisch}`
                );



            if(table){


                table.classList.add(
                    "highlight"
                );


            }



        }
    );


}





/* ======================================
   PERSON AUSWÄHLEN
====================================== */


function selectGuest(
    name
){


    const guest =
        guests.find(
            g =>
            g.name === name
        );



    if(!guest)
        return;



    const table =
        document.getElementById(
            `table-${guest.tisch}`
        );



    if(table){


        table.scrollIntoView({

            behavior:
                "smooth",

            block:
                "center"

        });


    }



    showGuestBubble(
        guest
    );



}





/* ======================================
   MARKIERUNGEN ENTFERNEN
====================================== */


function clearHighlights(){


    document
    .querySelectorAll(
        ".highlight"
    )
    .forEach(
        element=>{


            element.classList.remove(
                "highlight"
            );


        }
    );


}





/* ======================================
   STANDARD TEXT
====================================== */


function showDefaultMessage(){


    if(!resultBox)
        return;



    resultBox.innerHTML = `

    <div class="result-box">

        <strong>
            Suche starten
        </strong>

        <span>
            Gib einen Namen,
            Tisch oder Sitzplatz ein.
        </span>

    </div>

    `;


}





/* ======================================
   GAST EVENT
====================================== */


window.addEventListener(

    "guestSelected",

    event=>{


        showGuestBubble(
            event.detail
        );


    }

);
