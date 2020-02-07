<template>



  <div id="app">
    <router-link to="/" class="logorouter">
      <!-- <img src="./assets/logo.png" /> -->
				<div id="logoDiv"> <!-- Site Logo/Name -->
					<h1><a class="logo" href="/" title="">Family Learning</a></h1>
				</div>     
    </router-link>

    <nav class="appnav">
      <!--Navigation Menus load according to logged user role-->
      <!--Admin Menus-->
      <span v-if="role === 'Admin'">
        <router-link class="menubuttons" v-for="routes in Adminlinks" v-bind:key="routes.id" :to="`${routes.page}`">{{routes.text}}</router-link>
      </span>

      <!--Parent and Student Menus-->
      <span v-if="role === 'Student/Parent'">
        <router-link class="menubuttons" v-for="routes in PSlinks" v-bind:key="routes.id" :to="`${routes.page}`">{{routes.text}}</router-link>
      </span>

      <!--Provider-->
      <span v-if="role === 'Service Provider'">
        <router-link class="menubuttons" v-for="routes in Providerlinks" v-bind:title="routes.text" v-bind:key="routes.id" :to="`${routes.page}`">{{routes.text}}</router-link>
      </span>

      <!--Other links-->
      <router-link class="menubuttons" v-for="routes in OtherLinks"  v-bind:title="routes.text" v-bind:key="routes.id" :to="`${routes.page}`">{{routes.text}}</router-link>
    </nav>

    <!--Profile Div showing logged in user-->
    <div class="profile">
      <div v-if="authenticated">
        <img class="usericon" v-bind:title="this.name + ' ' +this.surname" alt="User" src="./assets/images/user-icon.png" />
        <p id="userusername" class="userdetails"> {{this.username}} </p>
        <p id="userrole" class="userdetails"> {{this.role}} </p>
      </div>
      <!-- Logout menu options -->
      <router-link class="menubuttons" v-if="authenticated" to="/" v-on:click.native="logout()" title="Sign Out" replace>Sign Out</router-link>

      <router-link
        class="menubuttons"
        v-on:click.native="viewprofile()"
        to="/"
        v-if="authenticated"
      >Profile</router-link>

      <!-- Sign in menu options -->
      <router-link class="menubuttons" v-if="!authenticated" to="/login" title="Sign In or Sign Up">Sign In | Sign Up</router-link>
    </div>

    <br />

    <router-view @authenticated="setAuthenticated" />
  </div>
</template>


<script>
export default {
  name: "App",

  data() {
    return {
      authenticated: false,

      authUser: [], //array for storing logged in user details
      email: "",
      username: "",
      name: "",
      surname: "",
      role: "",

      //menu links array definitions
      Adminlinks: [
        {
          id: 0,
          text: "User Maintenance",
          page: "/UserAdmin"
        },
        {
          id: 1,
          text: "Class Activity Maintenance",
          page: "/ClassActivityAdmin"
        }
      ],

      PSlinks: [
        {
          id: 0,
          text: "Courses and Activities",
          page: "/courses"
        }
      ],

      Providerlinks: [
        {
          id: 0,
          text: "Courses Maintenance",
          page: "/coursesAdmin"
        }
      ],
      OtherLinks: [
        {
          id: 1,
          text: "Home",
          page: "/home"
        },        
        {
          id: 2,
          text: "About",
          page: "/about"
        },
        {
          id: 3,
          text: "Contact",
          page: "/contact"
        },
      ]
    };
  },

  mounted() {
      
    this.refreshSession();

  },

  methods: {
    //refresh session details according to logged in user
    refreshSession() {
      if (localStorage.getItem("authUser")) {
        try {
          this.authUser = JSON.parse(localStorage.getItem("authUser")); //local storage

          if (this.authUser[0].username.length > 0) {
            //this means user is authenticated - session exists
            this.name = this.authUser[0].name;
            this.surname = this.authUser[0].surname;
            this.username = this.authUser[0].username;            
            this.email = this.authUser[0].email;
            this.role = this.authUser[0].role;
            this.authenticated = true;

          }
        } catch (e) {
          localStorage.removeItem("authUser");
        }
      }
    },

    viewprofile() {
      alert("COMING SOON!");
    },

    //Set Authentication status with details of logged user
    setAuthenticated(status) {
      this.refreshSession();

      this.name = this.authUser[0].name;
      this.surname = this.authUser[0].surname;
      this.username = this.authUser[0].username;
      this.email = this.authUser[0].email;
      this.role = this.authUser[0].role;

      this.authenticated = status;

      this.$router.push("/");

      //alert("logged in");
    },

    //log out of session - clear array and localstorage
    logout() {
      //remove local storage
      localStorage.removeItem("authUser");

      //clear values
      this.email = "";
      this.username = "";
      this.name = "";
      this.surname = "";
      this.role = "";

      this.authenticated = false;
      this.refreshSession();

      // this.$router.push("/");

      // alert("logged out");
    }
  }
};
</script>
  <!-- CSS file -->
  <style rel="stylesheet" src="../src/css/style.css"></style>