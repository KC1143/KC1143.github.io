<template>
  <div>
    <h1 class="maintitle">Users Service Provider</h1>

    <!-- Users Admin page-->
    <div v-show="!formmode" v-on:click="formmode = !formmode" class="control">
      <button id="addbutton" class="menubuttons">Add User</button>
    </div>
    <!-- Show / Hide add button-->
    <div id="loginreg" class="login-wrap">
      <div class="login-register coursediv"> 
        <div v-if="formmode" id="hide" class="loginReg-form">
          <form class="signup">
              <p id="emailerror" class="warningsign"></p>
              <div class="group">
                <label for="email" class="label">Email Address</label>
                <input v-show="!editmode" id="email" class="input" type="email" name="email" v-model="email" placeholder="email" required/>
              </div>
              
              <p id="usernameerror" class="warningsign"></p>          
              <div class="group">  
                <label for="username" class="label">Username</label>
                <input v-show="!editmode" id="username" class="input" type="text" name="name" v-model="username" placeholder="username" required/>      
              </div>    

              <p id="nameerror" class="warningsign"></p>          
              <div class="group">  
                <label for="name" class="label">Name</label>
                <input v-show="editmode" id="name" class="input" type="text" name="name" v-model="name" placeholder="name" required/>      
              </div>

              <p id="surnameerror" class="warningsign"></p>    
              <div class="group">  
                <label for="surname" class="label">Surname</label>
                <input v-show="editmode" id="surname" class="input" type="text" name="surname" v-model="surname" placeholder="surname" required/>      
              </div>

              <p id="passworderror" class="warningsign"></p>    
              <div class="group">
                <label for="password" class="label">Password</label>
                <input v-show="!editmode" id="password" class="input" type="password" name="password" v-model="password" placeholder="password" required/>      
              </div>      

              <p id="roleerror" class="warningsign"></p>
              <div class="group">
                <label for="role" class="label">Role</label>
                <select id="role" class="input" v-model="role" required>
                  <option class="roleoption">Student/Parent</option>
                  <option class="roleoption">Users Service Provider</option>
                  <option class="roleoption">Courses Service Provider</option>                  
                </select>    
              </div>

              <div class="coursesbuttons">
                <!-- buttons save, cancel and edit toggled depending on the mode set -->
                <button class="addcoursesbutton" type="" v-show="!editmode" @click="addUser">Add</button>
                <button class="addcoursesbutton" type="" v-show="editmode" @click="updateUser">Update</button>
                <button class="addcoursesbutton" type="" v-show="formmode" @click="Cancel">Cancel</button>
              </div>  
          </form>
        </div>  
      </div>

      <div v-show="!formmode">
        <b-table ref="UserGrid" :items="users" :fields="fields" responsive="sm">
          <template v-slot:cell(actions)="row">
            <!-- control buttons per row -->

          <button class="menubuttons" @click="removeUser(row.index)">Remove</button>
          <button class="menubuttons" @click="editUser(row.index)">Edit</button>            
          </template>
        </b-table>
      </div>      
    </div>
  </div>
</template>

<script>
const API_URL_USERS = "http://localhost:5000/users";

