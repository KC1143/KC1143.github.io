<template>
  <div>
    <h1 class="maintitle">Course Service Provider</h1>

    <!-- Course/Activities Provider page-->

    <!-- Show / Hide add button-->
    <div v-show="!formmode" v-on:click="formmode = !formmode" class="control">
      <button id="addbutton" class="menubuttons">Add Course</button>
    </div>

    <!-- Form-->
			<div id="loginreg" class="login-wrap">
				<div class="login-register coursediv">    
          <div v-if="formmode" id="hide" class="loginReg-form">
            <!--Div showing the input fields -->
            <div class="coursesList">
              <p id="topicerror" class="warningsign"></p>    
              <div class="group">
                <label for="topic" class="label">Topic</label>        
                <input class="input" v-if="!editmode" type="text" name="topic" id="topic" v-model="topic" placeholder="Class Name" required/>
                <input class="input" v-if="editmode" type="text" name="topic" id="topic" v-model="topic" placeholder="Class Name" disabled/>
              </div>

              <p id="typeerror" class="warningsign"></p>
              <div class="group">
                <label for="role" class="label">Type</label>
                <select id="type" class="input" name="type" v-model="type" required>
                  <option class="roleoption">Course</option>
                  <option class="roleoption">Activity</option>
                </select>
              </div>      

              <p id="tutorerror" class="warningsign"></p>    
              <div class="group">
                <label for="tutor" class="label">Tutor</label>        
                <input class="input" type="text" id="tutor" name="tutor" v-model="tutor" placeholder="Class Lecturer" required/>
              </div>        

              <p id="locationerror" class="warningsign"></p>    
              <div class="group">
                <label for="location" class="label">Location</label>        
                <input class="input" type="text" id="location" name="location" v-model="location" placeholder="Class Location" required/>
              </div>        

              <p id="dayerror" class="warningsign"></p>    
              <div class="group">
                <label for="day" class="label">Day</label>        
                <input class="input" type="text" id="day" name="day" v-model="day" placeholder="Wednesday" required/>
              </div>          

              <p id="timeerror" class="warningsign"></p>    
              <div class="group">
                <label for="time" class="label">Time</label>        
                <input class="input" type="time" id="time" name="time" v-model="time" min="08:00" max="20:00" placeholder="13:00" required/>
              </div>        
              
              <p id="durationerror" class="warningsign"></p>    
              <div class="group">
                <label for="duration" class="label">Duration (hours)</label>        
                <input class="input" type="number" id="duration" name="duration" v-model="duration" min="1" max="5" placeholder="Class Duration (in hours)" required/>
              </div> 

              <p id="priceerror" class="warningsign"></p>    
              <div class="group">
                <label for="price" class="label">Price (€)</label>        
                <input class="input" type="number" id="price" name="price" v-model="price" min="1" placeholder="Class Price in €" required/>
              </div>



              <div class="coursesbuttons">
                <!-- buttons save, cancel and edit toggled depending on the mode set -->
                <button class="addcoursesbutton" type="" v-show="!editmode" @click="addcoursesList">Add</button>
                <button class="addcoursesbutton" type="" v-show="editmode" @click="updatecoursesList">Update</button>
                <button class="addcoursesbutton" type="" v-show="formmode" @click="Cancel">Cancel</button>
              </div>  
            </div>
          </div>
				</div>
			</div>

    <!-- display data in grid-->

    <div v-show="!formmode">
      <b-table
        ref="CAGrid"
        :items="coursesList"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        sort-icon-left
        :fields="fields"
        :filter="this.username"
        :filterIncludedFields="filterActive"
        responsive="sm"
      >
        <template v-slot:cell(actions)="row">
          <!-- buttons per row -->
          <button class="menubuttons" @click="topicratings(row.item, $event.target)">Rating Details</button>
          <button class="menubuttons" @click="getTopictoRemove(row.item.topic)">Remove</button>
          <button class="menubuttons" @click="getTopictoEdit(row.item.topic)">Edit</button>
        </template>
      </b-table>

      <!--Modal window for rating -->
      <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
        <pre>{{ infoModal.content }}</pre>
      </b-modal>

      <div class="sortinginfodiv">
        <div class="sortinginfo"><span class="sortinginfo-bold">Sorting By:</span><span class="sortingcriteria"> {{ sortBy }} </span><span class="sortinginfo-bold"> Sort Direction: </span><span class="sortingcriteria"> {{ sortDesc ? 'Descending' : 'Ascending' }} </span></div>
      </div>
    </div>  
  </div>
