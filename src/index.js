const dogBar = document.querySelector('#dog-bar');
const dogInfo = document.querySelector('#dog-info');
const filterBtn = document.querySelector('#good-dog-filter');
let isFilterOn = false;

// STEP 2: ADD PUPS TO DOG BAR
fetch('http://localhost:3000/pups')
  .then(response => response.json())
  .then(pupsData => {
    pupsData.forEach(pup => {
        const span = document.createElement('span');
        span.textContent = pup.name;
        dogBar.appendChild(span);

      //when the span is clicked, show the pup's info
      span.addEventListener('click', () => showPupInfo(pup));
   });
  });
 // STEP 3: SHOW MORE INFO ABOUT EACH PUP
function showPupInfo(pup) {
    dogInfo.innerHTML = `
      <img src="${pup.image}" />
      <h2>${pup.name}</h2>
      <button>${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
    `;
  
    // when the button is clicked, toggle the pup's good/bad status
    const btn = dogInfo.querySelector('button');
    btn.addEventListener('click', () => togglePupStatus(pup, btn));
  }
  
  // STEP 4: TOGGLE GOOD DOG
  function togglePupStatus(pup, btn) {
    pup.isGoodDog = !pup.isGoodDog;
    btn.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
  
    // update the database with the new status
    fetch(`http://localhost:3000/pups/${pup.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isGoodDog: pup.isGoodDog })
    });
  }
  
  // BONUS! STEP 5: FILTER GOOD DOGS
  filterBtn.addEventListener('click', () => {
    isFilterOn = !isFilterOn;
    filterBtn.textContent = `Filter good dogs: ${isFilterOn ? 'ON' : 'OFF'}`;
  
    // clear the dog bar
    dogBar.innerHTML = '';
  
    // fetch the pups data again and filter based on isGoodDog status
    fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(pupsData => {
        pupsData
          .filter(pup => !isFilterOn || pup.isGoodDog) // filter if isFilterOn is true
          .forEach(pup => {
            const span = document.createElement('span');
            span.textContent = pup.name;
            dogBar.appendChild(span);
  
            // when the span is clicked, show the pup's info
            span.addEventListener('click', () => showPupInfo(pup));
          });
      });
  });