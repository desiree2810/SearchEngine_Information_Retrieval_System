// Function to fetch search results and display them
function displaySearchResults(searchQuery) {
  // Call the Python function with the search query
  eel.search_documents(searchQuery)(function (data) {
    // Handle the results and display them in a table
    var searchResultsDiv = document.querySelector(".search-results");
    searchResultsDiv.innerHTML = ""; // Clear previous results

    if (data[0].length > 0) {
      var table = document.createElement("table");
      table.classList.add("search-table");

      // Create the table header
      var tableHeader = document.createElement("tr");
      tableHeader.innerHTML = "<th>Document ID</th><th>Relevance Score</th>";
      table.appendChild(tableHeader);

      // Populate the table with search results
      for (var i = 0; i < data[0].length; i++) {
        var row = document.createElement("tr");
        var docIdCell = document.createElement("td");
        docIdCell.textContent = data[0][i];
        var relevanceScoreCell = document.createElement("td");
        relevanceScoreCell.textContent = data[1][data[0][i]];
        row.appendChild(docIdCell);
        row.appendChild(relevanceScoreCell);
        table.appendChild(row);
      }

      searchResultsDiv.appendChild(table);
    } else {
      searchResultsDiv.innerHTML = "<p>No results found.</p>";
    }
  });
}

// Add an event listener for the "WebCrawler" button
var webCrawlerButton = document.querySelector(".btn-webcrawler");
webCrawlerButton.addEventListener("click", function () {
  // Get the search query from the input field
  var searchQuery = document.getElementById("search-input").value;

  // Call the function to fetch and display search results
  displaySearchResults(searchQuery);

  // Set background color of the clicked button to blue
  webCrawlerButton.style.backgroundColor = "#7462ff";
  webCrawlerButton.style.color = "white";

  // Reset background color of other buttons
  var allButtons = document.querySelectorAll(".btn");
  for (var i = 0; i < allButtons.length; i++) {
    if (allButtons[i] !== webCrawlerButton) {
      allButtons[i].style.backgroundColor = "";
      allButtons[i].style.color = "black";
    }
  }
});

// Function to fetch and display Inverted Index results
function displayInvertedIndexResults() {
  // Call the Python function to construct Inverted Index
  eel.construct_inverted_index()(function (invertedIndexData) {
    // Extract the inverted index and index_df from the tuple
    var [invertedIndex, index_df] = invertedIndexData;

    // Assuming the data is provided in the expected format, you can display it
    var searchResultsDiv = document.querySelector(".search-results");
    searchResultsDiv.innerHTML = ""; // Clear previous results

    if (index_df && index_df.data.length > 0) {
      var table = document.createElement("table");
      table.classList.add("search-table", "narrow-table");

      // Create the table header
      var tableHeader = document.createElement("tr");
      tableHeader.innerHTML =
        "<th>Token</th><th>Document Frequency</th><th>Postings</th>";
      table.appendChild(tableHeader);

      // Populate the table with Inverted Index results
      index_df.data.forEach(function (row) {
        var rowData = row; // No need to skip the index column
        var tableRow = document.createElement("tr");
        rowData.forEach(function (cellData) {
          var cell = document.createElement("td");
          cell.textContent = cellData;
          tableRow.appendChild(cell);
        });
        table.appendChild(tableRow);
      });

      searchResultsDiv.appendChild(table);
    } else {
      searchResultsDiv.innerHTML = "<p>No results found.</p>";
    }
  });
}

// Add an event listener for the "Inverted Index" button
var invertedIndexButton = document.querySelector(".btn-inverted-index");
invertedIndexButton.addEventListener("click", function () {
  // Call the function to fetch and display Inverted Index results
  displayInvertedIndexResults();

  // Set background color of the clicked button to blue
  invertedIndexButton.style.backgroundColor = "#7462ff";
  invertedIndexButton.style.color = "white";

  // Reset background color of other buttons
  var allButtons = document.querySelectorAll(".btn");
  for (var i = 0; i < allButtons.length; i++) {
    if (allButtons[i] !== invertedIndexButton) {
      allButtons[i].style.backgroundColor = "";
      allButtons[i].style.color = "black";
    }
  }
});

