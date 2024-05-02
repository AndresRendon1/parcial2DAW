const apiUrl = 'https://pokeapi.co/api/v2';
const pokemonInput = document.getElementById('in1');
const searchButton = document.querySelector('.buttonSearch');
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
      const response = await axios.get(`${apiUrl}/pokemon/${pokemonName}`);
      const pokemonData = response.data;
      displayPokemonInfo(pokemonData);
    } catch (error) {
      displayError();
    }
  } else {
    displayError();
  }
});

function displayPokemonInfo(pokemonData) {
  containerError.style.display = 'none';
  containerInfo.style.display = 'flex';
  pokemonNameElement.textContent = pokemonData.name;
  pokemonImgElement.src = pokemonData.sprites.front_default;
  pokemonTypeElement.textContent = pokemonData.types.map(type => type.type.name).join(', ');
  pokemonDescriptionElement.textContent = pokemonData.description;
  pokemonAbilitiesElement.textContent = pokemonData.abilities.map(ability => ability.ability.name).join(', ');
  containerEvolution.style.display = 'flex';
}

function displayError() {
  containerError.style.display = 'flex';
  containerInfo.style.display = 'none';
  containerEvolution.style.display = 'none';
}