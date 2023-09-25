let currentGame;

function init() {
    (async ()=>{
        let idk = await $.get("./assets/data/type_chart.numpy")
        const rows = idk.split("\n")
        TYPE_CHART = rows.map(row => row.split(" "))
        await loadPokemons();
        await setup();
    })();
}

async function loadPokemons() {
    POKEMONS = await $.get("./assets/data/pokedex.json");
}

async function setup() {
    let pokemon_select = $(`<select id="pokemon_select"></select>`);
    for (const pokemon_name in POKEMONS) {
        pokemon_select.append($(`<option value="${pokemon_name}">${pokemon_name}</option>`));
    }
    let table = $(`
        <div id="weakness-table" class="table-responsive">
            <table class="table table-dark">
                <thead>
                    <tr>
                        <!-- Les entêtes de colonnes seront ajoutées ici -->
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <!-- Les données de la table seront ajoutées ici -->
                    </tr>
                </tbody>
            </table>
        </div>
    `);

    let table_head = table.find("thead tr:first");
    let table_body = table.find("div#tabletbody tr:first");

    for (type of TYPES) {
        let type_head = $("<th>").css({"width":"1px","white-space":"nowrap"}).attr("scope", "col").text(type);
        let type_value = $("<td>").text("1");
        table_head.append(type_head);
        table_body.append(type_value);
    }

    let pokemonSelect = $(pokemon_select);
    pokemonSelect.change(()=>{
        let pokemon = POKEMONS[pokemonSelect.val()];
        refreshWeaknessTable(pokemon);
    });
    
    root.append($("<h1>Pokemon Weakness Calculator</h1>"))
    root.append(pokemonSelect);
    root.append($(`<br><span id="weakness_target_types"></span>`))
    root.append(table);
    refreshWeaknessTable(POKEMONS["Chikorita"]);
    
    root.append($("<hr>"))

    let move_type_select = $(`<select id="move_type_select"></select>`)
    for (const type of TYPES) {
        move_type_select.append($(`<option value="${type}">${type}</option>`))
    }
    move_type_select.css({"width":"12vw"})
    move_type_select.change(()=>{
        let type = move_type_select.val();
        let pokemon = POKEMONS[target_select.val()];
        refreshMoveStrength(type, pokemon);
    });
    
    let target_select = $(`<select id="target_select"></select>`);
    for (const pokemon_name in POKEMONS) {
        target_select.append($(`<option value="${pokemon_name}">${pokemon_name}</option>`));
    }
    target_select.css({"width":"12vw"})
    target_select.change(()=>{
        let type = move_type_select.val();
        let pokemon = POKEMONS[target_select.val()];
        refreshMoveStrength(type, pokemon);
    });

    let weakness_sumup = $(`<div id="move_type_container">`);
    weakness_sumup.append($(`<h1 id="move_type_weakness_value">`))
    weakness_sumup.append($(`<div id="move_type_sumup">`))

    root.append($("<h1>Move Strength Calculator</h1>"));

    let select_p = $("<p>")
    select_p.append(move_type_select);
    select_p.append(" VS ")
    select_p.append(target_select);
    root.append(select_p);

    root.append(weakness_sumup);
}