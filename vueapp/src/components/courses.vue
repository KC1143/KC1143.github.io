<template>
  <div>
    <h1 class="maintitle">Courses and Activities</h1>

    <!-- Class Activities -->
    <!-- display data in grid-->
				<!-- <p v-if="!topic.length" class="info">There are <span class="bold warning caps">No Courses</span> at this time</p>      -->
    <p id="noresults" class="info"></p>  
    <b-form-group label="Filter" label-cols-sm="6" label-align-sm="right" label-size="sm" label-for="filterInput" class="categorytext">
      <b-input-group size="sm">
        <b-form-input v-model="filter" type="search" id="filterInput" placeholder="Type to Search"></b-form-input>
        <b-input-group-append>
          <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>

    <b-form-group label="Filter Categories" label-cols-sm="6" label-align-sm="right" label-size="sm" description="Select none to filter on all categories" class="categorytext">
      <b-form-checkbox-group v-model="filterActive" class="mt-1">
        <b-form-checkbox class="categorytext" value="topic">Topic</b-form-checkbox>
        <b-form-checkbox class="categorytext" value="type">Type</b-form-checkbox>        
        <b-form-checkbox class="categorytext" value="tutor">Tutor</b-form-checkbox> 
        <b-form-checkbox class="categorytext" value="location">Location</b-form-checkbox>
        <b-form-checkbox class="categorytext" value="day">Day</b-form-checkbox> 
        <b-form-checkbox class="categorytext" value="duration">Duration</b-form-checkbox>
        <b-form-checkbox class="categorytext" value="time">Time</b-form-checkbox>
        <b-form-checkbox class="categorytext" value="price">Price</b-form-checkbox>        
        <b-form-checkbox class="categorytext" value="provider">Provider</b-form-checkbox>
 
      </b-form-checkbox-group>
    </b-form-group>

    <b-table 
      ref="CAGrid"
      :items="coursesList"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      sort-icon-left
      :filter="filter"
      :filterIncludedFields="filterActive"
      responsive="sm"
    >
      <template v-slot:cell(actions)="row">
        <button class="menubuttons" @click="topicratings(row.item, $event.target)">Rating Details</button>
        <button class="menubuttons" @click="row.toggleDetails">{{ row.detailsShowing ? 'Hide' : '' }} Rate Course</button>
      </template>

      <template v-slot:row-details="row">
        <b-card>
          <span class="bold">Rate {{row.item.topic}}</span>
          <br />
          <p class="sidenote"><span class="sidenote-bold">Where:</span> 1 is Bad; 2 is Mediocre; 3 is Impartial; 4 is Good; 5 is Superb</p>
          <label for="userrating" class="label ratinglabel">Rating:</label>          
          <select id="userrating" name="userrating" v-model="userrating">
            <option class="roleoption">1</option>
            <option class="roleoption">2</option>
            <option class="roleoption">3</option>
            <option class="roleoption">4</option>
            <option class="roleoption">5</option>
          </select>

          <button id="submitbutton" class="menubuttons" @click="submitTopicRating(row.item.topic, userrating)">Submit</button>
        </b-card>
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
</template>

<script>
const API_URL_COURSES = "http://localhost:4000/courses";
const API_URL_RATINGS = "http://localhost:4000/ratings";

