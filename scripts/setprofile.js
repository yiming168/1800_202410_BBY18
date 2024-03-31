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
                    if (userPetPref != null) {
                        document.getElementById("petInput").value = userPetPref;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userGuestPref != null) {
                        document.getElementById("guestInput").value = userGuestPref;
                    }
                    if (userMorningType != null) {
                        document.getElementById("morningInput").value = userMorningType;
                    }
                    if (userNumber != null) {
                        document.getElementById("numberInput").value = userNumber;
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
    userName = document.getElementById('nameInput').value;      
    userPetPref = document.getElementById('petInput').value;    
    userCity = document.getElementById('cityInput').value;      
    userGuestPref = document.getElementById('guestInput').value;       
    userMorningType = document.getElementById('morningInput').value;     
    userNumber = document.getElementById('numberInput').value;       

    
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
    });
    //c) disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}