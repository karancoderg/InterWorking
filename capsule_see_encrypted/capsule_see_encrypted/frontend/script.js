uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("✅ Form submitted successfully!");

    const formData = new FormData();
    const fileInput = document.getElementById("fileInput");
    const years = document.getElementById("years")?.value || "0";
    const days = document.getElementById("days")?.value || "0";
    const hours = document.getElementById("hours")?.value || "0";

    if (!fileInput.files.length) {
        alert("❌ Please select at least one file before uploading!");
        return;
    }

    for (let i = 0; i < fileInput.files.length; i++) {
        formData.append("files", fileInput.files[i]);
    }
    formData.append("years", years);
    formData.append("days", days);
    formData.append("hours", hours);

    try {
        const response = await fetch("http://localhost:5001/files/upload", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("File upload failed");
        }

        const data = await response.json();
        console.log("📜 Server Response:", data); // Debugging

        if (data.unlockTime) {
            alert(`✅ Files uploaded successfully! Unlock Time: ${new Date(data.unlockTime).toLocaleString()}`);
        } else {
            alert("⚠️ Upload successful, but unlock time is missing!");
        }

        loadLockedFiles();
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
        console.error(error);
    }
});
