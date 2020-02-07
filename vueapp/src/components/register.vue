<template>
  <div>
    <div id="register">
      <div id="loginreg" class="login-wrap">      
        <div class="loginReg-form">
          <form class="signup">
              <p id="emailerror" class="warningsign"></p>
              <div class="group">
                <label for="email" class="label">Email Address</label>
                <input id="email" class="input" type="email" name="email" v-model="email" placeholder="email" required/>
              </div>
              
              <p id="usernameerror" class="warningsign"></p>          
              <div class="group">  
                <label for="username" class="label">Username</label>
                <input id="username" class="input" type="text" name="name" v-model="username" placeholder="username" required/>      
              </div>    

              <p id="nameerror" class="warningsign"></p>          
              <div class="group">  
                <label for="name" class="label">Name</label>
                <input id="name" class="input" type="text" name="name" v-model="name" placeholder="name" required/>      
              </div>

              <p id="surnameerror" class="warningsign"></p>    
              <div class="group">  
                <label for="surname" class="label">Surname</label>
                <input id="surname" class="input" type="text" name="surname" v-model="surname" placeholder="surname" required/>      
              </div>

              <p id="passworderror" class="warningsign"></p>    
              <div class="group">
                <label for="password" class="label">Password</label>
                <input id="password" class="input" type="password" name="password" v-model="password" placeholder="password" required/>      
              </div>      

              <p id="roleerror" class="warningsign"></p>
              <div class="group">
                <label for="role" class="label">Role</label>
                <select id="role" class="input" v-model="role" required>
                  <option class="roleoption">Student/Parent</option>
                  <option class="roleoption">Service Provider</option>
                </select>    
              </div>

            <div class="group">
              <button title="Join the Community" type="button" v-on:click="addUser()">Sign Up</button>
            </div>
          </form>
        </div>  
      </div>
    </div>    
      <div>      
        <a class="menubuttons" type="button" title="Sign In" href="#/login">Already a Member?</a>                          
      </div>          
  </div>
</template>

<script>
const API_URL_USERS = "http://localhost:4000/users";

