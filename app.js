let draggedCard = null;


// Load saved data
let internships = JSON.parse(localStorage.getItem("internships")) || [];


// Add buttons
const addButtons = document.querySelectorAll(".add-btn");




// ADD INTERNSHIP

addButtons.forEach((button)=>{


    button.addEventListener("click",()=>{


        let company = prompt("Enter company name");
        let role = prompt("Enter role");
        let location = prompt("Enter location");
        let link = prompt("Enter job link");
        let notes = prompt("Enter notes");



        company = company?.trim();
        role = role?.trim();



        if(!company || !role){

            alert("Company and Role are required!");

            return;

        }




        // duplicate check

        let duplicate = internships.some((item)=>{


            return (

            item.company.toLowerCase() === company.toLowerCase()
            &&
            item.role.toLowerCase() === role.toLowerCase()

            );


        });



        if(duplicate){

            alert("Internship already exists!");

            return;

        }






        let column = button.parentElement;




        let internship = {


            company: company,

            role: role,

            location: location,

            link: link,

            notes: notes,


            status:
            column.querySelector("h3").innerText,


            date:
            new Date().toLocaleDateString()


        };






        internships.push(internship);



        localStorage.setItem(

            "internships",

            JSON.stringify(internships)

        );



        createCard(internship,column);


        updateCounter();


    });



});











// CREATE CARD


function createCard(item,column){



    let card = document.createElement("div");


    card.className="card";


    card.draggable=true;





    card.innerHTML = `



    <h3>${item.company}</h3>


    <p>${item.role}</p>



    <p>📍 ${item.location || "No location"}</p>




    <p>

    🔗 

    <a href="${item.link}" target="_blank">

    Job Link

    </a>


    </p>





    <p>

    📝 ${item.notes || "No notes"}

    </p>




    <small>

    📅 Applied: ${item.date}

    </small>





    <div>


    <button class="edit-btn">

    Edit

    </button>



    <button class="delete-btn">

    Delete

    </button>



    </div>



    `;









    // DELETE



    card.querySelector(".delete-btn")
    .addEventListener("click",()=>{


        internships =
        internships.filter((i)=>{


            return !(

            i.company===item.company
            &&
            i.role===item.role
            &&
            i.date===item.date


            );


        });




        localStorage.setItem(

        "internships",

        JSON.stringify(internships)

        );




        card.remove();


        updateCounter();


    });









    // EDIT



    card.querySelector(".edit-btn")
    .addEventListener("click",()=>{



        let newCompany =
        prompt(
        "Edit company",
        item.company
        );



        let newRole =
        prompt(
        "Edit role",
        item.role
        );



        let newLocation =
        prompt(
        "Edit location",
        item.location
        );



        let newLink =
        prompt(
        "Edit job link",
        item.link
        );



        let newNotes =
        prompt(
        "Edit notes",
        item.notes
        );






        if(newCompany && newRole){



            item.company =
            newCompany.trim();



            item.role =
            newRole.trim();



            item.location =
            newLocation;



            item.link =
            newLink;



            item.notes =
            newNotes;





            localStorage.setItem(

            "internships",

            JSON.stringify(internships)

            );





            card.querySelector("h3")
            .innerText=item.company;



            card.querySelector("p")
            .innerText=item.role;



        }



    });










    // DRAG START


    card.addEventListener("dragstart",()=>{


        draggedCard=card;


    });







    column.insertBefore(

    card,

    column.querySelector(".add-btn")

    );



}











// LOAD OLD CARDS


function loadCards(){



    internships.forEach((item)=>{



        document.querySelectorAll(".column")
        .forEach((column)=>{



            let title =
            column.querySelector("h3").innerText;



            if(title===item.status){


                createCard(item,column);


            }



        });



    });



}



loadCards();












// DRAG DROP


const columns =
document.querySelectorAll(".column");




columns.forEach((column)=>{



column.addEventListener(
"dragover",
(e)=>{


e.preventDefault();


});






column.addEventListener(
"drop",
()=>{


if(draggedCard){



column.insertBefore(

draggedCard,

column.querySelector(".add-btn")

);





let company =
draggedCard.querySelector("h3").innerText;



let newStatus =
column.querySelector("h3").innerText;




internships =
internships.map((item)=>{


if(item.company===company){


item.status=newStatus;


}



return item;


});





localStorage.setItem(

"internships",

JSON.stringify(internships)

);



updateCounter();



}



});



});












// SEARCH


const searchInput =
document.getElementById("searchInput");



if(searchInput){



searchInput.addEventListener(
"input",
()=>{



let value =
searchInput.value.toLowerCase();



document.querySelectorAll(".card")
.forEach((card)=>{



let text =
card.innerText.toLowerCase();



if(text.includes(value)){


card.style.display="block";


}

else{


card.style.display="none";


}



});



});



}











// COUNTER


function updateCounter(){



let count = {


Applied:0,

Shortlisted:0,

Interview:0,

Offer:0,

Selected:0,

Rejected:0


};





internships.forEach((item)=>{


if(count[item.status]!==undefined){

count[item.status]++;

}


});





if(document.getElementById("totalCount")){


document.getElementById("totalCount")
.innerText=internships.length;



document.getElementById("appliedCount")
.innerText=count.Applied;



document.getElementById("interviewCount")
.innerText=count.Interview;



document.getElementById("offerCount")
.innerText=count.Offer;



document.getElementById("selectedCount")
.innerText=count.Selected;



document.getElementById("rejectedCount")
.innerText=count.Rejected;



}



}



updateCounter();
