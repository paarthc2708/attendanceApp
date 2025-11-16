document.getElementById("exportPDF").addEventListener("click", generatePDF);

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // === EXTRACT DATA FROM HTML ===
    const name = document.getElementById("StudentName")?.innerText || "";
    const id = document.getElementById("StudentID")?.innerText || "";
    const course = document.getElementById("StudentCourse")?.innerText || "";
    const email = document.getElementById("StudentEmail")?.innerText || "";
    const overview = document.getElementById("Overview")?.innerText || "";

    const imgElement = document.getElementById("ProfileImage");
    let imgData = null;

    if (imgElement) {
        imgData = await convertImageToBase64(imgElement.src);
    }

    // === TITLE ===
    doc.setFontSize(18);
    doc.text("Student Report", 14, 20);

    // === ADD PROFILE IMAGE ===
    if (imgData) {
        doc.addImage(imgData, "JPEG", 150, 10, 40, 40);
    }

    // === ADD STUDENT DETAILS ===
    doc.setFontSize(12);
    let y = 40;

    doc.text(name, 14, y); y += 8;
    doc.text(id, 14, y); y += 8;
    doc.text(course, 14, y); y += 8;
    doc.text(email, 14, y); y += 12;

    // === OVERVIEW SECTION ===
    doc.setFontSize(14);
    doc.text("Overview", 14, y);
    y += 8;

    doc.setFontSize(12);
    const wrapped = doc.splitTextToSize(overview, 180);
    doc.text(wrapped, 14, y);
    y += wrapped.length * 6 + 10;

    // === ADD HTML TABLE EXACTLY AS IT IS ===
    doc.autoTable({
        html: "#AttendanceTable",  // YOUR HTML TABLE
        startY: y,
        theme: "striped",
        headStyles: { fillColor: [46, 118, 250] }
    });

    // Save PDF
    doc.save("Student_Report.pdf");
}

// HELPER: Convert image from <img> to Base64
function convertImageToBase64(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;

        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/jpeg"));
        };

        img.onerror = function () {
            resolve(null);
        };
    });
}
