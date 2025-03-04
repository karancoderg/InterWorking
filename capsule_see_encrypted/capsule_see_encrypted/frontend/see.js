document.addEventListener("DOMContentLoaded", async () => {
    const capsuleTable = document.getElementById("capsuleTable");
    const capsuleTableContainer = document.getElementById("capsuleTableContainer");

    async function loadCapsules() {
        try {
            const response = await fetch("http://localhost:5001/files/user");
            if (!response.ok) throw new Error("Failed to load files");

            const files = await response.json();

            if (files.length === 0) {
                capsuleTableContainer.style.display = "none"; // ✅ Hide table if no files
                return;
            }

            capsuleTableContainer.style.display = "block"; // ✅ Show table if files exist
            capsuleTable.innerHTML = ""; // ✅ Clear previous data

            files.forEach(file => {
                const row = document.createElement("tr");

                const nameCell = document.createElement("td");
                nameCell.textContent = file.name;

                const createdAtCell = document.createElement("td");
                createdAtCell.textContent = new Date(file.createdAt).toLocaleString();

                const unlockTimeCell = document.createElement("td");
                unlockTimeCell.textContent = new Date(file.unlockTime).toLocaleString();

                const timerCell = document.createElement("td");
                timerCell.setAttribute("data-unlock-time", file.unlockTime);

                row.appendChild(nameCell);
                row.appendChild(createdAtCell);
                row.appendChild(unlockTimeCell);
                row.appendChild(timerCell);

                capsuleTable.appendChild(row);
            });

            updateTimers();
            setInterval(updateTimers, 1000);
        } catch (error) {
            console.error("❌ Error loading capsules:", error);
        }
    }

    function updateTimers() {
        document.querySelectorAll("td[data-unlock-time]").forEach(timerCell => {
            const unlockTime = new Date(timerCell.getAttribute("data-unlock-time"));
            const now = new Date();
            const timeRemaining = unlockTime - now;

            if (timeRemaining <= 0) {
                timerCell.textContent = "✅ Unlocked!";
            } else {
                const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
                timerCell.textContent = `${hours}h ${minutes}m ${seconds}s`;
            }
        });
    }

    loadCapsules();
});
