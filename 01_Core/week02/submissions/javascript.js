
// VERY HARD: Given a comma separated string of full names, use JavaScript to create an alphabetical-by-Last-Name, ordered list and have it display in an HTML page on your site. Make the last names bold and red using CSS (NOT inline styles).

let names = "Benny Grullon, Bobby Craig, Cassidy Rase, Dillon Gorden, Jessica Maldonado, Grant Johnson"

let names_array = names.split(", ")


// This is a custom split function to parse out the last names and order by the last names rather than the default first name.
function compare (a,b) {
 
  //split the names as strings into arrays
  var aName = a.split(" ");
  var bName = b.split(" ");
 
  // get the last names by selecting the last element in the name arrays
  var aLastName = aName[aName.length - 1];
  var bLastName = bName[bName.length - 1];
 
  // compare the names and return either
  // a negative number, positive number
  // or zero.
  if (aLastName < bLastName) return -1;
  if (aLastName > bLastName) return 1;
  return 0;
}

// Running the compare function to get the last name sorted list.
names_array.sort(compare);

// Creating an array out of the sorted names array that will create a string with all of the <li> elements.
// In order to make the last names red and bold, I split up the names into an array of first and last names and then for the last name, edited the element to be a string including the span tag that will assign the CSS last_name class. 
function html_gen (array) {
	let html_array = [];


		for(let i = 0; i < names_array.length; i++){
		let split_name = array[i].split(" ");
		let last_name = "<span class='last_name'>" + split_name[split_name.length-1] + "</span>"


		html_array.push("<li>" + split_name[0] + " " + last_name + "</li>")

		}
		// This is joining the newly created array with all of the names into a string.
		let li_string = html_array.join("")

		return li_string

};


// Creating the full HTML string that will make the ordered list

function addHTML() {
	let html = "<ol>" + html_gen(names_array) + "</ol>";
	return html
}

// Adding to the page once the document is loaded, otherwise it won't recognize the h1 as existing.

window.addEventListener('DOMContentLoaded', (event) => {

	document.querySelector("h1").insertAdjacentHTML("afterend", addHTML())})