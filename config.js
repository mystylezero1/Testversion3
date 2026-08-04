/* ======================================
   Wedding App 2.0
   Konfiguration
   Hochzeitsgesellschaft Anja & Dino
====================================== */


const CONFIG = {


    /* ==================================
       HOCHZEIT
    ================================== */


    wedding: {

        title:
            "Hochzeitsgesellschaft",

        bride:
            "Anja",

        groom:
            "Dino",

        emoji:
            "💍"

    },




    /* ==================================
       DATEN
    ================================== */


    data: {


        file:

            "data.json",


        encoding:

            "utf-8"


    },




    /* ==================================
       GRUNDRISS
    ================================== */


    map: {


        svgId:

            "weddingMap",



        defaultZoom:

            1,



        minZoom:

            0.5,



        maxZoom:

            3



    },





    /* ==================================
       SUCHE
    ================================== */


    search: {


        placeholder:

            "Name, Tisch oder Sitzplatz suchen...",



        fields:[

            "name",

            "tisch",

            "platz"

        ],



        highlightTime:

            5000


    },





    /* ==================================
       ANIMATION
    ================================== */


    animation:{


        blinkSpeed:

            1000,



        bubbleDuration:

            5000,



        confetti:

            true


    },





    /* ==================================
       ADMIN
    ================================== */


    admin:{


        enabled:

            true,



        requirePassword:

            true,



        maxChanges:

            "unlimited"



    },





    /* ==================================
       EXCEL
    ================================== */


    excel:{


        enabled:

            true,



        importFile:

            "gaeste.xlsx",



        exportFile:

            "sitzplan_export.xlsx"


    },





    /* ==================================
       GITHUB
    ================================== */


    github:{


        enabled:

            true,


        pages:

            true


    }




};


/* ======================================
   EXPORT
====================================== */


window.APP_CONFIG = CONFIG;
