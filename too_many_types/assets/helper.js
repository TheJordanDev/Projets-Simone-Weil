const root = $("#root");
const header = $("header#header");

const TYPES = [
    "NORMAL",
    "FIGHTING",
    "FLYING",
    "POISON",
    "GROUND",
    "ROCK",
    "BUG",
    "GHOST",
    "STEEL",
    "MYSTERY",
    "FIRE",
    "WATER",
    "GRASS",
    "ELECTRIC",
    "PSYCHIC",
    "ICE",
    "DRAGON",
    "DARK",
    "FAIRY",
    "MONKE",
    "ANGY",
    "BABY",
    "FRIEND",
    "GUYS",
    "LIQUID",
    "VIBE",
    "SONG",
    "SPACE",
    "FLUFFY",
    "SUS",
    "FURRY",
    "BAD",
    "ANCIENT",
    "SILLY",
    "STINKY",
    "SHARP",
    "MAGIC",
    "GENDER",
    "LITTLE",
    "CRAB",
    "DREAM",
    "RIGHT",
    "LEFT",
    "ZOOMER",
    "GAMER",
    "DANCE",
    "BORING",
    "UGLY",
    "GUN",
    "PIKACHU",
    "PRIME",
    "OHIO",
    "DEEZ NUTS",
    "NORMAL2",
    "BEAN",
    "BOOMER",
    "SMASH",
    "OU",
    "BALL",
    "SANS",
    "REVERSE",
    "TYPE"
];

let TYPE_CHART = []

let POKEMONS = []

function getAllStrengths(type) {
    if (!TYPES.includes(type)) return [];
    let type_index = TYPES.indexOf(type)
    return [...TYPE_CHART[type_index]];
}

function getAllWeaknesses(type) {
    if (!TYPES.includes(type)) return [];
    let type_index = TYPES.indexOf(type)
    const column = [];
    for (let i = 0; i < TYPE_CHART.length; i++) {
      column.push(TYPE_CHART[i][type_index]);
    }
    return column;
}

function getPokemonStrengths(pokemon) {
    let all_strengths = []
    for (let type of pokemon["types"]) {
        all_strengths.push(getAllStrengths(type.toUpperCase()));
    }
    let final_strengths = all_strengths[0];
    if (pokemon["types"].length > 1) {
        for (let one_strength = 1; one_strength < all_strengths.length; one_strength++) {
            const strength = all_strengths[one_strength];
            for (let cell = 0; cell < strength.length; cell++) {
                const strength_cell = strength[cell];
                final_strengths[cell] = final_strengths[cell]*strength_cell;
            }
        }
    }
    return final_strengths;
}

function getPokemonsWeaknesses(pokemon) {
    let all_weaknesses = []
    for (let type of pokemon["types"]) {
        all_weaknesses.push(getAllWeaknesses(type.toUpperCase()));
    }
    let final_weaknesses = all_weaknesses[0];
    if (pokemon["types"].length > 1) {
        for (let one_weakness = 1; one_weakness < all_weaknesses.length; one_weakness++) {
            const weakness = all_weaknesses[one_weakness];
            for (let cell = 0; cell < weakness.length; cell++) {
                const weakness_cell = weakness[cell];
                final_weaknesses[cell] = final_weaknesses[cell]*weakness_cell;
            }
        }
    }
    return final_weaknesses;
}

function refreshWeaknessTable(pokemon) {
    let types = root.find("span#weakness_target_types");
    types.text(pokemon["types"].join(" / "))
    let table = root.find("div#weakness-table table tbody tr:first")
    table.empty();
    let weakness = getPokemonsWeaknesses(pokemon);
    for (let type_index = 0; type_index < TYPES.length; type_index++) {
        const type = TYPES[type_index];
        let type_value = $("<td>").text(`x${weakness[type_index]}`);
        table.append(type_value);
    }
}


function refreshMoveStrength(type, pokemon) {
    let container = root.find("div#move_type_container");
    let fullWeakness = 1;

    let moveStrengths = getAllStrengths(type);
    let reasons = [];
    for (const pokeType of pokemon["types"]) {
        reasons.push({"type":pokeType,"multiplier":moveStrengths[TYPES.indexOf(pokeType.toUpperCase())]})
        fullWeakness = fullWeakness * moveStrengths[TYPES.indexOf(pokeType.toUpperCase())];
    }
    container.find("h1#move_type_weakness_value").text(`x${fullWeakness}`);
    
    let sumup = container.find("div#move_type_sumup");
    sumup.empty();
    for (const weaknessReason of reasons) {
        sumup.append($(`<span>${type} against ${weaknessReason["type"]} is x${weaknessReason["multiplier"]}</span></br>`))
    }
}