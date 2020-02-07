<template>
  <div id="login">
    <div id="loginreg" class="login-wrap">
        <div class="loginReg-form">
          <form class="signin">
            <p id="credentialserror" class="warningsign"></p>          
              <div class="group">  
              <label for="email" class="label">Email</label>
                <input id="email" class="input" type="email" name="email" v-model="input.username" placeholder="john1" required/>      
              </div>

              <div class="group">
                <label for="password" class="label">Password</label>
                <input id="password" class="input" type="password" name="password" v-model="input.password" placeholder=" ******** " required/>      
              </div>  
            <div class="group">
              <input id="check" type="checkbox" class="check" checked>
              <label class="check-label" for="check"><span class="icon"></span> Keep me Signed in</label>								
            </div>
            <div class="group">
              <button type="button" title="Already registered?" v-on:click="login()">Sign In</button>								
            </div>
            <div class="linebreak"></div>

            <div class="bottom-text">
              <a href="">Forgot Password?</a>
            </div>

            <div class="linebreak"></div>
				
          </form>
        </div>  
      </div>
      <div>      
        <a class="menubuttons" type="button" title="Sign Up" href="#/register">Not a Member? Join Now!</a>                          
      </div>        
    </div>    
</template>

<script>

const API_URL_USERS = "http://localhost:5000/users";

export default {
  name: "login", //component name
  data() {
    return {
      input: {  //input fields
        email: "",
        password: ""
      },
      users: [], //users array 
      authUser: [],//authenticated user array
      email: "",
      username: "",
      name: "",
      surname: "",
      role: ""
    };
  },
mounted() {

      // //load users from local storage
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
        alert("DATABASE CONNECTION ERROR!");
      }

  },

  methods: {
    //reset auth user in local storage according to logged user
    setAuthUser() {
      //clear local storage
      localStorage.removeItem("authUser");

      //save auth user in storage
      localStorage.setItem("authUser", JSON.stringify(this.authUser));
    },

    //Check if its a Valid User - correct email login and passsword
    checkUser: function() {
      var userEmail = this.input.email.toLowerCase().trim(); //username input
      var userPassword = this.input.password; //password input

      //load users from local store
      if (localStorage.getItem("users")) {
        try {
          this.users = JSON.parse(localStorage.getItem("users")); //local storage
        } catch (e) {
          localStorage.removeItem("users");
        }
      }

      var cntr = 0;
      for (cntr = 0; cntr < this.users.length; cntr++) {
        //check username at login
        if (userEmail.toLowerCase().trim() == this.users[cntr].email.toLowerCase().trim()) {
          //if found check whether password matches
          if (userPassword == this.users[cntr].password) {
            //OK- match

            //set session - push new entry to auth user array
            this.authUser.push({
              email: this.users[cntr].email.toLowerCase().trim(),
              username: this.users[cntr].username.toLowerCase().trim(),
              name: this.users[cntr].name.toUpperCase().trim(),
              surname: this.users[cntr].surname.toUpperCase().trim(),
              role: this.users[cntr].role
            });
            return true;
          }
        }
      }

      return false;
    },

    //login method - return back to vue.app with true if user authentication is OK
    login() {
      if (this.input.email.toLowerCase().trim() != "" && this.input.password != "") {
        //loop on users and verify login and pwd
        if (this.checkUser() == true) {
          //user exists
          this.setAuthUser(); //set auth session

          this.$emit("authenticated", true);
        } else {
          // alert("The Username and/or Password is incorrect!");
          document.getElementById("credentialserror").innerHTML = "The Email and/or Password is incorrect!";          
        }
      } else {
        // alert("The Username and Password are required!");
        document.getElementById("credentialserror").innerHTML = "The Email and Password are required!";                
      }
    }
  }
};
</script>