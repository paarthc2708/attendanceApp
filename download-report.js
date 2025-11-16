document.getElementById("exportPDF").addEventListener("click", generatePDF);

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // ---- Extract Text Data ----
    const name = document.getElementById("StudentName")?.innerText || "";
    const id = document.getElementById("StudentID")?.innerText || "";
    const course = document.getElementById("StudentCourse")?.innerText || "";
    const email = document.getElementById("StudentEmail")?.innerText || "";
    const overview = document.getElementById("Overview")?.innerText || "";

    // ---- Extract Image (ProfileImage) ----
    const imgElement = document.getElementById("ProfileImage");
    let imgData = null;

    if (imgElement) {
        imgData = await convertImageToBase64(imgElement.src);
    }

    // ---- PDF TITLE ----
    doc.setFontSize(18);
    doc.text("Student Report", 14, 20);

    // ---- Add Profile Image ----
    if (imgData) {
        doc.addImage(imgData, "JPEG", 150, 10, 40, 40);  // x, y, width, height
    }

    // ---- Add Student Info ----
    doc.setFontSize(12);
    doc.text(name, 14, 40);
    doc.text(id, 14, 48);
    doc.text(course, 14, 56);
    doc.text(email, 14, 64);

    // ---- Overview Section ----
    doc.setFontSize(14);
    doc.text("Overview", 14, 80);

    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(overview, 180), 14, 88);

    // ---- Add Attendance Table ----
    doc.autoTable({
        html: "#attendanceTable",
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 115,
        theme: "striped",
        headStyles: { fillColor: [46, 118, 250] }
    });

    doc.save("Student_Report.pdf");
}

// ========== Helper: Convert Image URL to Base64 ==========
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
