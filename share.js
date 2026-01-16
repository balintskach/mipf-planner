const queryParams = new URLSearchParams(window.location.search)
function getValueFromQueryParam(param) {
    if (queryParams.has(param)) {
        return queryParams.get(param)
    } else return
}

function createEventCard(event) {
    const eventCardTemplate = `
        <div class="card m-3 bg-dark-sublte" style="max-width: 400px;">
            <div class="row g-0 p-2">
                <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">{TITLE_PLACEHOLDER}</h5>
                    <p class="card-text">{LOCATION_PLACEHOLDER}</p>
                    <p class="card-text"><small class="text-body-secondary">{DATE_PLACEHOLDER}</small></p>
                </div>
                </div>
            </div>
        </div>`

    cardbox.innerHTML += eventCardTemplate.replace('{TITLE_PLACEHOLDER}', event.name)
        .replace('{LOCATION_PLACEHOLDER}', event.location)
        .replace('{DATE_PLACEHOLDER}', event.date.toLocaleTimeString(navigator.language, { hour: "2-digit", minute: "2-digit" }))
}

const interestedEventIds = getValueFromQueryParam("events")?.split(",")
const nameValue = getValueFromQueryParam("name")
const cardbox = document.querySelector("#cardbox")
const nameField = document.querySelector("#name")

if (interestedEventIds) {
    let interestedEvents = []
    for (const id of interestedEventIds) {
        const event = events.find(x => x.id == id);
        interestedEvents.push(event)
    }

    interestedEvents = interestedEvents.sort((a, b) => a.date - b.date)
    for (const event of interestedEvents) {
        createEventCard(event)
    }

    if (nameValue) {
        nameField.innerText = nameValue
    }
}