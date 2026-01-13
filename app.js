let interestedEvents = localStorage.getItem("interestedEvents")?.split(',') || []

const eventsTableBody = document.querySelector("#events-tbody")
const interestedEventsTableBody = document.querySelector("#interested-tbody")
const shareableUrlParagraph = document.querySelector("#shareable-url")
const locationDropdown = document.querySelector("#location-dropdown")
locationDropdown.addEventListener("change", selectLocation)

const toastAlert = document.querySelector("#toast-alert")
const toastText = document.querySelector("#toast-text")

function showToastNotification(message) {
    const toast = new bootstrap.Toast(toastAlert)
    toastText.innerText = message
    toast.show()
}

function selectLocation() {
    let selectedValue = locationDropdown.options[locationDropdown.selectedIndex].value
    renderTable(eventsTableBody, selectedValue)
}

function addEventToInterested(evt) {
    let id = evt.target.attributes["event-id"].value
    if (!interestedEvents.includes(id)) {
        interestedEvents.push(id)
        showToastNotification(`${events.find(x => x.id == id).name} hozzáadva`)
        localStorage.setItem("interestedEvents", interestedEvents)
    }
    renderTable(interestedEventsTableBody)
    updateShareableUrl()
}

function removeEventFromInterested(evt) {
    let id = evt.target.attributes["event-id"].value
    if (interestedEvents.includes(id)) {
        interestedEvents.splice(interestedEvents.indexOf(id), 1)
        localStorage.setItem("interestedEvents", interestedEvents)
    }
    renderTable(interestedEventsTableBody)
    updateShareableUrl()
}
function renderTable(table, location) {

    let iconClassList = ["fa-solid", "fa-plus"]
    let action = addEventToInterested
    let _events = events
    if (location && location != "ALL") {
        _events = events.filter(x => x.location == location)
        table.innerHTML = ""
    }

    if (table == interestedEventsTableBody) {
        _events = []
        for (let interestedEventId of interestedEvents) {
            match = events.find(x => x.id == interestedEventId)
            _events.push(match)
        }

        for (let e of _events) {
            console.log(_events)
            let conflict = _events.filter(x => (x.id != e.id) && (x.location != e.location) && (Math.abs(x.date - e.date) <= 30 * 60 * 1000))
            if (conflict && conflict.length) {
                console.log(conflict)
                e.hasConflict = true
            } 
        }
        iconClassList = ["fa-solid", "fa-delete-left"]
        action = removeEventFromInterested
        table.innerHTML = ""
    }

    _events = _events.sort((a, b) => a.date - b.date)

    for (let event of _events) {

        let tableRow = document.createElement("tr")
        for (let prop in event) {
            if (prop == "hasConflict") {
                tableRow.classList.add("table-danger")
                continue
            }
            let tableField = document.createElement("td")
            if (prop == "id") {
                let actionTag = document.createElement("i")
                actionTag.setAttribute("event-id", event[prop])

                actionTag.classList.add(...iconClassList)
                actionTag.addEventListener("click", action)
                tableField.appendChild(actionTag)
            } else {
                tableField.innerText = prop == "date" ? event[prop].toLocaleTimeString(navigator.language, { hour: "2-digit", minute: "2-digit" }) : event[prop]
            }
            tableRow.appendChild(tableField)

        }

        table.append(tableRow)
    }
}

function updateShareableUrl() {
    let url = `${document.location.href}share.html?events=${interestedEvents}`
    shareableUrlParagraph.setAttribute("href", url)
}

renderTable(eventsTableBody)
renderTable(interestedEventsTableBody)
updateShareableUrl()
