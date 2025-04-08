let names = []; // This will store the names from the uploaded file
let spinning = false;
let reel = document.getElementById("reel");
let interval;
let stopRequested = false;

function startSpin() {
  if (spinning) return;
  spinning = true;
  stopRequested = false;
  reel.innerHTML = '';  // Clear previous names
  spinStep();
}

function spinStep() {
  if (!spinning) return;

  const name = names[Math.floor(Math.random() * names.length)];
  const el = document.createElement("div");
  el.innerText = name;
  reel.appendChild(el);

  let shift = reel.children.length * 60;
  reel.style.transition = "none";  // Remove transition for smooth scroll
  reel.style.transform = "translateY(-" + shift + "px)";

  if (reel.children.length > 20) {
    reel.removeChild(reel.firstChild); // Clean up old names
  }

  if (!stopRequested) {
    interval = setTimeout(spinStep, 100);
  } else {
    // Stop after a brief delay and display final name
    setTimeout(() => {
      spinning = false;
      const final = names[Math.floor(Math.random() * names.length)];
      reel.innerHTML = '<div style="color: black; font-size: 30px; font-weight: bold;">🎉 ' + final + ' 🎉</div>';
    }, 300);
  }
}

function stopSpin() {
  if (!spinning) return;
  stopRequested = true;
  reel.style.transition = "transform 0.2s ease-in-out";  // Smooth transition to stop
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
