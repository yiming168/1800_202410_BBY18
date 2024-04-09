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
                let userDescription = userDoc.data().description || "";
                let picUrl = userDoc.data().profilePic;

                document.getElementById("nameInput").value = userName;
                document.getElementById("numberInput").value = userNumber;
                document.getElementById("cityInput").value = userCity;
                document.getElementById("descriptionInput").value = userDescription;

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

                if (picUrl != null) {
                    console.log(picUrl);
                    // use this line if "mypicdiv" is a "div"
                    //$("#mypicdiv").append("<img src='" + picUrl + "'>")
                    $("#mypic-goes-here").attr("src", picUrl);
                }
            });
        } else {
            console.log("No user is signed in");
        }
    });
}

// Call the function to run it 
populateUserInfo();


//Function to enable the form fields for editing
function editUserInfo() {
    document.getElementById('personalInfoFields').disabled = false;
    // Adjust to 'block' to match the CSS for centering
    // document.getElementById('mypic-input').style.display = 'block'; // Make the input itself invisible
    document.querySelector('label[for="mypic-input"]').style.display = 'block'; // Use 'block' for the label as well
}



var ImageFile;      //global variable to store the File Object reference

function chooseFileListener() {
    const fileInput = document.getElementById("mypic-input");   // pointer #1
    const image = document.getElementById("mypic-goes-here");   // pointer #2

    //attach listener to input file
    //when this file changes, do something
    fileInput.addEventListener('change', function (e) {

        //the change event returns a file "e.target.files[0]"
        ImageFile = e.target.files[0];
        var blob = URL.createObjectURL(ImageFile);

        //change the DOM img element source to point to this file
        image.src = blob;    //assign the "src" property of the "img" tag
    })
}
chooseFileListener();

// Function to display a thank-you message
function displayThankYouMessage() {
    // Create a new element for the message
    const messageElement = document.createElement('div');
    messageElement.classList.add('alert', 'alert-success', 'mt-3');
    messageElement.setAttribute('role', 'alert');
    messageElement.innerHTML = 'Thank you for setting up your profile! You can now edit your information below.';

    // Get the container where the message will be displayed
    const container = document.querySelector('.profileContainer');

    // Insert the message before the form
    container.insertBefore(messageElement, container.firstChild);

    // Remove the message after 2 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 2000);
}


function saveUserInfo() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) { // Check if user is logged in
            var storageRef = firebase.storage().ref("images/" + user.uid + ".jpg");

            // Asynchronous call to put File Object onto Cloud
            storageRef.put(ImageFile)
                .then(function () {
                    console.log('Uploaded to Cloud Storage.');

                    // Asynchronous call to get URL from Cloud
                    storageRef.getDownloadURL()
                        .then(function (url) { // Get "url" of the uploaded file
                            console.log("Got the download URL.");

                            // Get user-entered values
                            let userName = document.getElementById('nameInput').value;
                            let userNumber = document.getElementById('numberInput').value;
                            let userCity = document.getElementById('cityInput').value;
                            let userDescription = document.getElementById('descriptionInput').value;
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
                                number: userNumber,
                                description: userDescription,
                                profilePic: url // Assuming "profilePic" is the correct field name in Firestore
                            })
                                .then(() => {
                                    console.log("Document successfully updated!");
                                    // Redirect to main page after successful update
                                    window.location.href = "main.html"; // Ensure this URL is correct
                                    // Display thank-you message for first-time users
                                    displayThankYouMessage();
                                })
                                .catch(error => {
                                    console.error("Error updating document: ", error);
                                    alert("Error updating document. Please try again later.");
                                });

                            // Disable edit 
                            document.getElementById('personalInfoFields').disabled = true;
                        }).catch(error => {
                            console.error("Error getting download URL: ", error);
                        });
                }).catch(error => {
                    console.error("Error uploading file to Cloud Storage: ", error);
                });
        } else {
            console.log("No user is signed in.");
        }
    });
}
