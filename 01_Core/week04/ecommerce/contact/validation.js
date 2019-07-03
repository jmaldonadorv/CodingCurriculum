


function Submission(firstname, lastname, email, phone, contact_pref, hear_about_us, comments) {
	this.firstname = firstname;
	this.lastname = lastname,
	this.email = email;
	this.phone = phone;
	this.contact_pref = contact_pref;
	this.hear_about_us = hear_about_us
	this.comments = comments;
}

// check for null
document.getElementById("firstname").value;
document.getElementById("lastname").value;
// check for null
document.getElementById("email").value;
document.getElementById("phone").value;

// need to see if either of them is checked, if not, alert. if so, contact_pref value will equal the one that's checked. can count number of trues in the array?
document.getElementsByName("contact_pref")

//need to see if any of them are checked (count number of trues in array?), if at least 1 is checked then add to array of hear_about_us.
document.getElementsByName("hear_about_us")
document.getElementById("comments").value;


// collect all of the IDs & check for null
// if any of the required ones are blank, alert on all of them and return false. Maybe I can add the names of the fields into an array to alert on anything missing?
// if not, create an object with all of these and return that and true.