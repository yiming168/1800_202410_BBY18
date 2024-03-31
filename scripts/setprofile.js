var currentUser;               //points to the document of the user who is logged in
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    let userName = userDoc.data().name;
                    let userCity = userDoc.data().city;
                    let userPetPref = userDoc.data().pet;
                    let userGuestPref = userDoc.data().guest;
                    let userMorningType = userDoc.data().morning;
                    let userNumber = userDoc.data().number;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userNumber != null) {
                        document.getElementById("numberInput").value = userNumber;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }

                    // Check and set radio button states for preferences
                    if (userGuestPref === "yes") {
                        document.getElementById("guestYes").checked = true;
                    } else if (userGuestPref === "no") {
                        document.getElementById("guestNo").checked = true;
                    }
                    if (userMorningType === "yes") {
                        document.getElementById("morningYes").checked = true;
                    } else if (userMorningType === "no") {
                        document.getElementById("morningNo").checked = true;
                    }
                    if (userPetPref === "yes") {
                        document.getElementById("petYes").checked = true;
                    } else if (userPetPref === "no") {
                        document.getElementById("petNo").checked = true;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//call the function to run it 
populateUserInfo();

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    //a) get user entered values
    let userName = document.getElementById('nameInput').value;      
    let userNumber = document.getElementById('numberInput').value;    
    let userCity = document.getElementById('cityInput').value;      
    let userGuestPref = document.querySelector('input[name="guestInput"]:checked').value === "true";
    let userMorningType = document.querySelector('input[name="morningInput"]:checked').value === "true";
    let userPetPref = document.querySelector('input[name="petInput"]:checked').value === "true";

    
    //b) update user's document in Firestore
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
        window.location.href = "main.html"; // Replace "main-page.html" with the actual URL of your main page
    })
    .catch(error => {
        console.error("Error updating document: ", error);
        alert("Error updating document. Please try again later.");
    });
    //c) disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}