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

// Function to fetch the logged-in user's preferences from Firestore
function fetchLoggedInUserPreferences() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is logged in, fetch preferences from Firestore
        db.collection("users").doc(user.uid).get()
          .then(userDoc => {
            const loggedInUserPreferences = {
              pet: userDoc.data().pet,
              guest: userDoc.data().guest,
              morning: userDoc.data().morning
            };
            resolve(loggedInUserPreferences);
          })
          .catch(error => {
            console.error("Error fetching user preferences:", error);
            reject(error);
          });
      } else {
        // User is not logged in
        reject(new Error("User is not logged in"));
      }
    });
  });
}

// Function to query Firestore for users with matching preferences
function queryMatchingUsers(loggedInUserPreferences) {
  return new Promise((resolve, reject) => {
    // Query Firestore to find users whose preferences match the logged-in user's preferences
    db.collection("users")
      .where("pet", "==", loggedInUserPreferences.pet)
      .where("guest", "==", loggedInUserPreferences.guest)
      .where("morning", "==", loggedInUserPreferences.morning)
      .limit(4) // Limit the number of matched users to 4
      .get()
      .then(querySnapshot => {
        const matchedUsers = [];
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          // Exclude the logged-in user from the list of matched users
          if (doc.id !== firebase.auth().currentUser.uid) {
            matchedUsers.push(userData);
          }
        });
        resolve(matchedUsers);
      })
      .catch(error => {
        console.error("Error querying matching users:", error);
        reject(error);
      });
  });
}

// // Function to display matched users in the popup
// function displayMatchedUsersPopup(matchedUsers) {
//   const container = document.getElementById('matchingUsersContainer');
//   container.innerHTML = ''; // Clear previous content

//   matchedUsers.forEach(user => {
//     const userCard = document.createElement('div');
//     userCard.classList.add('user-card');
//     userCard.innerHTML = `
//       <input type="checkbox" class="user-checkbox">
//       <h3 class="user-name">${user.name}</h3>
//       <p class="user-email">Email: ${user.email}</p>
//       <p class="user-city">City: ${user.city}</p>
//       <p class="user-phone" style="display:none;">Phone: ${user.number}</p>
//       <p class="user-description" style="display:none;">Description: ${user.description}</p>
//     `;
    
//     // Add event listener to display additional information when mouse is moved over the user card
//     userCard.addEventListener('mouseover', () => {
//       const userPhone = userCard.querySelector('.user-phone');
//       const userDescription = userCard.querySelector('.user-description');
//       userPhone.style.display = 'block';
//       userDescription.style.display = 'block';
//     });

//     // Add event listener to hide additional information when mouse moves away from the user card
//     userCard.addEventListener('mouseout', () => {
//       const userPhone = userCard.querySelector('.user-phone');
//       const userDescription = userCard.querySelector('.user-description');
//       userPhone.style.display = 'none';
//       userDescription.style.display = 'none';
//     });

//     container.appendChild(userCard);
//   });

//   // Display the popup
//   const popup = document.getElementById('matchingUsersPopup');
//   popup.style.display = 'block';
// }

// Function to display matched users in the popup
function displayMatchedUsersPopup(matchedUsers) {
  const container = document.getElementById('matchingUsersContainer');
  container.innerHTML = ''; // Clear previous content

  matchedUsers.forEach(user => {
    const userCard = document.createElement('div');
    userCard.classList.add('user-card');
    userCard.innerHTML = `
      <input type="checkbox" class="user-checkbox">
      <h3 class="user-name">${user.name}</h3>
      <p class="user-email">Email: ${user.email}</p>
      <p class="user-city">City: ${user.city}</p>
      <p class="user-phone" style="display:none;">Phone: ${user.number}</p>
      <p class="user-description" style="display:none;">Description: ${user.description}</p>
    `;

    // Add event listener to toggle additional information when user clicks on the user card
    userCard.addEventListener('click', () => {
      const userPhone = userCard.querySelector('.user-phone');
      const userDescription = userCard.querySelector('.user-description');
      // Toggle the display of additional information
      if (userPhone.style.display === 'none') {
        userPhone.style.display = 'block';
        userDescription.style.display = 'block';
      } else {
        userPhone.style.display = 'none';
        userDescription.style.display = 'none';
      }
    });

    container.appendChild(userCard);
  });

  // Display the popup
  const popup = document.getElementById('matchingUsersPopup');
  popup.style.display = 'block';
}
// Auto-fetch matched users when the user is logged in
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    fetchLoggedInUserPreferences()
      .then(loggedInUserPreferences => {
        queryMatchingUsers(loggedInUserPreferences)
          .then(matchedUsers => {
            // Display matched users in the popup
            displayMatchedUsersPopup(matchedUsers);
          })
          .catch(error => {
            console.error("Error querying matching users:", error);
          });
      })
      .catch(error => {
        console.error("Error fetching user preferences:", error);
      });
  }
});

function getFormattedDateTime() {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); // Get day in lowercase
  const hour = now.getHours();
  let timeOfDay;

  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning';
  } else if (hour >= 12 && hour < 18) {
    timeOfDay = 'afternoon';
  } else {
    timeOfDay = 'evening';
  }

  return { day, timeOfDay };
}

function displayGreeting() {
  const { day, timeOfDay } = getFormattedDateTime();
  let greeting;

  switch (timeOfDay) {
    case 'morning':
      greeting = 'Good morning';
      break;
    case 'afternoon':
      greeting = 'Good afternoon';
      break;
    case 'evening':
      greeting = 'Good evening';
      break;
    default:
      greeting = 'Hello';
  }

  document.getElementById("greeting").innerText = `${greeting}, `;
}

// Call the displayGreeting function to display the appropriate greeting message
displayGreeting();

// Function to email selected users
function emailSelectedUsers() {
  const selectedUsers = [];
  const checkboxes = document.querySelectorAll('.user-card input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const userCard = checkbox.closest('.user-card');
      const userEmail = userCard.querySelector('.user-email').textContent.replace('Email: ', ''); // Extract email without "Email: " prefix
      selectedUsers.push(userEmail);
    }
  });

  if (selectedUsers.length > 0) {
    // Compose email content
    const emailContent = "Hi. We have the same preference of renting. If you are still interested in renting a room, we can rent together.";

    // Construct mailto link with email content and selected email addresses
    const emailAddresses = selectedUsers.join(',');
    const emailSubject = "Roommate Match Proposal";
    const mailtoLink = `mailto:${emailAddresses}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailContent)}`;

    // Open email composition in a new window
    const emailWindow = window.open(mailtoLink, '_blank');

  } else {
    alert("Please select at least one user to email.");
  }
}


// Function to update user status to "proposed" in Firestore
function updateUserStatus(email) {
  // Update user status to "proposed" in Firestore
  db.collection("users").where("email", "==", email).get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.update({ status: "proposed" });
      });
    })
    .catch(error => {
      console.error("Error updating user status:", error);
    });
}
