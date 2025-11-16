const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create uploads folder if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Endpoint to submit leave application
app.post('/submit-leave', upload.single('photoUpload'), (req, res) => {
  const leaveDate = req.body.leaveDate;
  const leaveReason = req.body.leaveReason;
  const filePath = req.file ? req.file.path : null;

  if (!leaveDate || !leaveReason) {
    return res.status(400).json({ message: 'Leave date and reason are required.' });
  }

  const newLeave = {
    leaveDate,
    leaveReason,
    filePath,
    submittedAt: new Date()
  };

  // Read existing leave applications
  let leaves = [];
  const fileName = 'leaves.json';
  if (fs.existsSync(fileName)) {
    leaves = JSON.parse(fs.readFileSync(fileName));
  }

  // Add new leave
  leaves.push(newLeave);
  fs.writeFileSync(fileName, JSON.stringify(leaves, null, 2));

  res.json({ message: 'Leave application submitted successfully!', leave: newLeave });
});

// Serve uploaded files (optional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
