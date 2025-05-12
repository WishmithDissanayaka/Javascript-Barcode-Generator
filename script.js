function generateBarcode() {
    // Get input text
    const input = document.getElementById("barcodeInput").value; 
    // Get the container for barcodes
    const container = document.getElementById("barcodeContainer"); 

    // Clear existing barcodes
    container.innerHTML = ""; 

    // Split by comma, trim spaces, remove empties
    const values = input.split(",").map(v => v.trim()).filter(v => v); 

    values.forEach((val) => {
        // Create a new SVG element
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");  
        // Add it to the container
        container.appendChild(svg); 

        JsBarcode(svg, val, {
            format: "code128",      
            displayValue: true      
        });
    });
}

function clearForm() {
    // Clear the input box
    document.getElementById("barcodeInput").value = ""; 
    // Clear all generated barcodes
    document.getElementById("barcodeContainer").innerHTML = ""; 
}

function generatePDF() {
    // Select all SVGs inside the container
    const svgs = document.querySelectorAll("#barcodeContainer svg"); 
    // Create a new PDF document
    const doc = new jspdf.jsPDF(); 
    // Temporary canvas for rendering images
    const canvas = document.createElement("canvas"); 
    // Get 2D drawing context
    const ctx = canvas.getContext("2d"); 

    // Initial vertical position in PDF
    let y = 10; 
    let index = 0; 

    const processNext = () => {
        if (index >= svgs.length) {
            // Save PDF after all barcodes are added
            doc.save("barcodes.pdf"); 
            return;
        }

        // Get the current SVG
        const svg = svgs[index]; 
        // Convert SVG to XML string
        const svgData = new XMLSerializer().serializeToString(svg); 
        // Create image to load SVG
        const img = new Image(); 

        img.onload = () => {
            // Match canvas size to image
            canvas.width = img.width; 
            canvas.height = img.height;
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw SVG as image on canvas 
            ctx.drawImage(img, 0, 0); 

            // Convert canvas to PNG data URL
            const imgData = canvas.toDataURL("image/png"); 
            // Add to PDF
            doc.addImage(imgData, "PNG", 10, y, img.width / 4, img.height / 4); 
            // Move down for next barcode
            y += img.height / 4 + 10; 
            index++;
            // Continue with next SVG
            processNext(); 
        };

        // Load SVG into image
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData); 
    };

    // Start processing
    processNext(); 
}