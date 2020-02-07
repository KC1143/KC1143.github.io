<template>
  <div class="contactdiv">
    <h1 class="maintitle">Contact Us</h1>
    <p class="maintext"><span class="bold">Email:</span> {{email}}</p>
    <p class="maintext"><span class="bold">Website:</span> {{website}}</p>
  </div>
</template>

<script>
export default {
  name: "contact",  //component name
  data() {
    return {
      email: "familylearning@mail.com",
      website: "www.familylearning.edu"
    };
  }
};
</script>