export default {
  name: "usersAdmin", //component name
  data() {
    return {
      //local storage attributes and array
      users: [], //array storing users
      email: "",
      password: "",
      username:"",
      name: "",
      surname: "",
      role: "",

      //Form related attributes
      errors: [],

      fields: [
        { key: "username", sortable: false },    
        { key: "email", sortable: false },
        { key: "name", sortable: false },
        { key: "surname", sortable: false },
        { key: "role", sortable: false },

        { key: "actions", label: "Actions" }
      ],

      editmode: false,
      formmode: false,
      rec_index: null
    };
  },
  mounted() {
    this.errors = [];

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

    //this cannot be accessed unless user is authenticated - admin role
    if (this.checkAccess() == false) {
      //redirect to index
      alert("ACESS DENIED!");
      this.$router.push("/");
    }
  },
  methods: {
    //Check form inputs - check inputs and test validations
    checkUserForm: function() {
      this.errors = [];

      //only check password and email if not editting.
      //Check if email is already in use - don't allow duplicates
      if (this.editmode == false) {
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


        //check password and its complexity
        if (!this.password) {
          this.errors.push("You must choose a Password!");
          document.getElementById("passworderror").innerHTML = "Password required!";
        } else if (!this.pwdComplexityCheck(this.password)) {
          this.errors.push("Password must be between 10 to 15 characters with at least: one capital letter; one numeric digit; and a special character.");
          document.getElementById("passworderror").innerHTML = "Password must be between 10 to 15 characters with at least: one capital letter; one numeric digit; and a special character.";
        }	else{
              document.getElementById("passworderror").innerHTML = "";
            } 
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

    //check if user has access to componenet - avoid direct page access from URL unless designated role
    checkAccess() {
      if (localStorage.getItem("authUser")) {
        try {
          this.authUser = JSON.parse(localStorage.getItem("authUser")); //local storage
          if (this.authUser[0].email.length > 0) {
            //Check if authenticated user has a role of admin
            if (this.authUser[0].type == "Users Service Provider") {
              return true;
            }
          }
        } catch (e) {
          localStorage.removeItem("authUser");
        }
        return false;
      } else {
        return false;
      }
    },

    //Add new users
    addUser() {
      // Validate inputs
      if (this.checkUserForm() == false) {
        return false;
      }

      // construct object - assign to array
      this.users.push({
        email: this.email.toLowerCase().trim(),
        password: this.password,        
        username: this.username.toLowerCase().trim(),
        name: this.name,
        surname: this.surname,
        role: this.role
      });

      //clear values
     this.email = "";
      this.password = "";
      this.username = "";
      this.name = "";
      this.surname = "";
      this.role = "";

      this.saveUsers();
    },

    // saveUsers() {
    //   localStorage.setItem("users", JSON.stringify(this.users));
    //   alert("Welcome to the Community");
    //   // console.log("Registration Complete.");
    //   //redirect to index
    //   this.$router.push("login");
    // }     

    //save array to local storage
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
              this.formmode = false;
              this.editmode = false;

            // alert("DATA SAVED SUCCESSFULLY");
            } else {
              alert("DATABASE ERROR!");
            }
          });
        } else {
          alert("DATABASE ERROR!");
        }
      });
    },

    //remove user from array - MM
    removeUser(x) {
      this.users.splice(x, 1);
      this.saveUsers();
    },

    //edit user details according to position in array (x) - MM
    editUser(x) {
      //toggle save/update button
      this.editmode = true;
      this.formmode = true;

      // store the index of record being modified.
      this.rec_index = x;

      //load values
      this.email = this.users[x].email.toLowerCase().trim();
      this.password = this.users[x].password;
      this.username = this.users[x].username.toLowerCase().trim();
      this.name = this.users[x].name.toUpperCase().trim();
      this.surname = this.users[x].surname.toUpperCase().trim();
      this.role = this.users[x].role;

    },

    //upadte user method - MM
    updateUser() {
      // Validate inputs
      if (this.checkUserForm() == false) {
        return false;
      }

      //update array with new values
      this.users[this.rec_index].email = this.email.toLowerCase().trim();
      this.users[this.rec_index].password = this.password;      
      this.users[this.rec_index].username = this.username.toLowerCase().trim();
      this.users[this.rec_index].name = this.name.toUpperCase().trim();
      this.users[this.rec_index].surname = this.surname.toUpperCase().trim();
      this.users[this.rec_index].role = this.role;

      //clear variables
      this.email = "";
      this.password = "";
      this.username = "";
      this.name = "";
      this.surname = "";
      this.role = "";

      //save evrything
      this.saveUsers();

      this.formmode = false;
      this.editmode = false;
    },

    //Cancel button - reset views
    Cancel() {
      this.email = "";
      this.password = "";
      this.username = "";
      this.name = "";
      this.surname = "";
      this.role = "";

      this.formmode = false;
      this.editmode = false;
      this.errors = [];
    }
  }
};
</script>