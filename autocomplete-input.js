const OPTIONS_LIMIT = 5;

function zipArraysToObject(keys, values) {
  const result = {};
  const length = Math.min(keys.length, values.length);

  for (let i = 0; i < length; i++) {
    result[keys[i]] = values[i];
  }

  return result;
}

/**
 * @param {HTMLInputElement} inp input element from the autocomplete input
 * @param {string[]} validOptions set of valid options for the autocomplete
 * @param {Object} validOptionsMap a js object, that maps the choosen option to another value
 * @param {HTMLInputElement} targetInp input element to set the final value based on the the selected value from the autocomplete input
 * */
function mfgHotelCodeAutocomplete(
  inp,
  validOptions,
  validOptionsMap,
  targetInp
) {
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "mfg-autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);

    /*for each item in the array...*/
    var currentOptions = validOptions.filter((v) =>
      v.toLowerCase().startsWith(val.toLowerCase())
    );
    //   .slice(0, OPTIONS_LIMIT);

    // if there is not options
    if (currentOptions.length === 0) {
      console.log("Empty");
      b = document.createElement("DIV");
      b.innerHTML += "No results found";
      a.appendChild(b);
    }

    for (i = 0; i < currentOptions.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/

      /*create a DIV element for each matching element:*/
      b = document.createElement("DIV");

      b.innerHTML += currentOptions[i];
      /*insert a input field that will hold the current array item's value:*/
      b.innerHTML += "<input type='hidden' value='" + currentOptions[i] + "'>";
      /*execute a function when someone clicks on the item value (DIV element):*/
      b.addEventListener("click", function (e) {
        /*insert the value for the autocomplete text field:*/
        var selectedValue = this.getElementsByTagName("input")[0].value;
        inp.value = selectedValue;
        targetInp.value = validOptionsMap[selectedValue];
        /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
        closeAllLists();
      });
      a.appendChild(b);
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });

  /* Focus out */
  inp.addEventListener("focusout", function (event) {
    var currentValue = event.target.value;
    if (!(currentValue in validOptionsMap)) {
      targetInp.value = "";
      inp.value = "";
    }
  });

  /* Other */

  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "mfg-autocomplete-active":*/
    x[currentFocus].classList.add("mfg-autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("mfg-autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
    var x = document.getElementsByClassName("mfg-autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

const hotelCodes = [
  "ABC123",
  "AEF456",
  "AHI789",
  "AKL234",
  "ANO567",
  "AQR890",
  "ATU345",
  "VWX678",
  "VZA901",
  "VCD234",
];

const hotelNames = [
  "The Grand Oasis",
  "Sunset View Resort",
  "Whispering Pines Inn",
  "Lakeside Retreat",
  "Starlight Hotel & Spa",
  "Mountain Peak Lodge",
  "Coral Reef Suites",
  "Cityscape Towers",
  "Golden Sands Resort",
  "Tranquil Haven Hotel",
];

const hotelMapping = zipArraysToObject(hotelCodes, hotelNames);

var myInputElem = document.getElementById("myCode");
var myTargetInputElem = document.getElementById("derivedName");

mfgHotelCodeAutocomplete(
  myInputElem,
  hotelCodes,
  hotelMapping,
  myTargetInputElem
);
