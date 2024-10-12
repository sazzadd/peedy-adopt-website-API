let allPets = [];

// Fetch All Pets
const loadAllPets = async () => {
   const response = await fetch('https://openapi.programming-hero.com/api/peddy/pets');
   const data = await response.json();
   allPets = data.pets;
   handleCategoryClick() // Store the fetched pets data in the global variable
   displayPets(allPets); // Display pets by default
}

// Remove active class
const removeActiveClass = () => {
   const buttons = document.getElementsByClassName('category-btn');
   console.log(buttons);
   for (let btn of buttons) {
      btn.classList.remove("active");
   }
}

// Load category pets
const loadCategoryPet = (category) => {
   fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`)
      .then((res) => res.json())
      .then((data) => {
         // Active-remove 
         removeActiveClass();

         // Set active class
         const activeBtn = document.getElementById(`btn-${category}`);
         activeBtn.classList.add('active');
         displayPets(data.data);
      })
      .catch((error) => console.log(error));
}

// Display pets
const displayPets = (pets) => {
   const petsContainer = document.getElementById('pet-container');
   petsContainer.innerHTML = "";

   if (pets.length == 0) {
      petsContainer.classList.remove('grid');
      petsContainer.innerHTML =
         `
        <div class='my-10 felx flex-col gap-4 justify-center items-center'>
            <div class="flex justify-center items-center">
                <img src="./assets/no-info.png" alt="no-info">
            </div>
            <h1 class="text-center text-5xl font-bold py-6">No Information Available</h1>
            <p class="text-[#131313b3] text-center">No details found here. Please try again or contact support for assistance. or Stay tuned for updates..</p>
        </div>
        
        `;
      return;
   } else {
      petsContainer.classList.add('grid');
   }

   pets.forEach(pets => {
      console.log(pets);
      const breedDisplay = pets?.breed || "No breed information available";
      const div = document.createElement('div');
      div.innerHTML =
         `
        <div class="pet-card bg-white p-4 rounded shadow-lg">
            <img src="${pets.image}" alt="${pets.pet_name}" class="w-full h-48 object-cover rounded">
            <h3 class="text-lg font-bold mt-2">${pets.pet_name}</h3>
            <p class="text-gray-500"><i class="fa-solid fa-table-cells pr-1"></i>Breed:${pets?.breed || "<span class='text-amber-300'>No Breed information available</span>"}</p>
            <p class="text-gray-500"><i class="fa-regular pr-1 fa-calendar-days"></i>Birth:${pets?.date_of_birth || "<span class='text-amber-300'>No Birth information available</span>"}</p>
            <p class="text-gray-500"><i class="fa-solid fa-venus pr-1"></i>Gender:${pets?.gender || "<span class='text-amber-300'>No Gender information available</span>"}</p>
            <p class="text-gray-500"><i class="fa-solid pr-1 fa-dollar-sign"></i>Price:${pets?.price || "<span class='text-amber-300'>No Price information available</span>"}</p>
            </br>
            <hr>
            <div class="mt-4 flex flex-col lg:flex-row gap-3 lg:justify-between">
                <button onclick="likePet('${pets.image}')" class="bg-white border like text-[#191919] px-6 py-2 rounded"><i class="fa-regular fa-thumbs-up"></i></button>
                <button onclick="showModalWithCountdown(this)" id='adopt' class="bg-white border adopt font-bold text-[#0E7A81] pl-6 px-6 py-2 rounded">Adopt</button>
                <button class="bg-white border category-btn font-bold Details text-[#0E7A81] px-6 py-2 rounded" onclick="loadDetails('${pets.petId}')">Details</button>
            </div>
        </div>
        `;
      petsContainer.appendChild(div);
   });
}

// Like pet
const likePet = (img) => {
   const likedPetsContainer = document.getElementById('liked-pets-container');
   const div = document.createElement('div');
   div.innerHTML = `<img src="${img}" class='rounded-lg' alt='petImg'>`;
   likedPetsContainer.appendChild(div);
}
// Load categories and display them
const loadCategories = () => {
   fetch('https://openapi.programming-hero.com/api/peddy/categories')
      .then((res) => res.json())
      .then((data) => DisplayCategories(data.categories))
      .catch((error) => console.log(error));
};

const DisplayCategories = (data) => {
   const categoryContainer = document.getElementById('button-container');
   data.forEach((item) => {
      // Create button container
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('flex');
      buttonContainer.classList.add('justify-center');
      // HTML structure for button
      buttonContainer.innerHTML = `
        <div class="relative inline-block mb-4">
          <button id="btn-${item.category}" 
                  onclick="handleCategoryClick('${item.category}')" 
                  class="category-btn border gap-2 inline flex text-black text-bold justify-center  px-8 w-[220px] align-center h-[50px] py-2 rounded hover:border-[#0e7981fe] hover:bg-[#0E7A811A]">
            <img src="${item.category_icon}" class="w-6 h-5" alt>
            <span class="font-bold">${item.category}</span>
          </button>
        </div>
      `;
      // Add button to category container
      categoryContainer.append(buttonContainer);
   });
};

// Handle category click to show Spinner 
const handleCategoryClick = (category) => {
   const spinnerContainer = document.createElement('div');
   spinnerContainer.id = 'global-spinner';
   spinnerContainer.className = 'hidden fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50';
   spinnerContainer.innerHTML = 
    `
      <span class="loading loading-bars loading-lg"></span>
    `;
   document.body.appendChild(spinnerContainer);
   spinnerContainer.classList.remove('hidden');
   setTimeout(() => {
      loadCategoryPet(category);
      spinnerContainer.classList.add('hidden');
      document.body.removeChild(spinnerContainer);
   }, 2000);
};

// Load pet details from details button
const loadDetails = async (petId) => {
   const uri = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`;
   const res = await fetch(uri);
   const data = await res.json();
   DisplayDetails(data.petData);
}
// Display pet details
const DisplayDetails = (petData) => {
   const detailsContainer = document.getElementById('details-container');
   detailsContainer.innerHTML = 
   `
        <div class="img flex justify-center align-center rounded-lg">
            <img class='rounded-lg w-fit w-full' src="${petData.image}" alt>
        </div>
        <h3 class='text-2xl mt-8 font-bold'>${petData.pet_name}</h3>
        <div class='flex gap-12 text-gray-500 pt-2 mb-3'>
            <div class="left-data w-1/2">
                <p class='pt-3'><i class="fa-solid fa-table-cells mr-1"></i><span class="mr-1"> Breed: </span> </i>${petData?.breed || "<span class='text-amber-300'>No Breed information available</span>"}</p>
                <p class='pt-3'><i class="fa-solid mr-1 fa-mercury"></i><span> Gender: </span>${petData?.gender || "<span class='text-amber-300'>No Gender information available</span>"}</p>
                <p class='pt-3'><i class="fa-solid fa-syringe mr-1"></i><span> Vaccinated status: </span>${petData?.vaccinated_status || "<span class='text-amber-300'>No vaccinated status information available</span>"}</p>
            </div>
            <div class="right-data w-1/2">
                <p class='pt-3'><i class="fa-regular fa-calendar mr-1"></i><span> Birth: </span>${petData?.date_of_birth || "<span class='text-amber-300'>No Birth information available</span>"}</p>
                <p class='pt-3'><i class="fa-solid fa-dollar-sign mr-1 "></i><span> Price: </span> ${petData?.price || "<span class='text-amber-300'>No Price information available</span>"}</p>
            </div>
        </div>
        <hr>
        <h1 class='font-bold py-1'>Details Information</h1>
        <p class='text-gray-500'>${petData.pet_details}</p>

    `;
   document.getElementById('detailsModal').showModal();
}

