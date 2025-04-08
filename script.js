let names = []; // This will store the names from the uploaded file
let spinning = false;
let reel = document.getElementById("reel");
let interval;
let stopRequested = false;
let spinTimeout;

// Function to start spinning
function startSpin() {
  if (spinning) return;
  spinning = true;
  stopRequested = false;
  reel.innerHTML = '';  // Clear previous names
  
  // Start spinning by adding new names to the reel
  spinStep();
}

// Function to make the names spin and scroll upwards
function spinStep() {
  if (!spinning) return;

  const name = names[Math.floor(Math.random() * names.length)];
  const el = document.createElement("div");
  el.classList.add("slot-name");
  el.innerText = name;
  reel.appendChild(el);

  let shift = reel.children.length * 60;
  reel.style.transition = "none";  // Remove transition for smooth scroll
  reel.style.transform = "translateY(" + (-shift) + "px)"; // Moves names upward

  // Ensure only a certain number of names are displayed
  if (reel.children.length > 20) {
    reel.removeChild(reel.firstChild); // Clean up old names
  }

  // Fade in the names with transition
  setTimeout(() => {
    el.style.opacity = 1;
  }, 10);

  if (!stopRequested) {
    spinTimeout = setTimeout(spinStep, 100); // Continue spinning
  }
}

// Function to stop the spin and display the final name
function stopSpin() {
  if (!spinning) return;
  stopRequested = true;

  // Ensure smooth transition to stop
  reel.style.transition = "transform 0.5s ease-in-out";  // Smooth transition to stop
  let shift = reel.children.length * 60;
  reel.style.transform = "translateY(" + (-shift) + "px)"; // Stop scrolling

  // After a brief delay, stop spinning and show the final name
  setTimeout(() => {
    spinning = false;
    const final = names[Math.floor(Math.random() * names.length)];
    reel.innerHTML = '<div class="slot-name">🎉 ' + final + ' 🎉</div>'; // Display final name
  }, 500);
}

// Handle file upload (CSV or Excel)
function handleFileUpload(event) {
  const file = event.target.files[0];
  
  if (file) {
    if (file.name.endsWith(".csv")) {
      // Parse CSV
      Papa.parse(file, {
        complete: function(results) {
          names = extractNamesFromCSV(results.data);
        }
      });
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      // Parse Excel
      let reader = new FileReader();
      reader.onload = function(e) {
        let data = e.target.result;
        let workbook = XLSX.read(data, {type: 'binary'});
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        let json = XLSX.utils.sheet_to_json(sheet);
        names = extractNamesFromCSV(json);
      };
      reader.readAsBinaryString(file);
    }
  }
}

// Extract names from CSV or Excel data (assuming 'Names' column)
function extractNamesFromCSV(data) {
  let namesColumn = [];
  data.forEach(row => {
    if (row['Names']) {
      namesColumn.push(row['Names'].trim());
    }
  });
  return namesColumn;
}
