var currentUser; // Points to the document of the user who is logged in

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
            });

            // Load name, city, and number of the user
            db.collection("users").doc(user.uid).get().then(doc => {
                if (doc.exists) {
                    let userData = doc.data();
                    document.getElementById("nameInput").value = userData.name || "";
                    document.getElementById("cityInput").value = userData.city || "";
                    document.getElementById("numberInput").value = userData.number || "";
                } else {
                    console.log("No such document!");
                }
            }).catch(error => {
                console.log("Error getting document:", error);
            });

        } else {
            console.log("No user is signed in");
        }
    });
}

// Call the function to run it 
populateUserInfo();

// Function to enable the form fields for editing
function editUserInfo() {
    document.getElementById('personalInfoFields').disabled = false;
}

// Function to save user information to Firestore
function saveUserInfo() {
    // Get user-entered values
    let userName = document.getElementById('nameInput').value;      
    let userNumber = document.getElementById('numberInput').value;    
    let userCity = document.getElementById('cityInput').value;      
    let userGuestPref = document.querySelector('input[name="guestInput"]:checked').value === "true";
    let userMorningType = document.querySelector('input[name="morningInput"]:checked').value === "true";
    let userPetPref = document.querySelector('input[name="petInput"]:checked').value === "true";

    // Update user's document in Firestore
    currentUser.update({
        name: userName,
        pet: userPetPref,
        city: userCity,
        guest: userGuestPref,
        morning: userMorningType,
        number: userNumber
    })
    .then(() => {
        console.log("Document successfully updated!");
        // Redirect to main page after successful update
        window.location.href = "main.html"; // Replace "main.html" with the actual URL of your main page
    })
    .catch(error => {
        console.error("Error updating document: ", error);
        alert("Error updating document. Please try again later.");
    });
    
    // Disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}