</template>

<script>
export default {
  name: "coursesAdmin", //this is the name of the component

  data() {
    return {
      //local storage attributes and array
      coursesList: [],
      topic: "",
      type: "",
      tutor:"",
      location: "",
      day: "",
      time: "",
      duration: "",
      price: "",
      provider: "",

      username: "",

      coursesRatings: [],
      topic_id: "", //topic
      rating: "", // rating
      submission_username: "", //user who submitted rating

      //Form attributes
      errors: [],
      editmode: false,
      formmode: false,
      rec_index: null,
      sortBy: "topic",
      sortDesc: false,
      fields: [
        { key: "topic", sortable: true },
        { key: "type", sortable: true }, 
        { key: "tutor", sortable: true },                 
        { key: "location", sortable: true },
        { key: "day", sortable: true },        
        { key: "duration", sortable: true },
        { key: "time", sortable: true },
       { key: "price", sortable: true },        
        { key: "provider", sortable: true },

        { key: "actions", label: "Actions" }
      ],

      filterActive: [],

      infoModal: {
        id: "info-modal",
        title: "",
        content: ""
      }
    };
  },
  mounted() {
    this.filterActive.push("provider"); //assign specific field to the filTer

    //this module cannot be accessed unless user is authenticated.
    if (this.checkAccess() == false) {
      //redirect to index
      alert("ACESS DENIED!");
      this.$router.push("/");
    }

    //load from locla storage
    if (localStorage.getItem("coursesList")) {
      try {
        this.coursesList = JSON.parse(localStorage.getItem("coursesList")); //local storage
      } catch (e) {
        localStorage.removeItem("coursesList");
      }
    }

    //load from local storage - Ratings
    if (localStorage.getItem("coursesRatings")) {
      try {
        this.coursesRatings = JSON.parse(
          localStorage.getItem("coursesRatings")
        ); //local storage
      } catch (e) {
        localStorage.removeItem("coursesRatings");
      }
    }

    //clear any errors in array
    this.errors = [];
  },

  methods: {
    //Check form inputs - check inputs and test validations
    checkForm: function() {
      this.errors = [];

      //only check topic if not editting.
      //Check if Topic is already in use - don't allow duplicates
      if (this.editmode == false) {
        if (!this.topic) {
          this.errors.push("Topic subject required.");
          document.getElementById("topicerror").innerHTML = "Topic subject required!";       
        } else if (!this.TopicExits(this.topic.toUpperCase().trim())) {
          this.errors.push("Topic subject already registered!");
          document.getElementById("topicerror").innerHTML = "Topic subject already registered!";          
        }	else{
						document.getElementById("topicerror").innerHTML = "";
          }  
      }

      if (!this.type) {
        document.getElementById("typeerror").innerHTML = "Class Type required!";        
        }	else{
          document.getElementById("typeerror").innerHTML = "";
        }

      if (!this.tutor) {
        this.errors.push("Tutor required!");
        document.getElementById("tutorerror").innerHTML = "Tutor required!";        
        }	else{
          document.getElementById("tutorerror").innerHTML = "";
        }
        

      if (!this.location) {
        this.errors.push("Location required!");
        document.getElementById("locationerror").innerHTML = "Location required!";
      }	else{
          document.getElementById("locationerror").innerHTML = "";
        } 


      if (!this.day) {
        this.errors.push("Day of the week required!");
        document.getElementById("dayerror").innerHTML = "Day of the week required!";        
        }	else{
          document.getElementById("dayerror").innerHTML = "";
        }       

      if (!this.duration) {
        this.errors.push("Duration required!");
        document.getElementById("durationerror").innerHTML = "Duration required!";        
      } else if (!this.validDuration(this.duration)) {
        this.errors.push("Duration has to be numeric and between 1 to 5!");
        document.getElementById("durationerror").innerHTML = "Duration has to be numeric and between 1 to 5!";        
        }	else{
          document.getElementById("durationerror").innerHTML = "";
        }
        
      if (!this.time) {
        this.errors.push("Time required!");
        document.getElementById("timeerror").innerHTML = "Time required!";        
        }	else{
          document.getElementById("timeerror").innerHTML = "";
        }

      if (!this.price) {
        this.errors.push("Price required!");
        document.getElementById("priceerror").innerHTML = "Price required!";  
      } else if (!this.validPrice(this.price)) {
        this.errors.push("Price has to be numeric and greater than 0!");
        document.getElementById("priceerror").innerHTML = "Price has to be numeric and greater than 0!";
      }	else{
          document.getElementById("priceerror").innerHTML = "";
        } 
 

      //if there are any error report
      if (this.errors.length > 0) {
        return false;
      } else {
        return true;
      }
    },

    // Duration validation
    validDuration: function(duration) {
      var re = /^[1-5]*$/; // eslint-disable-

      return re.test(duration);
    },

    // price validation
    validPrice: function(price) {
      var re = /^(?=.*[1-9])[0-9]*[.,]?[0-9]{1,2}$/; // eslint-disable-line

      return re.test(price);
    },

    //check if topic is already in use - check for duplicates
    TopicExits: function(topic) {
      var cntr = 0;
      for (cntr = 0; cntr < this.coursesList.length; cntr++) {
        //check Topic
        if (
          topic.toUpperCase().trim() ==
          this.coursesList[cntr].topic.toUpperCase().trim()
        ) {
          //topic already registered
          return false;
        }
      }

      return true;
    },

    //check if user has access to componenet - avoid direct page access from URL unless designated role
    checkAccess() {
      if (localStorage.getItem("authUser")) {
        try {
          this.authUser = JSON.parse(localStorage.getItem("authUser")); //local storage
          if (this.authUser[0].username.length > 0) {
            //check if logged user is provider
            if (this.authUser[0].role == "Service Provider") {
              this.username = this.authUser[0].username; //get username and save it for grid refresh and save
              return true; //allow component to be accessed
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

    //get topic ratings
    topicratings(item, button) {
      this.infoModal.title = "RATINGS";

      var totalcounts = 0;
      var sumratings = 0;
      var avgratings = 0;
      var cntr = 0;
      var topic_index = 0;

      //get topic ID
      topic_index = this.getIDbyTopic(item.topic);

      //get details of ratings for selected topic
      //average + total number of ratings

      for (cntr = 0; cntr < this.coursesRatings.length; cntr++) {
        //loop on items and compute avergae and total count
        if (topic_index == this.coursesRatings[cntr].topic_id) {
          totalcounts = totalcounts + 1; //increment count
          sumratings = sumratings + parseFloat(this.coursesRatings[cntr].rating);
        }
      }

      if (totalcounts == 0) {
        this.infoModal.content = "The "  + item.topic + " " + item.type + " has not yet been Rated.";
      } else {
        avgratings = parseFloat(sumratings) / parseFloat(totalcounts);
        this.infoModal.content = item.topic + " has been rated " + parseFloat(totalcounts) + " time(s) \r\n" + item.topic + " has an average rating of " + parseFloat(avgratings);
      }
      //return
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },

    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },

    //Add Course or Activity record
    addcoursesList() {
      //toggle save/ update button
      this.editmode = false;

      // Validate inputs
      if (this.checkForm() == false) {
        return false;
      }

      // construct array and populate
      this.coursesList.push({
        topic: this.topic.toUpperCase().trim(),
        type: this.type.toUpperCase().trim(),   
        tutor: this.tutor.toUpperCase().trim(),                
        location: this.location.toUpperCase().trim(),
        day: this.day.toUpperCase().trim(),        
        time: this.time,
        duration: this.duration,
        price: this.price,        
        provider: this.username.toUpperCase().trim(),
      });

      //clear values
      this.topic = "";
      this.type = "";
      this.tutor = "";
      this.location = "";
      this.day = "";
      this.time = "";
      this.duration = "";
      this.price = "";      
      this.provider = "";
  

      // save array to store
      this.savecoursesList();
    },

    //save array to local storage
    savecoursesList() {
      localStorage.setItem("coursesList", JSON.stringify(this.coursesList));

      this.formmode = false;
    },

    //read record and get topic at selected row
    //search for the topic in respective array and get its position in array
    //pass the recordindex to editcoursesList
    getTopictoEdit(searchtopic) {
      var cntr = 0;
      for (cntr = 0; cntr < this.coursesList.length; cntr++) {
        //search for Topic
        if (searchtopic.toUpperCase().trim() == this.coursesList[cntr].topic.toUpperCase().trim()) {
          //topic found
          this.editcoursesList(cntr);
        }
      }

      return false;
    },

    //read record and get topic at selected row
    //search for the topic in respective array and get its position in array
    //pass the recordindex to removecoursesList
    getTopictoRemove(searchtopic) {
      var cntr = 0;
      for (cntr = 0; cntr < this.coursesList.length; cntr++) {
        //search for Topic
        if (searchtopic.toUpperCase().trim() == this.coursesList[cntr].topic.toUpperCase().trim()
        ) {
          //topic found
          this.removecoursesList(cntr);
        }
      }

      return false;
    },

    //edit button method
    editcoursesList(x) {
      //toggle save/update button
      this.editmode = true;
      this.formmode = true;

      // store the index of record being modified.
      this.rec_index = x;

      //load values
      this.topic = this.coursesList[x].topic.toUpperCase().trim();
      this.type = this.coursesList[x].type.toUpperCase().trim();
      this.tutor = this.coursesList[x].tutor.toUpperCase().trim();
      this.location = this.coursesList[x].location.toUpperCase().trim();
      this.day = this.coursesList[x].day.toUpperCase().trim();
      this.time = this.coursesList[x].time;
      this.duration = this.coursesList[x].duration;
      this.price = this.coursesList[x].price;      
      this.provider = this.username.toUpperCase().trim();
 
    },

    //remove record when button clocked in table
    removecoursesList(x) {
      this.coursesList.splice(x, 1);
      this.savecoursesList();
    },

    //update record value
    updatecoursesList() {
      // Validate inputs
      if (this.checkForm() == false) {
        return false;
      }

      // update array with values
      this.coursesList[this.rec_index].topic = this.topic.toUpperCase().trim();
      this.coursesList[this.rec_index].type = this.type.toUpperCase().trim();
      this.coursesList[this.rec_index].tutor = this.tutor.toUpperCase().trim();      
      this.coursesList[this.rec_index].location = this.location.toUpperCase().trim();
      this.coursesList[this.rec_index].day = this.day.toUpperCase().trim();      
      this.coursesList[this.rec_index].time = this.time;
      this.coursesList[this.rec_index].duration = this.duration;
      this.coursesList[this.rec_index].price = this.price;      
      this.coursesList[this.rec_index].provider = this.username.toUpperCase().trim();


      //clear values
      this.topic = "";
      this.type = "";
      this.tutor = "";
      this.location = "";
      this.day = "";
      this.time = "";
      this.duration = "";
      this.price = "";      
      this.provider = "";

      //save
      this.savecoursesList();

      //reset screen values - to toggle buttons and div on/off
      this.formmode = false;
      this.editmode = false;
    },

    //read record and get topic at selected row
    //search for the topic in respective array and get its position in array
    getIDbyTopic(searchtopic) {
      var cntr = 0;
      for (cntr = 0; cntr < this.coursesList.length; cntr++) {
        //search for Topic
        if (
          searchtopic.toUpperCase().trim() ==
          this.coursesList[cntr].topic.toUpperCase().trim()
        ) {
          //topic found - use index for rating
          return cntr;
        }
      }
    },

    //Cancel Button click - reset view
    Cancel() {
      this.topic = "";
      this.type = "";
      this.tutor = "";
      this.location = "";
      this.day = "";
      this.time = "";
      this.duration = "";
      this.price = "";      
      this.provider = "";

      this.formmode = false;
      this.editmode = false;

      this.errors = [];
    }
  }
};
</script>