let draggedCard = null;


// Get saved data
let internships = JSON.parse(localStorage.getItem("internships")) || [];


// Select Add buttons
const addButtons = document.querySelectorAll(".add-btn");



// Add internship

addButtons.forEach((button) => {


    button.addEventListener("click", () => {


        let company = prompt("Enter company name");
        let role = prompt("Enter role");


        // remove extra spaces
        company = company?.trim();
        role = role?.trim();



        // Empty check

        if (!company || !role) {

            alert("Please enter company and role!");

            return;

        }



        // Duplicate check

        let duplicate = internships.some((item) => {

            return (
                item.company.toLowerCase() === company.toLowerCase()
                &&
                item.role.toLowerCase() === role.toLowerCase()
            );

        });



        if (duplicate) {

            alert("This internship already exists!");

            return;

        }



        let column = button.parentElement;


        let internship = {


            company: company,

            role: role,

            status: column.querySelector("h3").innerText,

            date: new Date().toLocaleDateString()


        };



        // Save data

        internships.push(internship);


        localStorage.setItem(

            "internships",

            JSON.stringify(internships)

        );



        createCard(internship, column);



    });


});







// Create Card Function

function createCard(item, column) {



    let card = document.createElement("div");


    card.className = "card";


    card.draggable = true;



    card.innerHTML = `

        <h3>${item.company}</h3>

        <p>${item.role}</p>

        <small>Applied: ${item.date}</small>

        <button class="delete-btn">Delete</button>

    `;




    // Delete card

    let deleteBtn = card.querySelector(".delete-btn");


    deleteBtn.addEventListener("click", () => {



        internships = internships.filter((internship) => {


            return !(
                internship.company === item.company &&
                internship.role === item.role &&
                internship.date === item.date
            );


        });



        localStorage.setItem(

            "internships",

            JSON.stringify(internships)

        );



        card.remove();


    });







    // Drag start

    card.addEventListener("dragstart", () => {


        draggedCard = card;


    });





    column.insertBefore(

        card,

        column.querySelector(".add-btn")

    );


}








// Load saved cards

function loadCards() {



    internships.forEach((item) => {



        const columns = document.querySelectorAll(".column");



        columns.forEach((column) => {



            let title = column.querySelector("h3").innerText;



            if (title === item.status) {


                createCard(item, column);


            }


        });



    });


}



loadCards();








// Drag and Drop

const columns = document.querySelectorAll(".column");



columns.forEach((column) => {



    column.addEventListener("dragover", (e) => {


        e.preventDefault();


    });






    column.addEventListener("drop", () => {



        if (draggedCard) {



            column.insertBefore(

                draggedCard,

                column.querySelector(".add-btn")

            );





            // Update status after moving

            let company = draggedCard.querySelector("h3").innerText;



            let newStatus = column.querySelector("h3").innerText;



            internships = internships.map((item) => {



                if (item.company === company) {


                    item.status = newStatus;


                }



                return item;


            });





            localStorage.setItem(

                "internships",

                JSON.stringify(internships)

            );



        }



    });



});

