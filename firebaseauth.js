// Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBJ66e6JLuYm1ZWWerP94OdyBe5CFpMzkQ",
        authDomain: "loginpw2-aae26.firebaseapp.com",
        projectId: "loginpw2-aae26",
        storageBucket: "loginpw2-aae26.firebasestorage.app",
        messagingSenderId: "376191388905",
        appId: "1:376191388905:web:7b560a4d4c1dbbeea7b478"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const provider = new GoogleAuthProvider();

// Função genérica para exibir mensagens temporárias
function showMessage(title, text, icon) {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
  });
}

// Função para validar formato de e-mail
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Autenticação com Google
document.getElementById("google001").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result.user);
      window.location.href = "../homepage.html";
    })
    .catch((error) => {
      console.error("Erro ao autenticar com Google:", error.message);
      showMessage("Erro", "Não foi possível fazer login com o Google.", "error");
    });
});

// Recuperação de senha
document.getElementById("reset").addEventListener("click", (event) => {
  event.preventDefault();
  const email = prompt("Insira o email cadastrado para a recuperação da senha:");

  if (!email || email.trim() === "") {
    showMessage("Erro", "Campo de e-mail vazio. Por favor, insira um e-mail.", "error");
  } else if (!isValidEmail(email)) {
    showMessage("Erro", "Os caracteres inserido não está no formato de e-mail.", "error");
  } else {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        showMessage(
          "Sucesso",
          "Se o e-mail estiver cadastrado, um link de redefinição foi enviado.",
          "success"
        );
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          showMessage("Erro", "E-mail não encontrado no sistema.", "error");
        } else {
          showMessage("Erro", `Erro ao enviar o e-mail: ${error.message}`, "error");
        }
      });
  }
});

// Cadastro de novo usuário
document.getElementById("submitSignUp").addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const firstName = document.getElementById("fName").value;
  const lastName = document.getElementById("lName").value;

  if (!isValidEmail(email)) {
    showMessage("Erro", "Formato de e-mail inválido.", "error");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return setDoc(doc(db, "users", user.uid), { email, firstName, lastName });
    })
    .then(() => {
      showMessage("Sucesso", "Conta criada com sucesso!", "success");
      window.location.href = "index.html";
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        showMessage("Erro", "Este e-mail já está em uso.", "error");
      } else {
        showMessage("Erro", "Erro ao criar conta: " + error.message, "error");
      }
    });
});

// Login de usuário existente
document.getElementById("submitSignIn").addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem("loggedInUserId", user.uid);
      showMessage("Sucesso", "Login realizado com sucesso!", "success");
      window.location.href = "homepage.html";
    })
    .catch((error) => {
      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        showMessage("Erro", "E-mail ou senha incorretos.", "error");
      } else {
        showMessage("Erro", "Erro ao fazer login: " + error.message, "error");
      }
    });
});

document.getElementById("reset").addEventListener("click", (event) => {
  event.preventDefault();
  
  const email = prompt("Insira o email cadastrado para a recuperação da senha:");

  if (!email || email.trim() === "") {
    Swal.fire({
      title: "Campo vazio!",
      text: "Por favor, insira um e-mail válido.",
      icon: "error",
    });
    return;
  }

  if (!isValidEmail(email)) {
    Swal.fire({
      title: "Formato inválido!",
      text: "O valor inserido não está no formato de e-mail.",
      icon: "error",
    });
    return;
  }

  // Verifica se o e-mail está cadastrado
  fetchSignInMethodsForEmail(auth, email)
    .then((signInMethods) => {
      if (signInMethods.length === 0) {
        Swal.fire({
          title: "E-mail não encontrado!",
          text: "Este e-mail não está cadastrado no sistema.",
          icon: "error",
        });
        return;
      }

      // Envia o e-mail de redefinição de senha
      return sendPasswordResetEmail(auth, email);
    })
    .then(() => {
      Swal.fire({
        title: "E-mail enviado!",
        text: "Se o e-mail estiver correto, um link de redefinição foi enviado para sua caixa de entrada.",
        icon: "success",
      });
    })
    .catch((error) => {
      console.error("Erro ao verificar ou enviar o e-mail:", error);
      Swal.fire({
        title: "Erro!",
        text: "Ocorreu um problema ao tentar enviar o e-mail. Tente novamente.",
        icon: "error",
      });
    });
});

// Função para validar e-mails
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