// Function to fetch and display Bigram Index results
function displayBigramIndexResults() {
  // Call the Python function to construct Bigram Index
  eel.construct_inverted_index()(function (invertedIndexData) {
    // Extract the inverted index from the tuple
    var [invertedIndex, index_df] = invertedIndexData;
    var firstElement = invertedIndexData[0];
    console.log(firstElement);

    eel.construct_bigram_index(firstElement)(function (bigramIndexData) {
      // console.log("heelo");
      // console.log(firstElement);
      console.log(bigramIndexData);
      // Assuming the data is provided in the expected format, you can display it
      var searchResultsDiv = document.querySelector(".search-results");
      searchResultsDiv.innerHTML = ""; // Clear previous results

      if (bigramIndexData && bigramIndexData.length > 0) {
        var table = document.createElement("table");
        table.classList.add("search-table", "narrow-table");

        // Create the table header
        var tableHeader = document.createElement("tr");
        tableHeader.innerHTML = "<th>Bigram</th><th>Tokens</th>";
        table.appendChild(tableHeader);

        // Populate the table with Bigram Index results
        bigramIndexData.forEach(function (row) {
          var tableRow = document.createElement("tr");
          row.forEach(function (cellData) {
            var cell = document.createElement("td");
            cell.textContent = cellData;
            tableRow.appendChild(cell);
          });
          table.appendChild(tableRow);
        });

        searchResultsDiv.appendChild(table);
      } else {
        searchResultsDiv.innerHTML = "<p>No results found.</p>";
      }
    });
  });
}

// Add an event listener for the "Bigram Index" button
var bigramIndexButton = document.querySelector(".btn-bigram-index");
bigramIndexButton.addEventListener("click", function () {
  // Call the function to fetch and display Bigram Index results
  displayBigramIndexResults();

  // Set background color of the clicked button to purple
  bigramIndexButton.style.backgroundColor = "#7462ff";
  bigramIndexButton.style.color = "white";

  // Reset background color of other buttons
  var allButtons = document.querySelectorAll(".btn");
  for (var i = 0; i < allButtons.length; i++) {
    if (allButtons[i] !== bigramIndexButton) {
      allButtons[i].style.backgroundColor = "";
      allButtons[i].style.color = "black";
    }
  }
});



function displaySpellingCorrectionResults(query) {
  eel.construct_inverted_index()(function (invertedIndexData) {
    var [invertedIndex, index_df] = invertedIndexData;

    eel.correct_spelling(
      query,
      Object.keys(invertedIndex)
    )(function (correctionData) {
      // Assuming the data is provided in the expected format, you can display it
      var searchResultsDiv = document.querySelector(".search-results");
      searchResultsDiv.innerHTML = ""; // Clear previous results

      var correctedQuery = correctionData[0];
      var nearestTerms = correctionData[1];

      // Create a table element
      var table = document.createElement("table");
      table.className = "spelling-correction-results";

      // Create table rows for Corrected Query and Nearest Terms
      var row1 = table.insertRow();
      var cell1 = row1.insertCell(0);
      cell1.textContent = "Corrected Query";
      var cell2 = row1.insertCell(1);
      cell2.textContent = "Nearest Terms";

      var row2 = table.insertRow();
      var cell3 = row2.insertCell(0);
      cell3.textContent = correctedQuery;
      var cell4 = row2.insertCell(1);

      // Create an unordered list for nearest terms
      var ul = document.createElement("ul");
      nearestTerms.forEach(function (termDistance) {
        var li = document.createElement("li");
        li.textContent =
          termDistance[0] + " (Edit Distance: " + termDistance[1] + ")";
        ul.appendChild(li);
      });
      cell4.appendChild(ul);

      // Append the table to the search results div
      searchResultsDiv.appendChild(table);
    });
  });
}


