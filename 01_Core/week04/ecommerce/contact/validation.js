// I don't know exactly how form submissions work, so I don't know if I actually need to create this object of all of the values. I probably don't. So assuming I don't, the validateFields() function is what I would call on the submit button click.


function Submission(firstname, lastname, email, phone, contact_pref, hear_about_us, comments) {
	this.firstname = firstname;
	this.lastname = lastname,
	this.email = email;
	this.phone = phone;
	this.contact_pref = contact_pref;
	this.hear_about_us = hear_about_us
	this.comments = comments;
}

let validatedText, unvalidatedText, radioNames, checkboxNames;

validatedText = ["firstname", "email"];
unvalidatedText = ["lastname", "phone", "comments"]
radioNames = ["contact_pref"];
checkboxNames = ["hear_about_us"];



// FUNCTIONS TO GET VALUES

// To get values of the text input fields that require validation (firstname, email)
function getValidatedText(id) {
	id_value = document.getElementById(id).value;
	if (id_value === "") {
		return id.toUpperCase();
	}
		else {
			return id_value;
		}
};

// To get values of the text input fields that don't require validation (lastname, phone, comments)
function getUnvalidatedText(id) {
	let id_value;
	id_value = document.getElementById(id).value;
	return id_value
}

// Getting the value checked for the contact preference.
function getRadioSelection(name) {
	let all_opt, radio_select
	all_opt = Array.from(document.getElementsByName(name));
	// Checking to see if "checked" is true, if so return the value of that radio button since you can only select one. 
	for (let i = 0; i < all_opt.length; i++) {
		if (all_opt[i].checked) {
			radio_select = all_opt[i].value;
			return radio_select;
		} 
	}
	if (radio_select = -1) {
		return name.toUpperCase();
	} else {
		return radio_select;
	}

	};

// Add all checked values to an array.

function getCheckboxValues(name) {
	let cb_array, cb_values
	cb_values = []
	cb_array = Array.from(document.getElementsByName(name))

	for (let i = 0; i < cb_array.length; i++) {
		if (cb_array[i].checked) {
			cb_values.push(cb_array[i].value)
		} 
	}
	return cb_values
};

// END OF FUNCTIONS TO GET VALUES


function validateFields() {
	let missingFields, curValue;
	missingFields = [];

// for the text values
	for (var i = 0; i < validatedText.length; i++) {
		curValue = getValidatedText(validatedText[i]);
		if (curValue === validatedText[i].toUpperCase()) {
			missingFields.push(curValue)
		}
	};

// for the radio values
	for (var i = 0; i < radioNames.length; i++) {
		curValue = getRadioSelection(radioNames[i]);
		if (curValue === radioNames[i].toUpperCase()) {
			missingFields.push(curValue)
		}

	};
// If there are no missing fields, return true so that we can create an object of the form submission.
	if (missingFields.length === 0){
		return true
	} else { // If not, alert and indicate the missing fields and return false so that the submission fails. 
		alert("Please fill out the missing required fields: " + missingFields.toString());
		return false
	}
};

function createSubmission() {
	let firstname, lastname, email, phone, contact_pref, hear_about_us, comments, newSubmission;
// If the validation returns true, 
	if (validateFields()) {
		firstname = getUnvalidatedText("firstname");
		lastname = getUnvalidatedText("lastname");
		email = getUnvalidatedText("email");
		phone = getUnvalidatedText("phone")
		comments = getUnvalidatedText("comments")
		contact_pref = getRadioSelection("contact_pref");
		hear_about_us = getCheckboxValues("hear_about_us");

		newSubmission = new Submission(firstname, lastname, email, phone, contact_pref, hear_about_us, comments);
		submit()
	} else {
		return false;
	}
};
