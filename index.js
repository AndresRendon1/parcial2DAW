const apiUrl = 'https://pokeapi.co/api/v2';
const pokemonInput = document.getElementById('in1');
const searchButton = document.querySelector('.buttonSearch');
const evolutionButton = document.querySelector('.buttonEvolution');
const containerError = document.querySelector('.containerError');
const containerInfo = document.querySelector('.containerInfo');
const pokemonNameElement = document.querySelector('.pokemonName');
const pokemonImgElement = document.querySelector('.pokemonImg');
const pokemonTypeElement = document.querySelector('.pokemonType');
const pokemonDescriptionElement = document.querySelector('.pokemonDescrition');
const pokemonAbilitiesElement = document.querySelector('.pokemonAbilities');
const containerEvolution = document.querySelector('.containerEvolution');

searchButton.addEventListener('click', async () => {
    const pokemonName = pokemonInput.value.trim();
    if (pokemonName) {
        try {
            const pokemonResponse = await axios.get(`${apiUrl}/pokemon/${pokemonName}`);
            const pokemonSpeciesResponse = await axios.get(`${apiUrl}/pokemon-species/${pokemonName}`);
            
            const pokemonData = pokemonResponse.data;
            const pokemonSpeciesData = pokemonSpeciesResponse.data;

            const description = pokemonSpeciesData.flavor_text_entries.find(
                entry => entry.language.name === 'en'
            ).flavor_text.replace(/(\r\n|\n|\r)/gm, ' ');

            displayPokemonInfo(pokemonData, description);
        } catch (error) {
            displayError();
        }
    } else {
        displayError();
    }
});

evolutionButton.addEventListener('click', async () => {
    const pokemonName = pokemonInput.value.trim();
    if (pokemonName) {
        try {
            const pokemonSpeciesResponse = await axios.get(`${apiUrl}/pokemon-species/${pokemonName}`);
            const pokemonSpeciesData = pokemonSpeciesResponse.data;
            const evolutionChainResponse = await axios.get(pokemonSpeciesData.evolution_chain.url);
            const evolutionChainData = evolutionChainResponse.data.chain;
            displayEvolutions(evolutionChainData);
        } catch (error) {
            displayError();
        }
    } else {
        displayError();
    }
});

function displayPokemonInfo(pokemonData, description) {
    containerError.style.display = 'none';
    containerInfo.style.display = 'flex';
    pokemonNameElement.textContent = pokemonData.name;
    pokemonImgElement.src = pokemonData.sprites.front_default;
    pokemonTypeElement.textContent = pokemonData.types.map(type => type.type.name).join(', ');
    pokemonDescriptionElement.textContent = description;
    pokemonAbilitiesElement.textContent = pokemonData.abilities.map(ability => ability.ability.name).join(', ');
    containerEvolution.style.display = 'flex';
}

async function displayEvolutions(evolutionChainData) {
    containerEvolution.innerHTML = ''; // Limpiar la sección de evoluciones
    let currentPokemon = evolutionChainData;
    while (currentPokemon) {
        const pokemonName = currentPokemon.species.name;
        const pokemonResponse = await axios.get(`${apiUrl}/pokemon/${pokemonName}`);
        const pokemonData = pokemonResponse.data;

        // Actualizar la información mostrada en la interfaz de usuario
        pokemonNameElement.textContent = pokemonData.name;
        pokemonImgElement.src = pokemonData.sprites.front_default;
        pokemonTypeElement.textContent = pokemonData.types.map(type => type.type.name).join(', ');
        pokemonAbilitiesElement.textContent = pokemonData.abilities.map(ability => ability.ability.name).join(', ');

        currentPokemon = currentPokemon.evolves_to[0]; // Avanzar a la siguiente evolución
    }
}

function displayError() {
    containerInfo.style.display = 'none';
    containerError.style.display = 'block';
}
