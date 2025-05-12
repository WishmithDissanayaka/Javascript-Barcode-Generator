function generateBarcode(value) {
    // Take the input value from the text field
    const input = document.getElementById("barcodeInput").value;
    // Generate the barcode using JsBarcode
    JsBarcode("#barcode", input, {
        format: "code128",
        displayValue: true
    });
}

function clearForm() {
  // Clear the input field
  document.getElementById("barcodeInput").value = "";
  // Clear the barcode SVG content
  document.getElementById("barcode").innerHTML = "";
}

function generatePDF() {
    // Generate the barcode so the latest one is included in the PDF
    generateBarcode();
    // Get the SVG element that holds the generated barcode
    const svg = document.getElementById("barcode");
    // A new jsPDF document instance
    const doc = new jspdf.jsPDF();
    // Convert the SVG element into a string format using XMLSerializer
    const svgData = new XMLSerializer().serializeToString(svg);
    // Create an off-screen canvas to draw the barcode image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");// Drawing context is taken as 2D
    // Create an image element to load the barcode SVG
    const img = new Image();

    // Once the image is loaded, draw it onto the canvas
    img.onload = function() {
        // Set canvas size to match the loaded image
        canvas.width = img.width;
        canvas.height = img.height;
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);
        // Convert the canvas content to a PNG image data URL
        const imgData = canvas.toDataURL("image/png", 1.0);
        // Add the image to the PDF (x=10, y=10, scaled down)
        doc.addImage(imgData, 'PNG', 10, 10, img.width / 4, img.height / 4);
        // Save the generated PDF as "barcode.pdf"
        doc.save("barcode.pdf");
    };
    // Set the source of the image to the encoded SVG string
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
}


