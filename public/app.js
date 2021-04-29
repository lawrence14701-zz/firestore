///// User Authentication /////
const auth = firebase.auth();

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");

const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");

const userDetails = document.getElementById("userDetails");

console.log("eerere");

const provider = new firebase.auth.GoogleAuthProvider();

/// Sign in event handlers

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged((user) => {
    if (user) {
        // signed in
        whenSignedIn.style.display = "block";
        whenSignedOut.style.display = "none";
        userDetails.innerHTML = `<h3 class="mr-4" >Hello ${user.displayName}!</h3>`;
    } else {
        // not signed in
        whenSignedIn.style.display = "none";
        whenSignedOut.style.display = "block";
        userDetails.innerHTML = "";
    }
});

// ///// Firestore /////

const db = firebase.firestore();

// const createThing = document.getElementById('createThing');
const carList = document.getElementById('carList');
const popup = document.getElementById('popup')

let carsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {

    if (user) {
        popup.style.display = "none"
        carList.style.display = "block"


        // Database Reference
        carsRef = db.collection('cars')



        // Query
        unsubscribe = carsRef
            .onSnapshot(querySnapshot => {

                // Map results to an array of li elements

                const items = querySnapshot.docs.map(doc => {

                    return `
                <div class='title is-child box'>
                <div class="card">
                    <div class="card-image">
                        <figure class="image is-4by3">
                        <img src=${doc.data().image} alt="Placeholder image">
                        </figure>
                    </div>
                    <div class="card-content">
                        <div class="media">
                        <div class="media-content">
                            <p class="title is-4">${doc.data().name}</p>
                        </div>
                        </div>
                        <div class="content">
                        ${doc.data().info}
                        <p class="title is-4 mt-4">${doc.data().price}</p>
                        </div>
                    </div>
                </div>
                </div>
                `

                });

                console.log(items, 'items')

                carList.innerHTML = items.join('');

            });

    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
        carList.style.display = "none"
        popup.style.display = "block"
    }
});