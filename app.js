const jobs = [];

document.getElementById("add-job").addEventListener("click", () => {
  const jobName = document.getElementById("job-name").value.trim();
  const burstTime = parseInt(document.getElementById("burst-time").value, 10);
  const arrivalTime = parseInt(document.getElementById("arrival-time").value, 10);

  if (!jobName || isNaN(burstTime) || burstTime <= 0 || isNaN(arrivalTime) || arrivalTime < 0) {
    alert("Vui lòng nhập thông tin công việc hợp lệ!");
    return;
  }

  jobs.push({ name: jobName, burstTime, arrivalTime });
  updateJobsList();
  document.getElementById("job-name").value = "";
  document.getElementById("burst-time").value = "";
  document.getElementById("arrival-time").value = "";
});

document.getElementById("calculate-sjf").addEventListener("click", () => {
  if (jobs.length === 0) {
    alert("Danh sách công việc trống!");
    return;
  }

  const sortedJobs = [...jobs].sort((a, b) => a.arrivalTime - b.arrivalTime || a.burstTime - b.burstTime);

  let currentTime = 0;
  const results = [];
  const ganttChart = [];
  let totalWaitTime = 0;

  while (sortedJobs.length > 0) {
    const availableJobs = sortedJobs.filter(job => job.arrivalTime <= currentTime);

    if (availableJobs.length === 0) {
      currentTime = sortedJobs[0].arrivalTime;
      continue;
    }

    const nextJob = availableJobs.sort((a, b) => a.burstTime - b.burstTime)[0];
    const index = sortedJobs.indexOf(nextJob);

    results.push(`${nextJob.name} (Thời gian thực hiện: ${nextJob.burstTime}, Bắt đầu: ${currentTime}, Kết thúc: ${currentTime + nextJob.burstTime})`);
    ganttChart.push({ name: nextJob.name, start: currentTime, end: currentTime + nextJob.burstTime });

    totalWaitTime += currentTime - nextJob.arrivalTime;
    currentTime += nextJob.burstTime;

    sortedJobs.splice(index, 1);
  }

  const avgWaitTime = (totalWaitTime / jobs.length).toFixed(2);

  document.getElementById("output").innerHTML = `
        <p><strong>Thứ tự thực hiện:</strong></p>
        <ul>${results.map(r => `<li>${r}</li>`).join("")}</ul>
        <p><strong>Thời gian chờ trung bình:</strong> ${avgWaitTime}</p>
      `;

  drawGanttChart(ganttChart);
});

function updateJobsList() {
  const jobsList = document.getElementById("jobs-list");
  jobsList.innerHTML = jobs
    .map(job => `<tr><td>${job.name}</td><td>${job.burstTime}</td><td>${job.arrivalTime}</td></tr>`)
    .join("");
}

function drawGanttChart(chartData) {
  const ganttChartDiv = document.getElementById("gantt-chart");
  ganttChartDiv.innerHTML = "";

  chartData.forEach(block => {
    const div = document.createElement("div");
    div.className = "process-block";
    div.style.width = `${(block.end - block.start) * 20}px`;
    div.textContent = `${block.name} (${block.start}-${block.end})`;
    ganttChartDiv.appendChild(div);
  });
}