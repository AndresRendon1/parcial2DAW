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
const nextButton = document.createElement('button');
nextButton.textContent = 'Siguiente Evolución';

searchButton.addEventListener('click', async () => {
    const pokemonName = pokemonInput.value.trim();
    if (pokemonName) {
        try {
            const pokemonResponse = await axios.get(`${apiUrl}/pokemon/${pokemonName}`);
            const pokemonData = pokemonResponse.data;

            const pokemonSpeciesResponse = await axios.get(`${apiUrl}/pokemon-species/${pokemonData.id}`);
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
            const pokemonResponse = await axios.get(`${apiUrl}/pokemon/${pokemonName}`);
            const pokemonData = pokemonResponse.data;

            const pokemonSpeciesResponse = await axios.get(`${apiUrl}/pokemon-species/${pokemonData.id}`);
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

        // Mostrar la primera evolución
        pokemonNameElement.textContent = pokemonData.name;
        pokemonImgElement.src = pokemonData.sprites.front_default;
        pokemonTypeElement.textContent = pokemonData.types.map(type => type.type.name).join(', ');
        pokemonAbilitiesElement.textContent = pokemonData.abilities.map(ability => ability.ability.name).join(', ');

        // Mostrar el botón de evolución si aún hay evoluciones disponibles
        containerEvolution.appendChild(nextButton);
        containerEvolution.style.display = currentPokemon.evolves_to.length ? 'flex' : 'none';

        // Salir del bucle si no hay más evoluciones
        if (!currentPokemon.evolves_to.length) {
            break;
        }

        // Esperar hasta que se haga clic en el botón "Siguiente Evolución"
        await new Promise(resolve => {
            nextButton.addEventListener('click', resolve, { once: true });
        });

        // Avanzar a la siguiente evolución
        currentPokemon = currentPokemon.evolves_to[0];
    }
}

function displayError() {
    containerInfo.style.display = 'none';
    containerError.style.display = 'block';
}