// Add an event listener for the "Spelling Correction" button
var correctSpellingButton = document.querySelector(".btn-edit-distance");
correctSpellingButton.addEventListener("click", function () {
  var queryInput = document.getElementById("search-input").value;
  console.log(queryInput);
  displaySpellingCorrectionResults(queryInput);

  correctSpellingButton.style.backgroundColor = "#7462ff";
  correctSpellingButton.style.color = "white";

  var allButtons = document.querySelectorAll(".btn");
  for (var i = 0; i < allButtons.length; i++) {
    if (allButtons[i] !== correctSpellingButton) {
      allButtons[i].style.backgroundColor = "";
      allButtons[i].style.color = "black";
    }
  }
});

// Function to fetch and display Permuterm Index results
function displayPermutermIndexResults() {
  eel.construct_permuterm_index()(function (permutermIndexData) {
    var [permutermIndex, permuterm_list] = permutermIndexData;
    console.log(permutermIndex);
    console.log(permuterm_list);

    var searchResultsDiv = document.querySelector(".search-results");
    searchResultsDiv.innerHTML = ""; // Clear previous results

    if (permuterm_list && permuterm_list.length > 0) {
      var table = document.createElement("table");
      table.classList.add("search-table", "narrow-table");

      // Create the table header
      var tableHeader = document.createElement("tr");
      tableHeader.innerHTML = "<th>Permuterm</th><th>Term</th>";
      table.appendChild(tableHeader);

      // Populate the table with Permuterm Index results
      permuterm_list.forEach(function (row) {
        var tableRow = document.createElement("tr");
        row.forEach(function (cellData) {
          var cell = document.createElement("td");
          cell.textContent = cellData;
          tableRow.appendChild(cell);
        });
        table.appendChild(tableRow);
      });

      searchResultsDiv.appendChild(table);
    } else {
      searchResultsDiv.innerHTML = "<p>No results found.</p>";
    }
  });
}

// Add an event listener for the "Permuterm Index" button
var permutermIndexButton = document.querySelector(".btn-permuterm-index");
permutermIndexButton.addEventListener("click", function () {
  // Call the function to fetch and display Permuterm Index results
  displayPermutermIndexResults();

  // Set background color of the clicked button to green
  permutermIndexButton.style.backgroundColor = "#7462ff";
  permutermIndexButton.style.color = "white";

  // Reset background color of other buttons
  var allButtons = document.querySelectorAll(".btn");
  for (var i = 0; i < allButtons.length; i++) {
    if (allButtons[i] !== permutermIndexButton) {
      allButtons[i].style.backgroundColor = "";
      allButtons[i].style.color = "black";
    }
  }
});


function performWildcardQuery() {
  var wildcardQueryInput = document.getElementById("search-input").value;

  eel.query_permuterm(wildcardQueryInput)(function (wildcardData) {
    eel.search_permuterm(wildcardData)(function (wildcardResult) {
      var searchResultsDiv = document.querySelector(".search-results");
      searchResultsDiv.innerHTML = ""; // Clear previous results

      // Create a paragraph element to display "Permuterm Index"
      var permutermIndexMessage = document.createElement("p");
      permutermIndexMessage.textContent =
        "Permuterm Index: " + wildcardData.slice(0, -1);
      searchResultsDiv.appendChild(permutermIndexMessage);

      // Display "Word not Found" if the result is not an array
      if (!Array.isArray(wildcardResult)) {
        searchResultsDiv.innerHTML += "<p>Word not Found</p>";
      } else {
        searchResultsDiv.innerHTML += "<p>Matching Documents:</p>";
        searchResultsDiv.innerHTML += "<ul>";
        wildcardResult.forEach(function (match) {
          searchResultsDiv.innerHTML +=
            "<li>" + match.term + " is found in " + match.document + "</li>";
        });
        searchResultsDiv.innerHTML += "</ul>";
      }
    });
  });
}

