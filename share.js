function getEventsFromQueryParam() {
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.has("events")) {
        return queryParams.get("events").split(',');
    } else return
}

function createEventCard(event) {
    const eventCardTemplate = `
        <div class="row g-0">
            <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">{TITLE_PLACEHOLDER}</h5>
                <p class="card-text">{LOCATION_PLACEHOLDER}</p>
                <p class="card-text"><small class="text-body-secondary">{DATE_PLACEHOLDER}</small></p>
            </div>
            </div>
        </div>`
    
    cardbox.innerHTML += eventCardTemplate.replace('{TITLE_PLACEHOLDER}', event.name)
                     .replace('{LOCATION_PLACEHOLDER}', event.location)
                     .replace('{DATE_PLACEHOLDER}', event.date.toLocaleTimeString(navigator.language, { hour: "2-digit", minute: "2-digit" }))
}

const interestedEventIds = getEventsFromQueryParam()
const cardbox = document.querySelector("#cardbox")
let interestedEvents = []

for (const id of interestedEventIds) {
    const event = events.find(x => x.id == id);
    interestedEvents.push(event)
}

interestedEvents = interestedEvents.sort((a, b) => a.date - b.date)
for (const event of interestedEvents) {
    createEventCard(event)
}

console.log(interestedEvents)