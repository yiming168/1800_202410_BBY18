function handleLogout() {
  event.preventDefault(); // Prevent default anchor link behavior
  try {
    firebase.auth().signOut().then(() => {
      console.log('User logged out successfully');
      // Add logic to update UI or redirect (optional)
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  } catch (error) {
    // Handle any errors in the signOut process
    console.error(error);
  }
  const logoutLink = document.getElementById('logoutLink');
  logoutLink.addEventListener('click', handleLogout);
}

// Function to read the quote of the day from the Firestore "quotes" collection
// Input param is the String representing the day of the week, aka, the document name
function readQuote(day) {
  db.collection("quotes").doc(day)                                                      //name of the collection and documents should matach excatly with what you have in Firestore
    .onSnapshot(dayDoc => {                                                               //arrow notation
      console.log("current document data: " + dayDoc.data());                          //.data() returns data object
      document.getElementById("quote-goes-here").innerHTML = dayDoc.data().quote;      //using javascript to display the data on the right place

      //Here are other ways to access key-value data fields
      //$('#quote-goes-here').text(dayDoc.data().quote);         //using jquery object dot notation
      //$("#quote-goes-here").text(dayDoc.data()["quote"]);      //using json object indexing
      //document.querySelector("#quote-goes-here").innerHTML = dayDoc.data().quote;
    })
}
// readQuote("tuesday");        //calling the function

// Function to get the current date in the desired format (replace if needed)
function getFormattedDate() {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();  // Get day in lowercase
  return day;
}

// Get today's date
const today = getFormattedDate();

// Call the readQuote function with today's date
readQuote(today);

// Simulate displaying the quote (replace with your actual display logic)
console.log(`Today's quote:`);

function insertNameFromFirestore() {
  // Check if the user is logged in:
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log(user.uid); // Let's know who the logged-in user is by logging their UID
      currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
      currentUser.get().then(userDoc => {
        // Get the user name
        let userName = userDoc.data().name;
        console.log(userName);
        //$("#name-goes-here").text(userName); // jQuery
        document.getElementById("name-goes-here").innerText = userName;

        // Check if the user has completed profile setup
        if (userDoc.data().pet === null || userDoc.data().morning === null || userDoc.data().guest === null || !userDoc.data().number)
          // Redirect the user to set up their profile
          window.location.href = "setprofile.html"; // Replace "set-profile.html" with the actual URL of your profile setup page
      })
    } else {
      console.log("No user is logged in."); // Log a message when no user is logged in
    }
  })
}

insertNameFromFirestore();