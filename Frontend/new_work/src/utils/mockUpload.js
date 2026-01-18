// Simulate file upload with progress
export const uploadFile = (file, onProgress) => {
  return new Promise((resolve) => {
    const total = 100;
    let uploaded = 0;
    const interval = setInterval(() => {
      uploaded += Math.floor(Math.random() * 20) + 10; // random progress
      if (uploaded >= total) {
        uploaded = total;
        onProgress && onProgress(uploaded);
        clearInterval(interval);
        // Simulate uploaded file response
        resolve({ name: file.name, url: URL.createObjectURL(file) });
      } else {
        onProgress && onProgress(uploaded);
      }
    }, 300 + Math.random() * 400);
  });
};
