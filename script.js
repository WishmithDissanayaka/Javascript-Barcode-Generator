function generateBarcode() {
    // Get the user input value from the text field
    const input = document.getElementById("barcodeInput").value;

    // Get the the barcode container
    const container = document.getElementById("barcodeContainer");

    // Clear any displayed barcodes
    container.innerHTML = "";

    // Split the input by commas, trim and remove any empty strings
    const values = input.split(",").map(v => v.trim()).filter(v => v);

    values.forEach(val => {
        // Create an <img> element to display the barcode as an image (Switched to img due to jspdf not supporting inline svg directly.).
        const img = document.createElement("img");

        // Generate the barcode using JsBarcode and apply it to the <img>
        JsBarcode(img, val, {
            format: "code128",       
            displayValue: true,      // Show text value below barcode
            width: 2,                // Width of each bar
            height: 40               // Height of barcode
        });

        // Add generated barcode image to the display container
        container.appendChild(img);
    });
}

function clearForm() {
    // Clear the input field where the user types barcode values
    document.getElementById("barcodeInput").value = ""; 

    // Clear the container that displays the barcode previews
    document.getElementById("barcodeContainer").innerHTML = ""; 
}

function generatePDF() {
    // Select all barcode <img> elements from the display container
    const imgs = document.querySelectorAll("#barcodeContainer img");

    // Create new jsPDF document with custom dimensions: 80mm wide by 120mm tall(40*2 and 20*6) for the label roll
    const doc = new jspdf.jsPDF({ unit: "mm", format: [80, 120] });

    // Set the size for each label
    const labelWidth = 40;  // 40mm wide
    const labelHeight = 20; // 20mm tall

    // Define the number of columns and rows per page
    const columns = 2;
    const rows = 6;

    // Maximum number of barcode labels per page
    const labelsPerPage = columns * rows;

    // Track the current column and row for placing barcodes
    let col = 0;
    let row = 0;
    let labelCount = 0;

    imgs.forEach(img => {
        // Repeat each barcode 6 times
        for (let i = 0; i < 6; i++) {
            // If current page is full, start new page
            if (labelCount === labelsPerPage) {
                doc.addPage([80, 120]); // Add a new page of the same size
                labelCount = 0;
                col = 0;
                row = 0;
            }

            // Calculate the x and y position for placing the barcode
            const x = col * labelWidth;
            const y = row * labelHeight;

            // Add the barcode image to the PDF at the calculated position
            doc.addImage(img, "PNG", x, y, labelWidth, labelHeight);

            // Move to the next column
            col++;

            // If all columns are filled, move to the next row
            if (col >= columns) {
                col = 0;
                row++;
            }

            // Increase the number of labels added to the current page
            labelCount++;
        }
    });

    // Save and download the generated PDF as "barcodes.pdf"
    doc.save("barcodes.pdf");
}
