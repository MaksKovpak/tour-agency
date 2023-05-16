export const TOURS_API_KEY = '6452234bb89b1e229995f859';
export const API_KEY = '$2b$10$csdnNhNW0vZdkARx96SvSezMEHI6EbnLcD0aJsOZYN4LVsmb46Goa';


export async function findTour(id) {
    let tour = await getTour(id);
    return tour != undefined;
}

export async function getTour(id) {
    let response = await fetch(`https://api.jsonbin.io/v3/b/${TOURS_API_KEY}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
    });

    let toursArray = (await response.json()).record;

    return toursArray.find(tour => tour.id == id);
}

// Returns the updated array of tours without deleted one
export async function removeTour(id) {
    let exist = await findTour(id);
    if (!exist) return;

    let response = await fetch(`https://api.jsonbin.io/v3/b/${TOURS_API_KEY}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
    });

    let data = await response.json();
    let toursArray = data.record;

    toursArray = toursArray.filter(tour => tour.id != id);

    await fetch(`https://api.jsonbin.io/v3/b/${TOURS_API_KEY}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
        },
        body: JSON.stringify(toursArray)
    });

    return toursArray;
}

export async function editTour(id, newTour) {
    let exist = await findTour(id);
    if (!exist) return;

    let response = await fetch(`https://api.jsonbin.io/v3/b/${TOURS_API_KEY}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
    });

    let data = await response.json();
    let toursArray = data.record;

    let idx = toursArray.findIndex(tour => tour.id == id);
    toursArray[idx] = { ...toursArray[idx], ...newTour };

    await fetch(`https://api.jsonbin.io/v3/b/${TOURS_API_KEY}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
        },
        body: JSON.stringify(toursArray)
    });

    return toursArray;
}

// newTour - object that represents tour but without id field
export async function addNewTour(newTour) {
    let response = await fetch(`https://api.jsonbin.io/v3/b/${TOURS_API_KEY}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
    });

    let data = await response.json();
    let last = data.record.at(-1);

    newTour.id = last.id + 1;

    let toursArray = data.record;
    toursArray.push(newTour);

    await fetch(`https://api.jsonbin.io/v3/b/${TOURS_API_KEY}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
        },
        body: JSON.stringify(toursArray)
    });

    return toursArray;
}

