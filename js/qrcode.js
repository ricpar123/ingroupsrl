/* global Html5QrcodeScanner */

//Callback function executed on a successful scan
function onScanSuccess(decodedText, decodedResult) {
  console.log(`Scan result: ${decodedText}`, decodedResult);
// Print the result to the UI
  document.getElementById('result').innerText = `Scanned Content: ${decodedText}`;
            
// Optional: Stop scanning after the first success and clear the UI container
  html5QrcodeScanner.clear().catch(error => {
    console.error("Failed to clear scanner.", error);
  });
}

// Optional callback function executed on scan errors (can be verbose)
        function onScanFailure(error) {
            // It is generally safe to ignore these failures as they trigger every frame a code isn't detected
        }

// Configuration options for the scanner UI and engine
  const config = { 
    fps: 10,             // Sets frames per second to process frames
    qrbox: {             // Dimensions for the focused scannable square box
    width: 250, 
    height: 250 
    },
    rememberLastUsedCamera: true // Automatically uses the previously allowed camera
  };

        // Instantiate the end-to-end user interface scanner
        // "reader" points to the ID of the HTML element declared above
        const html5QrcodeScanner = new Html5QrcodeScanner("reader", config, /* verbose= */ false);
        
        // Render and start the camera stream
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);