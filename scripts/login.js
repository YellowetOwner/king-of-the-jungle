function login() {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const bodyData = {
      username: username,
      password: password
    };
    if(username.length >= 4 && password.length >= 4){
    fetch("/api/auth/login", {
      body: JSON.stringify(bodyData),
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if(data.success){
        window.location.replace("/stats")
      }else{
          alert(`Login not successful: ${data.error}`)
      }
    })
    .catch(error => console.error('Error:', error));
  }else{
    alert("Username or password are too short")
  }
  }
  
  document.querySelector("#username").addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){
      login()
    }
  })
  document.querySelector("#password").addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){
      login()
    }
  })
  
  document.addEventListener("DOMContentLoaded",async()=>{
    const r = await fetch("/api/stats/user", {
      credentials: 'include'
    });
    const a = await r.json();
    if (a.success) {
      window.location.replace("/stats")
    }
  })