// Add an event listener for the "Wildcard Query" button
var wildcardQueryButton = document.querySelector(".btn-wildcard-query");
wildcardQueryButton.addEventListener("click", function () {
  performWildcardQuery();

  // Set background color of the clicked button to green
  wildcardQueryButton.style.backgroundColor = "#7462ff";
  wildcardQueryButton.style.color = "white";

  // Reset background color of other buttons
  var allButtons = document.querySelectorAll(".btn");
  for (var i = 0; i < allButtons.length; i++) {
    if (allButtons[i] !== wildcardQueryButton) {
      allButtons[i].style.backgroundColor = "";
      allButtons[i].style.color = "black";
    }
  }
});


function performSoundexCorrection() {
  var searchInput = document.getElementById("search-input").value;

  eel.search_soundex_term(searchInput)(function (soundexData) {
    var [soundexCode, matchingWords] = soundexData;
    console.log(soundexCode);
    console.log(matchingWords);
    var searchResultsDiv = document.querySelector(".search-results");
    searchResultsDiv.innerHTML = ""; // Clear previous results

    // Create a table element
    var table = document.createElement("table");
    table.className = "soundex-results";

    // Create table rows for Soundex code and matching words
    var row1 = table.insertRow();
    var cell1 = row1.insertCell(0);
    cell1.textContent = "Soundex Code";
    var cell2 = row1.insertCell(1);
    cell2.textContent = "Matching Words";

    var row2 = table.insertRow();
    var cell3 = row2.insertCell(0);
    cell3.textContent = soundexCode;
    var cell4 = row2.insertCell(1);
    cell4.textContent = matchingWords.length > 0 ? matchingWords.join(", ") : "No matching words found.";

    // Append the table to the search results div
    searchResultsDiv.appendChild(table);
  });
}


// Add an event listener for the "Soundex Correction" button
var soundexCorrectionButton = document.querySelector(".btn-soundex-correction");
soundexCorrectionButton.addEventListener("click", function () {
  // Call the function to fetch and display Inverted Index results
  performSoundexCorrection();

  // Set background color of the clicked button to blue
  soundexCorrectionButton.style.backgroundColor = "#7462ff";
  soundexCorrectionButton.style.color = "white";

  // Reset background color of other buttons
  var allButtons = document.querySelectorAll(".btn");
  for (var i = 0; i < allButtons.length; i++) {
    if (allButtons[i] !== soundexCorrectionButton) {
      allButtons[i].style.backgroundColor = "";
      allButtons[i].style.color = "black";
    }
  }
});



var selectedDocumentNames = []; 
var selectedNamesDiv = document.createElement("div"); 


function displayCosineSimilarityResults() {
  var query = document.getElementById("search-input").value;
  var selectedDocumentNames = []; // To store selected document names
  var selectedNamesDiv = document.createElement("div");
  selectedNamesDiv.style.display = "none"; // Hidden by default

  eel.perform_precision_recall(query)(function (resultsArray) {
    var resultsDiv = document.querySelector(".search-results");
    resultsDiv.innerHTML = ""; // Clear previous results

    for (var i = 0; i < resultsArray.length; i++) {
      var entry = resultsArray[i];
      var rank = entry[0];
      var documentName = entry[1];
      var similarityScore = entry[2];
      var id = "document_" + rank; // Assign a unique ID for the document and checkbox

      var container = document.createElement("div");
      resultsDiv.appendChild(container);

      // Create a checkbox
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      container.appendChild(checkbox);

      // Create a label for the checkbox (to display the document and similarity score)
      var label = document.createElement("label");
      label.htmlFor = id;
      label.textContent =
        "Rank " +
        rank +
        ": " +
        documentName +
        " (Similarity Score: " +
        similarityScore.toFixed(4) +
        ")";
      container.appendChild(label);

      // Use an IIFE (Immediately Invoked Function Expression) to capture the current documentName
      (function (docName) {
        checkbox.addEventListener("change", function () {
          if (this.checked) {
            selectedDocumentNames.push(docName);
          } else {
            var index = selectedDocumentNames.indexOf(docName);
            if (index !== -1) {
              selectedDocumentNames.splice(index, 1); // Remove the name if unchecked
            }
          }
        });
      })(documentName);
    }

    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    resultsDiv.appendChild(submitButton);

    selectedNamesDiv.style.display = "none"; // Hidden by default
    resultsDiv.appendChild(selectedNamesDiv);

    // Add an event listener to the "Submit" button
    submitButton.addEventListener("click", async function () {
      var selectedDocumentsResults =
        "Selected Document Names: " + selectedDocumentNames.join(", ");

      // Display selected document names in the div
      selectedNamesDiv.style.display = "block";
      selectedNamesDiv.innerHTML = selectedDocumentsResults + "<br>";

      // Pass the selected documents as relevant documents to displayResults
      var relevantDocuments = selectedDocumentNames.slice(); // Copy the array
      var displayResultsOutput = await displayResults(query, relevantDocuments);
      selectedNamesDiv.innerHTML += displayResultsOutput;

      var NewButton = document.createElement("button");
      NewButton.textContent = "View New Ranking";
      selectedNamesDiv.appendChild(NewButton);

      NewButton.addEventListener("click", async function () {
        // Clear the search-results div
        var resultsDiv = document.querySelector(".search-results");
        resultsDiv.innerHTML = "";

        // Call the NewRankedCosineSimilarity function and pass the selectedDocumentNames
        NewRankedCosineSimilarity(selectedDocumentNames);
      });
    });
  });
}