export default {
  name: "register", //component name

  //data structure
  data() {
    return {
      users: [], //array storing users
      email: "",
      password: "",
      username:"",
      name: "",
      surname: "",
      role: "",

      errors: []
    };
  },

  mounted() {
    // //load array from local storage
    // if (localStorage.getItem("users")) {
    //   try {
    //     this.users = JSON.parse(localStorage.getItem("users")); //local storage
    //   } catch (e) {
    //     localStorage.removeItem("users");
    //   }
    // }

    //load users from mongoDB and populate the users array
    try {
      fetch(API_URL_USERS)
        .then(response => response.json())
        .then(result => {
          this.users = result;
        });
    } catch (e) {
      this.errors.push("ERROR! Data could not be fetched from the database");
    }
  },

  methods: {
 checkRegForm: function() {
      this.errors = [];
      
      if(!this.email){
        this.errors.push("Email required!");								
        document.getElementById("emailerror").innerHTML = "Email required!";											
      } else if(!this.validEmail(this.email.toLowerCase().trim())){
        this.errors.push("Valid email required!");								
        document.getElementById("emailerror").innerHTML = "Valid Email required!";					
      } else if (!this.emailExists(this.email.toLowerCase().trim())){
        this.errors.push("Email already registered!");							
        document.getElementById("emailerror").innerHTML = "Email already registered!";	
  
      } else{
        document.getElementById("emailerror").innerHTML = "";
      }

      if(!this.username){
        this.errors.push("Username required!");								
        document.getElementById("usernameerror").innerHTML = "Username required!";											
      } else if(!this.usernameCheck(this.username.toLowerCase().trim())){
        this.errors.push("Username must be between 3 to 6 characters with no special characters");								
        document.getElementById("usernameerror").innerHTML = "Username must be between 3 to 6 characters with no special characters";					
      } else if (!this.usernameExists(this.username.toLowerCase().trim())){
        this.errors.push("Username already registered!");							
        document.getElementById("usernameerror").innerHTML = "Username already registered!";	
  
      } else{
        document.getElementById("usernameerror").innerHTML = "";
      }      


      //check password complexity
      if (!this.password) {
        this.errors.push("You must choose a Password!");
        document.getElementById("passworderror").innerHTML = "Password required!";
      } else if (!this.pwdComplexityCheck(this.password)) {
        this.errors.push("Password must be between 10 to 15 characters with at least: one capital letter; one numeric digit; and a special character.");
        document.getElementById("passworderror").innerHTML = "Password must be between 10 to 15 characters with at least: one capital letter; one numeric digit; and a special character.";
      }	else{
						document.getElementById("passworderror").innerHTML = "";
          }  


      if (!this.name) {
        this.errors.push("Please enter a Name!");
				document.getElementById("nameerror").innerHTML = "Name required!";        
      }else{
        document.getElementById("nameerror").innerHTML = "";
      }
      

      if (!this.surname) {
        this.errors.push("Please enter a Surname!");
				document.getElementById("surnameerror").innerHTML = "Surname required!";        
      }else{
        document.getElementById("surnameerror").innerHTML = "";
      }


      if(!this.role){
        this.errors.push("Please choose a Role for the user");						
        document.getElementById("roleerror").innerHTML = "Role required!";								
      }else{
        document.getElementById("roleerror").innerHTML = "";
      }	

      //if there are any error report
      if (this.errors.length > 0) {
        return false;
      } else {
        return true;
      }
    },

    //email validation
    validEmail: function(email) {
      //regex
      var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/; // eslint-disable-line
      
      return regex.test(email);
    },

    //check if email is in use - dont allow duplicates
    emailExists: function(email) {
      var cntr = 0;
      for (cntr = 0; cntr < this.users.length; cntr++) {
        //check user email as login
        if (email.toLowerCase().trim() == this.users[cntr].email.toLowerCase().trim()) {
          //email already registered
          return false;
        }
      }

      return true;
    },

    usernameExists: function(username) {
      var cntr = 0;
      for (cntr = 0; cntr < this.users.length; cntr++) {
        //check username as login
        if (username.toLowerCase().trim() == this.users[cntr].username.toLowerCase().trim()) {
          //username already registered
          return false;
        }
      }

      return true;
    },

    //check username parameters
    //[3 to 6 characters with no special characters]
    usernameCheck(username) {
      //regex
      var regex = /^[a-zA-Z0-9]{3,6}$/; // eslint-disable-line
      return regex.test(username);
    },    

    //check password complexity
    //[10 to 15 characters which at least 1: capital letter; numeric digit; special character]
    pwdComplexityCheck(password) {
      //regex
      var regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&.-|])[a-zA-Z0-9!@#$%^&*.-|]{10,15}$/; // eslint-disable-line
      return regex.test(password);
    },

    //add user - add new registration
    addUser() {
      // Validate inputs
      if (this.checkRegForm() == false) {
        return false;
      }

      // construct object and add user to array
      this.users.push({
        email: this.email.toLowerCase().trim(),
        password: this.password,        
        username: this.username.toLowerCase().trim(),
        name: this.name,
        surname: this.surname,
        role: this.role
      });

      //clear attributes
      this.email = "";
      this.password = "";
      this.username = "";
      this.name = "";
      this.surname = "";
      this.role = "";

      this.errors = [];

      this.saveUsers();
    },

    // saveUsers() {
    //   localStorage.setItem("users", JSON.stringify(this.users));
    //   alert("Welcome to the Community");
    //   // console.log("Registration Complete.");
    //   //redirect to index
    //   this.$router.push("login");
    // } 

    saveUsers() {
      //delete all
      fetch(API_URL_USERS, {
        method: "DELETE",
        body: JSON.stringify(this.users),
        headers: {
          "content-type": "application/json"
        }
      }).then(response => {
        //re-submit data to mongoDB
        if (response.status == 200) {
          fetch(API_URL_USERS, {
            method: "POST",
            body: JSON.stringify(this.users),
            headers: {
              "content-type": "application/json"
            }
          }).then(response => {
            if (response.status == 200) {
                //redirect to login
                alert("Welcome to the Community");
                this.$router.push("login");
            } else {
              alert("DATABASE ERROR!");
            }
          });
        } else {
          alert("DATABASE ERROR!");
        }
      });
    }
  }
};
</script>