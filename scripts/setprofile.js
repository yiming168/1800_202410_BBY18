var currentUser; // Points to the document of the user who is logged in
var isFirstTimeUser = false; // Flag to track whether the user is editing their profile for the first time
// Function to populate user information from Firestore and set default values for radio buttons
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            currentUser.get().then(userDoc => {
                let userName = userDoc.data().name || "";
                let userNumber = userDoc.data().number || "";
                let userCity = userDoc.data().city || "";
                let userGuestPref = userDoc.data().guest || false;
                let userMorningType = userDoc.data().morning || false;
                let userPetPref = userDoc.data().pet || false;

                document.getElementById("nameInput").value = userName;
                document.getElementById("numberInput").value = userNumber;
                document.getElementById("cityInput").value = userCity;
                
                // Set radio button states based on user preferences
                document.getElementById("guestYes").checked = userGuestPref === true;
                document.getElementById("guestNo").checked = userGuestPref === false;
                document.getElementById("morningYes").checked = userMorningType === true;
                document.getElementById("morningNo").checked = userMorningType === false;
                document.getElementById("petYes").checked = userPetPref === true;
                document.getElementById("petNo").checked = userPetPref === false;

                // Check if the user has completed profile setup
                if (!userName || !userCity || !userNumber || userGuestPref === null || userMorningType === null || userPetPref === null) {
                    isFirstTimeUser = true;
                    // Enable the form fields for editing by default only for the first-time user
                    document.getElementById('personalInfoFields').disabled = false;
                } else {
                    isFirstTimeUser = false;
                    // Disable the form fields for editing by default for other users
                    document.getElementById('personalInfoFields').disabled = true;
                }
            });
        } else {
            console.log("No user is signed in");
        }
    });
}

// Call the function to run it 
populateUserInfo();

function editUserInfo(){
    document.getElementById('personalInfoFields').ariaDisabled = false;
}

function saveUserInfo(){
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userCity = document.getElementById('cityInput').value;     //get the value of the field with id="schoolInput"
    userPetPref = document.getElementById('petInput').value;       //get the value of the field with id="cityInput"
    userGuestPref = document.getElementById('guestInput').value;       //get the value of the field with id="nameInput"
    userMorningType = document.getElementById('morningInput').value;     //get the value of the field with id="schoolInput"
    userNumber = document.getElementById('numberInput').value;       //get the value of the field with id="cityInput"

    currentUser.update({
        name: userName,
        city: userCity,
        petPref: userPetPref,
        guestPref: userGuestPref,
        morningType: userMorningType,
        number: userNumber
    
    })
    .then(() => {
        console.log("Document successfully updated!");
    })    

    document.getElementById('personalInfoFields').disabled = true;
}