function showModalWithCountdown(adoptButton) {
   const modal = document.getElementById("adoptModal");
   const container = document.getElementById("adopt-container");
   modal.showModal();
   // Change the button text to "Adopted"
   adoptButton.innerHTML = `
    <span class='text-green-600'>Adopted</span>
    
    `;

   let countdown = 3;
   // Display the initial countdown before starting the interval
   container.innerHTML = 
   `
        <div class='flex justify-center mt-12  align-center'>
            <img src="./assets/handshake.png" alt>
        </div>
        <h3 class="text-5xl mt-12"></h3>
        <p class="text-5xl text-center">Congrats</p>
        <p class="text-gray-500 text-center">adoption process is start for your pet</p>
        <h3 class="text-5xl mb-12">${countdown}</h3>

    `;

   // Start the countdown after 1 second to avoid displaying "1" initially
   const countdownInterval = setInterval(() => {
      countdown--; // Decrement the countdown first
      if (countdown >= 0) {
         container.innerHTML = `
                <div class='flex justify-center mt-12  align-center'>
                    <img src="./assets/handshake.png" alt>
                </div>
                <h3 class="text-5xl mt-12"></h3>
                <p class="text-5xl text-center">Congrats</p>
                <p class="text-gray-500 text-center">adoption process is start for your pet</p>
                <h3 class="text-5xl mb-12">${countdown}</h3>`;
      }
      if (countdown === 0) {
         clearInterval(countdownInterval);
         modal.close();
      }
   }, 1000);
}

// Function to sort pets  price descending order
const sortPetsByPriceDescending = () => {
   const sortedPets = [...allPets].sort((a, b) => b.price - a.price);
   displayPets(sortedPets);
}
document.getElementById('short-price').addEventListener('click', sortPetsByPriceDescending);

// Initial load
loadCategories();
loadAllPets();