var PrecisionButton = document.querySelector(".btn-cosine");
PrecisionButton.addEventListener("click", function () {
  displayCosineSimilarityResults();

  // Set background color of the clicked button to blue
  PrecisionButton.style.backgroundColor = "#7462ff";
  PrecisionButton.style.color = "white";

  // Reset background color of other buttons
  var allButtons = document.querySelectorAll(".btn");
  for (var i = 0; i < allButtons.length; i++) {
    if (allButtons[i] !== PrecisionButton) {
      allButtons[i].style.backgroundColor = "";
      allButtons[i].style.color = "black";
    }
  }
});

function NewRankedCosineSimilarity(selectedDocumentNames) {
  var searchInput = document.getElementById("search-input"); // Get the input element
  searchInput.value = "";

  var query = ""; // Variable to store the query

  // Add an event listener to the search-input field to capture the query
  var searchInput = document.getElementById("search-input");
  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      // Get the query from the input field
      query = searchInput.value;
      // Call the Python function with the query and selectedDocumentNames
      eel.perform_new_cosine(
        query,
        selectedDocumentNames
      )(function (resultsArray) {
        // Handle the results returned from Python
        console.log(resultsArray);
        // Display the results as needed
        var resultsDiv = document.querySelector(".search-results");
        //resultsDiv.innerHTML = ""; // Clear previous results

        var ul = document.createElement("ul");

        for (var i = 0; i < resultsArray.length; i++) {
          var result = resultsArray[i];
          var documentName = result[0];
          var score = result[1].toFixed(4); // Format score with at least 4 digits after the decimal point

          var li = document.createElement("li");
          li.textContent = "Rank"+[i+1]+": "+documentName + ": " + score;
          ul.appendChild(li);
        }

        resultsDiv.appendChild(ul);
      });
    }
  });
}


async function displayResults(query, relevantDocuments) {
  return new Promise(function (resolve) {
    eel.search_and_evaluate(
      query,
      relevantDocuments
    )(function (results) {
      console.log("hello");
      console.log(results);
      console.log("ehdb");
      var allRetrievedDocuments = results[0];
      var relevantDocuments = results[1];
      // var searchResults = results[1]; // Access the third array
      var precision = results[2][1];
      var recall = results[2][2];
      var f_measure = results[2][3];

      var output = "";

      output += "<p>Relevant Documents:</p>";
      output += "<ul>";

      relevantDocuments.forEach(function (document) {
        output += "<li>" + document + "</li>";
      });

      output += "</ul>";

      output += "<p>Precision: " + precision + "</p>";
      output += "<p>Recall: " + recall + "</p>";
      output += "<p>F-measure: " + f_measure + "</p>";

      resolve(output);
    });
  });
}

