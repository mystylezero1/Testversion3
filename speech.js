/* ======================================
   Wedding App 2.0
   Sprechblase / Gastinfo
   Hochzeitsgesellschaft Anja & Dino
====================================== */



const bubble =
    document.getElementById(
        "infoBubble"
    );


const bubbleText =
    document.getElementById(
        "bubbleText"
    );



let bubbleTimer;





/* ======================================
   GAST ANZEIGEN
====================================== */


function showGuestBubble(
    guest
){


    if(
        !bubble ||
        !bubbleText
    )
        return;



    bubbleText.innerHTML = `

        ❤️ Willkommen ${guest.name}

        <br><br>

        💺 Dein Platz:

        <br>

        Tisch:
        <strong>
        ${guest.tisch}
        </strong>

        <br>

        Sitzplatz:
        <strong>
        ${guest.platz}
        </strong>

    `;



    bubble.classList.remove(
        "hidden"
    );



    highlightSeat(
        guest.name
    );



    moveBubble(
        guest
    );



    clearTimeout(
        bubbleTimer
    );



    bubbleTimer =
        setTimeout(
            ()=>{


                hideBubble();


            },

            CONFIG.animation.bubbleDuration

        );


}





/* ======================================
   POSITION
====================================== */


function moveBubble(
    guest
){


    const table =
        document.getElementById(
            `table-${guest.tisch}`
        );



    if(
        !table
    )
        return;



    const box =
        table.getBoundingClientRect();



    bubble.style.position =
        "fixed";



    bubble.style.left =
        (
            box.left +
            box.width / 2
        )
        +
        "px";



    bubble.style.top =
        (
            box.top -
            120
        )
        +
        "px";



}





/* ======================================
   AUSBLENDEN
====================================== */


function hideBubble(){


    if(!bubble)
        return;



    bubble.classList.add(
        "hidden"
    );


}





/* ======================================
   MANUELLE INFO
====================================== */


function showMessage(
    message
){


    if(
        !bubbleText
    )
        return;



    bubbleText.innerHTML =
        message;



    bubble.classList.remove(
        "hidden"
    );


}





/* ======================================
   EVENTS
====================================== */


window.addEventListener(

    "guestSelected",

    event=>{


        showGuestBubble(
            event.detail
        );


    }

);





/* ======================================
   EXPORT
====================================== */


window.WeddingSpeech = {


    showGuestBubble,

    hideBubble,

    showMessage


};
