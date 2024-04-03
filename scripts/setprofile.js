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
                            let userPetPref = userDoc.data().petPref;
                            let userGuestPref = userDoc.data().guestPref;
                            let userMorningType = userDoc.data().morningType;
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
                    console.log ("No user is signed in");
                }
            });
        }

//call the function to run it 
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


