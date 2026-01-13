let interestedEvents = localStorage.getItem("interestedEvents")?.split(',') || []

const eventsTableBody = document.querySelector("#events-tbody")
const interestedEventsTableBody = document.querySelector("#interested-tbody")
const shareableUrlParagraph = document.querySelector("#shareable-url")
const locationDropdown = document.querySelector("#location-dropdown")
locationDropdown.addEventListener("change", selectLocation)

function selectLocation() {
    let selectedValue = locationDropdown.options[locationDropdown.selectedIndex].value
    renderTable(eventsTableBody, selectedValue)
}

function addEventToInterested(evt) {
    let id = evt.target.attributes["event-id"].value
    if (!interestedEvents.includes(id)) {
        interestedEvents.push(id)
        localStorage.setItem("interestedEvents", interestedEvents)
    }
    renderTable(interestedEventsTableBody)
    updateShareableUrl()
}

function removeEventFromInterested(evt) {
    let id = evt.target.attributes["event-id"].value
    if (interestedEvents.includes(id)) {
        localStorage.setItem("interestedEvents", interestedEvents)
        interestedEvents.splice(interestedEvents.indexOf(id), 1)
    }
    renderTable(interestedEventsTableBody)
    updateShareableUrl()
}
function renderTable(table, location) {

    let iconClassList = ["fa-solid", "fa-plus"]
    let action = addEventToInterested
    let e = events
    if (location && location != "ALL") {
        e = events.filter(x => x.location == location)
        table.innerHTML = ""
    }

    if (table == interestedEventsTableBody) {
        e = []
        for (let interestedEventId of interestedEvents) {
            match = events.find(x => x.id == interestedEventId)
            e.push(match)
        }
        iconClassList = ["fa-solid", "fa-delete-left"]
        action = removeEventFromInterested
        table.innerHTML = ""
    }

    e = e.sort((a, b) => a.date - b.date)

    for (let event of e) {

        let tableRow = document.createElement("tr")
        for (let prop in event) {
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
