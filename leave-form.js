document.getElementById('leaveForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('leaveDate', document.getElementById('leaveDate').value);
  formData.append('leaveReason', document.getElementById('leaveReason').value);
  const fileInput = document.getElementById('photoUpload');
  if (fileInput.files.length > 0) {
    formData.append('photoUpload', fileInput.files[0]);
  }

  try {
    const res = await fetch('http://localhost:3000/submit-leave', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert('Error submitting leave application.');
  }
});