export default {
  name: "courses", //component name

  data() {
    return {
      //local storage attributes and array
      tempCoursesRatings: [],
      coursesList: [],
      topic: "",
      type: "",
      tutor: "",
      location: "",
      day: "",
      time: "",
      duration: "",
      price: "",      
      provider: "",

      coursesListRatings: [],
      topic_id: "", //topic
      rating: "", // rating
      submission_username: "", //user who submitted rating

      //Form attributes
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
      filter: null,
      filterActive: [],
      infoModal: {
      id: "info-modal",
      title: "",
      content: ""
      },
      userrating: "5" //default rating when loaded
    };
  },
  mounted() {

    if (this.checkAccess() == false) {
      //redirect to index
      alert("ACCESS DENIED!");
      this.$router.push("/");
    }
        
    //this module cannot be accessed unless user is authenticated.

    // //load from local storage - coursesList
    // if (localStorage.getItem("coursesList")) {
    //   try {
    //     this.coursesList = JSON.parse(localStorage.getItem("coursesList")); //local storage
    //   } catch (e) {
    //     localStorage.removeItem("coursesList");
    //   }
    // }

    //load coursesList from mongoDB and populate the courses array
    try {
      fetch(API_URL_COURSES)
        .then(response => response.json())
        .then(result => {
          this.coursesList = result;
        });
    } catch (e) {
      this.errors.push("ERROR! Data could not be fetched from the database");
    }

    // //load from local storage - coursesListRatings
    // if (localStorage.getItem("coursesListRatings")) {
    //   try {
    //     this.coursesListRatings = JSON.parse(localStorage.getItem("coursesListRatings")); //local storage
    //   } catch (e) {
    //     localStorage.removeItem("coursesListRatings");
    //   }
    // }

    //load coursesListRatings from mongoDB and populate the ratings array
    try {
      fetch(API_URL_RATINGS)
        .then(response => response.json())
        .then(result => {
          this.coursesListRatings = result;
        });
    } catch (e) {
      this.errors.push("ERROR! Data could not be fetched from the database");
    }

  },

  methods: {
    //check if user has access to componenet - avoid direct page access from URL unless designated role
    checkAccess() {
      if (localStorage.getItem("authUser")) {
        try {
          this.authUser = JSON.parse(localStorage.getItem("authUser")); //local storage
          if (this.authUser[0].username.length > 0) {
            //check if logged user is Admin
            if (this.authUser[0].role == "Student/Parent") {
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

      for (cntr = 0; cntr < this.coursesListRatings.length; cntr++) {
        //loop on items and compute avergae and total count
        if (topic_index == this.coursesListRatings[cntr].topic_id) {
          totalcounts = totalcounts + 1; //increment count
          sumratings = sumratings + parseFloat(this.coursesListRatings[cntr].rating);
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

     //submit rating
    submitTopicRating(topic, topic_rating) {
      //check if user has already submitted rating
      var cntrratings = 0;
      var Ratingnewentry = true;
      var topic_index = "";
      topic_index = this.getIDbyTopic(topic);

      //copy coursesListRatings to tempCoursesRatings
      this.tempCoursesRatings = this.coursesListRatings;
      cntrratings = this.tempCoursesRatings.length;

      if (cntrratings > 0) {
        var cntr = 0;

        for (cntr = 0; cntr < cntrratings; cntr++) {
          //check if username and record index exist
          if (
            this.authUser[0].username.toLowerCase().trim() ==
              this.tempCoursesRatings[cntr].username.toLowerCase().trim() &&
            topic_index == this.tempCoursesRatings[cntr].topic_id
          ) {
            //user has submitted rating
            alert("You have already Rated this Course.");
            cntr = 9999999; //exit the loop

            Ratingnewentry = false;
          }
        }

        if (Ratingnewentry == true) {
          //submit rating
          this.tempCoursesRatings.push({
            topic_id: topic_index,
            rating: topic_rating,
            username: this.authUser[0].username.toLowerCase().trim()
          });
        }
      } else {
        //submit rating since there is no rating in the ratings store
        //this is the first submission in the rating store
        this.tempCoursesRatings.push({
          topic_id: topic_index,
          rating: topic_rating,
          username: this.authUser[0].username.toLowerCase().trim()
        });

        Ratingnewentry = true;
      }

    //   if (Ratingnewentry == true) {
    //     //commit to local storage
    //     localStorage.setItem(
    //       "coursesRatings",
    //       JSON.stringify(this.tempCoursesRatings)
    //     );
        
    //     alert("Thank You for your feedback.");

    //     //clear values
    //     this.topic_id = "";
    //     this.rating = "";
    //     this.username = "";
    //     this.tempCoursesRatings = [];
    //   }
    // },

      if (Ratingnewentry == true) {
        //delete all
        fetch(API_URL_RATINGS, {
          method: "DELETE",
          body: JSON.stringify(this.tempCoursesRatings),
          headers: {
            "content-type": "application/json"
          }
        }).then(response => {
          //re-submit data to mongoDB
          if (response.status == 200) {
            fetch(API_URL_RATINGS, {
              method: "POST",
              body: JSON.stringify(this.tempCoursesRatings),
              headers: {
                "content-type": "application/json"
              }
            }).then(response => {
              if (response.status == 200) {
                alert("Thank You for your feedback.");

                //clear values
                this.topic_id = "";
                this.rating = "";
                this.username = "";

                //save values from TMP array to array
                this.coursesListRatings = this.tempCoursesRatings;

                this.tempCoursesRatings = [];
              } else {
                alert("DATABASE ERROR!");
              }
            });
          } else {
            alert("DATABASE ERROR!");
          }
        });
      }
    },

    //read record and get topic at selected row
    //search for the topic in respective array and get its array position
    getIDbyTopic(searchtopic) {
      var cntr = 0;
      for (cntr = 0; cntr < this.coursesList.length; cntr++) {
        //search for Topic
        if (searchtopic.toUpperCase().trim() == this.coursesList[cntr].topic.toUpperCase().trim()) {
          //topic found - use index for rating
          return cntr;
        }else if(cntr == 0){
          document.getElementById("noresults").innerHTML = '"There are" <span class="bold warning caps">No Courses</span> at this time"';
        }
      }
    }
  }
};
</script>