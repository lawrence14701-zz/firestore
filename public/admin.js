const carForm = document.getElementById("carForm");
const signIn = document.getElementById("signIn");
const signInButton = document.getElementById("signInButton");
const createCar = document.getElementById("createCar");
const signOutBtn = document.getElementById("signOutBtn");

signInButton.onclick = () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;


  firebase
    .auth()
    .signInWithEmailAndPassword(username, password)
    .then(() => {
      // Signed in
      signIn.style.display = "none";
      carForm.style.display = "block";
      document.getElementById("error").style.display = "none";

      // ...
    })
    .catch((error) => {
      console.log(error);
      document.getElementById("error").style.display = "block";
      // ..
    });
};

signOutBtn.onclick = () => firebase.auth().signOut();

const db = firebase.firestore();
const carsRef = db.collection("cars");

createCar.onclick = () => {

  carsRef.add({
    name: document.getElementById("name").value,
    image: document.getElementById("imageUrl").value,
    info: document.getElementById("info").value,
    price: document.getElementById("price").value,
  });

  document.getElementById('success').style.display = 'block'
  document.getElementById('delete').style.display = 'none'

};

carsRef.onSnapshot((querySnapshot) => {
  // Map results to an array of li elements
  const items = querySnapshot.docs.map((doc) => {
    return `
  <span class="tag is-danger is-large">
    ${doc.data().name}
    <button onclick="handleDelete('${doc.id}')" class="delete"></button>
  </span>`;
  });

  console.log(items, "items");

  document.getElementById('items').innerHTML = items.join("");
});


const handleDelete = (id) =>{
  db.collection("cars").doc(id).delete().then(() => {
    console.log("Document successfully deleted!");
    document.getElementById('success').style.display = 'none'
    document.getElementById('delete').style.display = 'block'
}).catch((error) => {
    console.error("Error removing document: ", error);
});
}




