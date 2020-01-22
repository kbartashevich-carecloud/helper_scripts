const fs = require('fs');

let rawData = fs.readFileSync('search_data.json');
let dataJson = JSON.parse(rawData);
let dataEntry = dataJson.entry;

function createAddressList(contact, addr) {

    if (addr && addr.length) {
        return addr.map(a => {
            return a.text
        }).join(', ');
    } else if (contact) {
        const { address } = contact[0];
        const { line , city, state } = address;

        return line + ", " + city + ", " + state;
    } else {
        return "Not found"
    }
}

function findEnvEdisonIdnt(identifier, env) {
    const ident = identifier.filter(id => {
        return id.system.includes(env)
    })

    return ident.length > 0 ? ident[0].value : "not found";
}


dataEntry = dataEntry.map(({ resource }) => {

    const { id, name, contact, identifier, address } = resource;

    return {
        "id": resource.id,
        "name": resource.name,
        "address": createAddressList(contact, address),
        "edison_dev_identifier": findEnvEdisonIdnt(identifier, "development"),
        "edison_qa_identifier": findEnvEdisonIdnt(identifier, "qa"),
        "edison_prod_identifier": findEnvEdisonIdnt(identifier, "production")
    }
})

fs.writeFileSync('final_search_data.json', JSON.stringify(dataEntry));