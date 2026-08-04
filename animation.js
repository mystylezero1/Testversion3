/* ======================================
   Wedding App 2.0
   Animationen
   Hochzeitsgesellschaft Anja & Dino
====================================== */



let currentZoom = 1;



/* ======================================
   TISCH BLINKEN
====================================== */


function blinkTable(
    tableId
){


    const table =
        document.getElementById(
            tableId
        );



    if(!table)
        return;



    table.classList.add(
        "highlight"
    );



    setTimeout(
        ()=>{


            table.classList.remove(
                "highlight"
            );


        },

        CONFIG.search.highlightTime

    );


}





/* ======================================
   ZOOM
====================================== */


function zoomMap(
    value
){


    currentZoom += value;



    if(
        currentZoom <
        CONFIG.map.minZoom
    ){

        currentZoom =
            CONFIG.map.minZoom;

    }



    if(
        currentZoom >
        CONFIG.map.maxZoom
    ){

        currentZoom =
            CONFIG.map.maxZoom;

    }



    const map =
        document.getElementById(
            "weddingMap"
        );



    if(map){


        map.style.transform =
            `
            scale(${currentZoom})
            `;


    }


}





/* ======================================
   ZOOM ZUM TISCH
====================================== */


function zoomToTable(
    tableNumber
){


    const table =
        document.getElementById(
            `table-${tableNumber}`
        );



    if(!table)
        return;



    table.classList.add(
        "highlight"
    );



    table.scrollIntoView({

        behavior:
            "smooth",

        block:
            "center",

        inline:
            "center"

    });



}





/* ======================================
   SITZPLATZ MARKIEREN
====================================== */


function highlightSeat(
    name
){



    document
    .querySelectorAll(
        ".seat"
    )
    .forEach(
        seat=>{


            seat.classList.remove(
                "animate-pop"
            );



            if(
                seat.dataset.name
                ===
                name
            ){


                seat.classList.add(
                    "animate-pop"
                );


            }


        }
    );


}





/* ======================================
   KONFETTI
====================================== */


function launchConfetti(){


    if(
        !CONFIG.animation.confetti
    )
        return;



    for(
        let i = 0;
        i < 80;
        i++
    ){



        const piece =
            document.createElement(
                "div"
            );



        piece.className =
            "confetti";



        piece.style.left =
            Math.random()
            *
            window.innerWidth
            +
            "px";



        piece.style.top =
            "-20px";



        document.body.appendChild(
            piece
        );



        animateConfetti(
            piece
        );


    }


}





function animateConfetti(
    element
){


    const fall =
        Math.random()
        *
        600
        +
        300;



    const rotation =
        Math.random()
        *
        720;



    element.animate(

        [

            {
                transform:
                "translateY(0) rotate(0)"
            },


            {

                transform:
                `
                translateY(${fall}px)
                rotate(${rotation}deg)
                `

            }

        ],

        {


            duration:
                2000 +
                Math.random()
                *
                2000,


            easing:
                "ease-out"


        }

    );



    setTimeout(
        ()=>{


            element.remove();


        },

        5000

    );


}





/* ======================================
   HOCHZEITSSTART
====================================== */


function weddingStart(){


    launchConfetti();



    console.log(
        "🎊 Die Hochzeit beginnt!"
    );


}





/* ======================================
   EXPORT
====================================== */


window.WeddingAnimation = {


    blinkTable,

    zoomMap,

    zoomToTable,

    highlightSeat,

    launchConfetti

};
