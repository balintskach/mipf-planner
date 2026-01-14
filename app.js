let interestedEvents = localStorage.getItem("interestedEvents")
if (interestedEvents && interestedEvents.length) {
    interestedEvents = interestedEvents.split(',').filter(x => x)
    console.log(interestedEvents)
} else {
    interestedEvents = []
}

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

    table.innerHTML = ""
    let iconClassList = ["fa-solid", "fa-plus"]
    let action = addEventToInterested
    let _events = structuredClone(events)

    if (location && location != "ALL") {
        _events = events.filter(x => x.location == location)
    }

    if (table == interestedEventsTableBody) {
        let _interestedEvents = []
        for (let interestedEventId of interestedEvents) {
            match = _events.find(x => x.id == interestedEventId)
            _interestedEvents.push(match)
        }

        for (let e of _interestedEvents) {
            let conflict = _interestedEvents.filter(x => (x.id != e.id) && (x.location != e.location) && (Math.abs(x.date - e.date) <= 30 * 60 * 1000))
            if (conflict && conflict.length) {
                e.hasConflict = true
            } 
        }
        _events = _interestedEvents
        iconClassList = ["fa-solid", "fa-delete-left"]
        action = removeEventFromInterested
    }

    _events = _events.sort((a, b) => a.date - b.date)

    for (let event of _events) {
        if (event) {
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
}

function updateShareableUrl() {
    let url = `${document.location.href}share.html?events=${interestedEvents}`
    shareableUrlParagraph.setAttribute("href", url)
}

renderTable(eventsTableBody)
renderTable(interestedEventsTableBody)
updateShareableUrl()
