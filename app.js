let draggedCard = null;
let editingItem = null;
let activeColumn = null;
let internships = JSON.parse(localStorage.getItem("internships")) || [];

const modal = document.getElementById("modal");
const form = document.getElementById("internshipForm");

function openModal(title, item = {}) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("f-company").value = item.company || "";
    document.getElementById("f-role").value = item.role || "";
    document.getElementById("f-location").value = item.location || "";
    document.getElementById("f-link").value = item.link || "";
    document.getElementById("f-notes").value = item.notes || "";
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
    editingItem = null;
    activeColumn = null;
    form.reset();
}

document.getElementById("cancelBtn").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        activeColumn = btn.parentElement;
        editingItem = null;
        openModal("Add Internship");
    });
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const company  = document.getElementById("f-company").value.trim();
    const role     = document.getElementById("f-role").value.trim();
    const location = document.getElementById("f-location").value.trim();
    const link     = document.getElementById("f-link").value.trim();
    const notes    = document.getElementById("f-notes").value.trim();

    if (!company || !role) return alert("Company and Role are required!");

    if (editingItem) {
        editingItem.item.company = company;
        editingItem.item.role = role;
        editingItem.item.location = location;
        editingItem.item.link = link;
        editingItem.item.notes = notes;
        save();
        const ps = editingItem.card.querySelectorAll("p");
        editingItem.card.querySelector("h3").innerText = company;
        ps[0].innerText = role;
        ps[1].innerText = "📍 " + (location || "No location");
        ps[2].innerHTML = `🔗 <a href="${link}" target="_blank">Job Link</a>`;
        ps[3].innerText = "📝 " + (notes || "No notes");
    } else {
        const duplicate = internships.some(
            (i) => i.company.toLowerCase() === company.toLowerCase()
                && i.role.toLowerCase() === role.toLowerCase()
        );
        if (duplicate) return alert("Internship already exists!");
        const internship = {
            company, role, location, link, notes,
            status: activeColumn.querySelector("h3").innerText,
            date: new Date().toLocaleDateString(),
        };
        internships.push(internship);
        save();
        createCard(internship, activeColumn);
    }
    updateCounter();
    closeModal();
});

function save() {
    localStorage.setItem("internships", JSON.stringify(internships));
}

function createCard(item, column) {
    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.innerHTML = `
        <h3>${item.company}</h3>
        <p>${item.role}</p>
        <p>📍 ${item.location || "No location"}</p>
        <p>🔗 <a href="${item.link}" target="_blank">Job Link</a></p>
        <p>📝 ${item.notes || "No notes"}</p>
        <small>📅 Applied: ${item.date}</small>
        <div class="card-btns">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>`;

    card.querySelector(".delete-btn").addEventListener("click", () => {
        internships = internships.filter(
            (i) => !(i.company === item.company && i.role === item.role && i.date === item.date)
        );
        save();
        card.remove();
        updateCounter();
    });

    card.querySelector(".edit-btn").addEventListener("click", () => {
        editingItem = { item, card };
        openModal("Edit Internship", item);
    });

    card.addEventListener("dragstart", () => { draggedCard = card; });
    column.insertBefore(card, column.querySelector(".add-btn"));
}

function loadCards() {
    internships.forEach((item) => {
        document.querySelectorAll(".column").forEach((col) => {
            if (col.querySelector("h3").innerText === item.status) createCard(item, col);
        });
    });
}
loadCards();

document.querySelectorAll(".column").forEach((col) => {
    col.addEventListener("dragover", (e) => e.preventDefault());
    col.addEventListener("drop", () => {
        if (!draggedCard) return;
        col.insertBefore(draggedCard, col.querySelector(".add-btn"));
        const company = draggedCard.querySelector("h3").innerText;
        const newStatus = col.querySelector("h3").innerText;
        internships = internships.map((i) => i.company === company ? { ...i, status: newStatus } : i);
        save();
        updateCounter();
    });
});

document.getElementById("searchInput")?.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase();
    document.querySelectorAll(".card").forEach((card) => {
        card.style.display = card.innerText.toLowerCase().includes(val) ? "block" : "none";
    });
});

function updateCounter() {
    const count = { Applied: 0, Shortlisted: 0, Interview: 0, Offer: 0, Selected: 0, Rejected: 0 };
    internships.forEach((i) => { if (count[i.status] !== undefined) count[i.status]++; });
    document.getElementById("totalCount").innerText = internships.length;
    document.getElementById("appliedCount").innerText = count.Applied;
    document.getElementById("interviewCount").innerText = count.Interview;
    document.getElementById("offerCount").innerText = count.Offer;
    document.getElementById("selectedCount").innerText = count.Selected;
    document.getElementById("rejectedCount").innerText = count.Rejected;
}
updateCounter();
