// Importação dos módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, setDoc, doc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Configuração do Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyBJ66e6JLuYm1ZWWerP94OdyBe5CFpMzkQ",
    authDomain: "loginpw2-aae26.firebaseapp.com",
    projectId: "loginpw2-aae26",
    storageBucket: "loginpw2-aae26.firebasestorage.app",
    messagingSenderId: "376191388905",
    appId: "1:376191388905:web:7b560a4d4c1dbbeea7b478"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Login com Google
const googleLogin = document.getElementById("google001");
googleLogin.addEventListener("click", function () {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
      // Redireciona para homepage
      window.location.href = "../homepage.html"; 
    })
    .catch((error) => {
      console.error("Erro ao realizar login com Google:", error);
    });
});

// Função para validar o formato de email
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Recuperação de senha
const recuperar = document.getElementById("reset");
recuperar.addEventListener("click", async function (event) {
  event.preventDefault();

  let email = prompt("Insira o email cadastrado para a recuperação da senha:");

  if (email == null || email == "") {
    Swal.fire({
      title: "Campo vazio!",
      text: "Por favor, insira um email.",
      icon: "error",
    });
  } else if (!isValidEmail(email)) {
    Swal.fire({
      title: "Formato errado!",
      text: "O valor inserido não está no formato de email.",
      icon: "error",
    });
  } else {
    const db = getFirestore();
    const userRef = collection(db, "users");
    const querySnapshot = await getDocs(userRef);

    let emailFound = false;

    querySnapshot.forEach((doc) => {
      if (doc.data().email === email) {
        emailFound = true;
      }
    });

    if (!emailFound) {
      Swal.fire({
        title: "Email não encontrado!",
        text: "Este email não está cadastrado no sistema.",
        icon: "error",
      });
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Swal.fire({
          title: "Email enviado!",
          text: "Um email de recuperação foi enviado para sua caixa de entrada.",
          icon: "success",
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Erro ao enviar email!",
          text: "Tente novamente mais tarde.",
          icon: "error",
        });
      });
  }
});

// Mensagens temporárias na interface
function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Cadastro de novos usuários
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
  event.preventDefault();

  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = { email, firstName, lastName };

      showMessage('Conta criada com sucesso', 'signUpMessage');

      const db = getFirestore();
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          // Redireciona para a página inicial após criar a conta
          window.location.href = 'index.html'; // Verifique o caminho correto
        })
        .catch((error) => {
          console.error("Erro ao salvar dados do usuário no Firestore:", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        showMessage('Endereço de email já existe', 'signUpMessage');
      } else {
        showMessage('Não foi possível criar usuário', 'signUpMessage');
      }
    });
});

// Login de usuários existentes
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage('Usuário logado com sucesso', 'signInMessage');
      const user = userCredential.user;

      // Salva o ID do usuário logado no localStorage
      localStorage.setItem('loggedInUserId', user.uid);

      // Redireciona para a homepage
      window.location.href = '../homepage.html'; 
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found') {
        showMessage('Email ou senha incorretos', 'signInMessage');
      } else {
        showMessage('Erro ao efetuar login. Verifique o email', 'signInMessage');
      }
    });
});
