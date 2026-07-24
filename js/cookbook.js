// Wait until the page has loaded
$(function () {

    const flipbook = $(".flipbook");

    // Save the last two pages (back inside + back cover)

const backInside = flipbook.find(".backInside").detach();

const backCover = flipbook.find(".backCover").detach();

    // ----------------------------------------------------
    // Create one image page and one text page per recipe
    // ----------------------------------------------------
    recipes.forEach((recipe, index) => {

        const leftPageNumber = 4 + index * 2;
        const rightPageNumber = leftPageNumber + 1;

        //-----------------------------------------
        // LEFT PAGE (IMAGE)
        //-----------------------------------------
        const leftPage = $(`
<div class="leftPage">

    <div class="pageContent">

        <div class="imageContainer">

            <img class="recipeImage"
                 src="${recipe.image}"
                 alt="${recipe.title}">

        </div>

            <div class="bookFooter">

            <div class="pageCounter">
            ${leftPageNumber}
            </div>

            </div>

    </div>

</div>
`);

        //-----------------------------------------
        // Ingredients
        //-----------------------------------------
        let ingredientsHTML = "<ul>";

        recipe.ingredients.forEach((item, ingredientIndex) => {

            const checked =
                localStorage.getItem(
                    `recipe-${index}-ingredient-${ingredientIndex}`
                ) === "true";

            ingredientsHTML += `
<li class="ingredient ${checked ? "checked" : ""}"
    data-recipe="${index}"
    data-ingredient="${ingredientIndex}">
    <span class="checkbox"></span>
    <span>${item}</span>
</li>`;
        });

        ingredientsHTML += "</ul>";

        //-----------------------------------------
        // Sauce ingredients
        //-----------------------------------------
        let sauceHTML = "";

        if (recipe.sauceIngredients.length > 0) {

            sauceHTML += "<ul>";

            recipe.sauceIngredients.forEach((item, sauceIndex) => {

                const ingredientID = recipe.ingredients.length + sauceIndex;

                const checked =
                    localStorage.getItem(
                        `recipe-${index}-ingredient-${ingredientID}`
                    ) === "true";

                sauceHTML += `
<li class="ingredient ${checked ? "checked" : ""}"
    data-recipe="${index}"
    data-ingredient="${ingredientID}">
    <span class="checkbox"></span>
    <span>${item}</span>
</li>`;
            });

            sauceHTML += "</ul>";
        }

        //-----------------------------------------
        // Preparation
        //-----------------------------------------
        let preparationHTML = "<ol>";

        recipe.preparation.forEach(step => {
            preparationHTML += `<li>${step}</li>`;
        });

        preparationHTML += "</ol>";

        //-----------------------------------------
        // RIGHT PAGE (TEXT)
        //-----------------------------------------
        const rightPage = $(`
<div class="rightPage">

    <div class="pageContent">

        <header class="recipeHeader">

            <h1 class="title">${recipe.title}</h1>

            <div class="recipeInfo">

                <span>⏱ ${recipe.time}</span>

                <span>🍽 ${recipe.servings}</span>

                ${recipe.website ? `
                    <a class="recipeLink"
                    href="${recipe.website}"
                    target="_blank">
                    Receta original
                    </a>
                ` : ""}

            </div>

        </header>

        <div class="recipeBody">

            <div class="ingredients">

                <h2>Ingredientes</h2>

                ${ingredientsHTML}

                ${recipe.sauceIngredients.length > 0 ? `<h3>${recipe.sauceTitle}</h3>` : ""}

                ${sauceHTML}

            </div>

            <div class="preparation">

                <h2>Preparación</h2>

                ${preparationHTML}

            </div>

        </div>

        <div class="bookFooter">

            <div class="readyMessage">
                🎉 ¡Listo para cocinar!
            </div>

            <div class="pageCounter">
                
            </div>

            <div class="categoryContainer">

                 <div class="pageCounter">
                     ${rightPageNumber}
                 </div>

                <div class="categoryColor"></div>

            </div>

        </div>

    </div>

</div>
`);

        // Add the pages
        flipbook.append(leftPage);
        flipbook.append(rightPage);

    });
    
   //----------------------------------------------------
// Final cookbook pages before back cover
//----------------------------------------------------

const favouriteRecipes = [
    9,
    0,
    14
];


let galleryHTML = "";

favouriteRecipes.forEach(index => {

    const recipe = recipes[index];

    const pageNumber = 4 + index * 2;

    galleryHTML += `

        <div class="favRecipe">

            <img 
                class="favRecipeImage"
                src="${recipe.image}"
                data-page="${pageNumber}"
                alt="${recipe.title}"
            >

            <span>${recipe.title}</span>

        </div>

    `;

});



const finalPage1 = $(`
<div class="leftPage">

    <div class="pageContent finalPage favouritesPage">


        <div class="finalDecoration">
            ❦
        </div>


        <h1 class="finalTitle">
            Mi top 3
        </h1>


        <p class="finalText">

            Una pequeña selección de los postres
            que más me han acompañado en mi cocina.

        </p>


        <div class="dessertGallery">

            ${galleryHTML}

        </div>


        <p class="finalHint">

            Pulsa sobre una receta para volver a ella

        </p>


    </div>

</div>
`);



const finalPage2 = $(`
<div class="rightPage">

    <div class="pageContent finalPage thankYouPage">


        <div class="finalDecoration">
            ❦
        </div>


        <h1 class="finalTitle">
            Gracias
        </h1>


        <div class="finalDivider">
            ♥ ♥ ♥
        </div>


        <p class="finalText">

            Gracias por abrir este recetario
            y formar parte de este pequeño
            viaje entre sabores y recuerdos.

        </p>


        <p class="finalText">

            Espero que estas recetas te inspiren
            a cocinar, experimentar y crear
            momentos especiales.

        </p>


        <div class="signature finalSignature">

            Con mucho cariño,

            <span>
                Luchi
            </span>

        </div>


    </div>

</div>
`);

    // Add the final pages back
   flipbook.append(backInside);

flipbook.append(finalPage1);
flipbook.append(finalPage2);

flipbook.append(backCover);

    //----------------------------------------------------
    // Resize Turn.js book
    //----------------------------------------------------
    function resizeBook() {

        const aspectRatio = 1600 / 800;
        const margin = 30;

        let width = Math.min(1600, window.innerWidth - margin);
        let height = width / aspectRatio;

        if (height > window.innerHeight - margin) {

            height = Math.min(800, window.innerHeight - margin);
            width = height * aspectRatio;

        }

        flipbook.turn("size", width, height);

    }

 //----------------------------------------------------
// Initialize Turn.js
//----------------------------------------------------

const instruction = $("#bookInstruction");

flipbook.turn({

    width: 1600,
    height: 800,
    autoCenter: true,

    when: {

        turned: function(event, page) {

            // Book closed (front cover visible)
            if (page === 1) {

                instruction.fadeIn();

            } else {

                instruction.fadeOut();

            }

        }

    }

});



//----------------------------------------------------
// Custom cursor on page corners
//----------------------------------------------------

const normalCursor = 'url("images/cursor.png") 8 8, auto';
const pointerCursor = 'url("images/pointer.png") 8 8, pointer';

flipbook.css("cursor", normalCursor);

flipbook.on("mousemove", function (e) {

    const rect = this.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cornerSize = 100;

    const inCorner =
        (x <= cornerSize && y <= cornerSize) ||
        (x >= rect.width - cornerSize && y <= cornerSize) ||
        (x <= cornerSize && y >= rect.height - cornerSize) ||
        (x >= rect.width - cornerSize && y >= rect.height - cornerSize);

    this.style.cursor = inCorner ? pointerCursor : normalCursor;

});

flipbook.on("mouseleave", function () {

    this.style.cursor = normalCursor;

});


    resizeBook();

    window.addEventListener("resize", resizeBook);

    //----------------------------------------------------
    // Restore "Ready to cook!" messages
    //----------------------------------------------------
    $(".pageContent").each(function () {

        const ingredients = $(this).find(".ingredient");

        if (ingredients.length === 0) return;

        const checked = ingredients.filter(".checked").length;

        if (checked === ingredients.length) {

            $(this)
                .find(".readyMessage")
                .addClass("show");

        }

    });


    

    //----------------------------------------------------
    // Ingredient checklist
    //----------------------------------------------------
    $(document).on("click", ".ingredient", function () {

        // Toggle checkbox
        $(this).toggleClass("checked");

        const recipe = $(this).data("recipe");
        const ingredient = $(this).data("ingredient");

        // Save state
        localStorage.setItem(
            `recipe-${recipe}-ingredient-${ingredient}`,
            $(this).hasClass("checked")
        );

        // Count checked ingredients for this recipe
        const ingredients = $(this)
            .closest(".ingredients")
            .find(".ingredient");

        const checked = ingredients.filter(".checked").length;

        // Ready message
        const message = $(this)
            .closest(".pageContent")
            .find(".readyMessage");

        if (checked === ingredients.length && ingredients.length > 0) {

            // Restart animation
            message.removeClass("show");

            void message[0].offsetWidth;

            message.addClass("show");

            // Hide automatically after 3 seconds
            clearTimeout(message.data("timeout"));

            const timeout = setTimeout(function () {

                message.removeClass("show");

            }, 3000);

            message.data("timeout", timeout);

        } else {

            message.removeClass("show");

        }

    });

// ===============================
// MOBILE FULLSCREEN BUTTON
// ===============================

const fullscreenButton = document.getElementById("fullscreenButton");
const fullscreenMessage = document.getElementById("fullscreenMessage");

const exitFullscreenButton = document.getElementById("exitFullscreenButton");



// --------------------------------
// Safari fake fullscreen
// --------------------------------

function activateFakeFullscreen(){


    document.body.classList.add("mobileFullscreen");


    flipbook.css("display","block");


    if(fullscreenMessage){

        fullscreenMessage.style.display="none";

    }


    if(exitFullscreenButton){

        exitFullscreenButton.style.display="block";

    }


    setTimeout(()=>{

        resizeBook();

    },300);


}




// --------------------------------
// Open cookbook button
// --------------------------------

if (fullscreenButton) {


    fullscreenButton.addEventListener("click", () => {


        document.body.style.overflow = "hidden";


        // Detect iPhone/iPad Safari
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);



        // -------------------------
        // Safari
        // -------------------------

        if(isIOS){


            activateFakeFullscreen();


        }



        // -------------------------
        // Chrome / Android
        // -------------------------

        else {


            if(document.documentElement.requestFullscreen){


                document.documentElement.requestFullscreen()
                .then(()=>{


                    flipbook.css("display","block");


                    if(fullscreenMessage){

                        fullscreenMessage.style.display="none";

                    }


                    if(exitFullscreenButton){

                        exitFullscreenButton.style.display="block";

                    }



                    // Try landscape lock

                    if(screen.orientation && screen.orientation.lock){


                        screen.orientation.lock("landscape")
                        .catch(()=>{});


                    }



                    setTimeout(()=>{

                        resizeBook();

                    },500);



                })
                .catch(()=>{


                    // fallback

                    activateFakeFullscreen();


                });


            }

            else {


                activateFakeFullscreen();


            }


        }



    });


}





// --------------------------------
// Exit button
// --------------------------------

if(exitFullscreenButton){


    exitFullscreenButton.addEventListener("click",()=>{


        // Chrome fullscreen

        if(document.fullscreenElement){


            document.exitFullscreen();


        }


        // Safari fake fullscreen

        else {


            document.body.classList.remove("mobileFullscreen");


            flipbook.css("display","none");


            if(fullscreenMessage){

                fullscreenMessage.style.display="flex";

            }


            exitFullscreenButton.style.display="none";


            resizeBook();


        }



    });


}





// --------------------------------
// Detect Chrome fullscreen changes
// --------------------------------

document.addEventListener("fullscreenchange",()=>{


    if(document.fullscreenElement){


        flipbook.css("display","block");


        if(exitFullscreenButton){

            exitFullscreenButton.style.display="block";

        }


    }



    else {



        // Do not reset Safari fake fullscreen

        if(!document.body.classList.contains("mobileFullscreen")){


            flipbook.css("display","none");


            if(fullscreenMessage){

                fullscreenMessage.style.display="flex";

            }


            if(exitFullscreenButton){

                exitFullscreenButton.style.display="none";

            }


        }


    }



    setTimeout(()=>{

        resizeBook();

    },300);



});

    //----------------------------------------------------
// Favourite recipe navigation
//----------------------------------------------------

$(document).on("click", ".favRecipeImage", function () {

    const page = $(this).data("page");

    flipbook.turn("page", page);

});

});