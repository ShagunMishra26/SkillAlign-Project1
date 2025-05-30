// Map each career to relevant skills/questions
const skillQuestions = {
  python_developer: [
    "How many Python projects have you completed?",
    "Are you familiar with frameworks like Django or Flask?",
    "Do you have experience with data analysis or scripting in Python?"
  ],
  frontend_developer: [
    "How comfortable are you with HTML, CSS, and JavaScript?",
    "Have you used frameworks like React, Angular, or Vue?",
    "Do you have experience with responsive and accessible design?"
  ],
  backend_developer: [
    "Which backend languages do you know (Node.js, Java, Python, etc.)?",
    "Are you familiar with REST APIs and databases?",
    "Have you worked with authentication and security in backend?"
  ],
  full_stack_developer: [
    "Are you comfortable with both frontend and backend technologies?",
    "Have you built full-stack applications?",
    "Do you have experience with deployment and DevOps?"
  ],
  data_analyst: [
    "How proficient are you with Excel, SQL, or BI tools?",
    "Have you created dashboards or reports?",
    "Do you know data visualization libraries (Tableau, PowerBI, matplotlib)?"
  ],
  data_scientist: [
    "Do you have experience with machine learning or statistical modeling?",
    "Are you familiar with Python libraries like pandas, scikit-learn, or TensorFlow?",
    "Have you worked on real-world data science projects?"
  ],
  app_developer: [
    "Do you develop for Android, iOS, or both?",
    "Are you familiar with frameworks like Flutter or React Native?",
    "Have you published any apps to app stores?"
  ],
  cyber_security: [
    "Do you have knowledge of network security and ethical hacking?",
    "Are you familiar with security tools and best practices?",
    "Have you completed any cybersecurity certifications?"
  ],
  ai_specialist: [
    "Have you built or trained AI models?",
    "Are you familiar with neural networks and deep learning?",
    "Do you have experience with AI frameworks (TensorFlow, PyTorch)?"
  ],
  machine_learning: [
    "Do you understand supervised and unsupervised learning?",
    "Have you implemented ML algorithms from scratch or using libraries?",
    "Do you have experience with model evaluation and tuning?"
  ]
};

let statusChart;
function drawStatusBar(level) {
  // Remove old canvas if present
  const chartContainer = document.getElementById('chartContainer');
  chartContainer.innerHTML = '<canvas id="statusChart" width="320" height="220"></canvas>';
  const ctx = document.getElementById('statusChart').getContext('2d');
  if (statusChart) statusChart.destroy();

  // Map levels to values and colors
  const levelMap = {
    'Excellent':   { value: 4, color: '#a78bfa', label: 'Excellent' },
    'Good':        { value: 3, color: '#f472b6', label: 'Good' },
    'Average':     { value: 2, color: '#38bdf8', label: 'Average' },
    'Beginner':    { value: 1, color: '#34d399', label: 'Beginner' }
  };
  const chartData = levelMap[level] || levelMap['Beginner'];

  statusChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [chartData.label],
      datasets: [{
        label: 'Status Level',
        data: [chartData.value],
        backgroundColor: [chartData.color],
        borderColor: [chartData.color],
        borderWidth: 2,
        borderRadius: 12,
        maxBarThickness: 80
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          min: 0,
          max: 4,
          ticks: {
            stepSize: 1,
            color: '#6366f1',
            font: { size: 16 }
          },
          grid: { display: false }
        },
        y: {
          ticks: {
            color: '#6366f1',
            font: { size: 18 }
          },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      animation: {
        duration: 1200,
        easing: 'easeOutBounce'
      }
    }
  });
}

document.getElementById('careerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const career = document.getElementById('career').value;
  const resultDiv = document.getElementById('result');
  document.getElementById('chartContainer').innerHTML = '';
  if (!career) {
    resultDiv.textContent = "Please select a career interest!";
    return;
  }
  // Build a dynamic skill assessment form with Yes/No options
  let questions = skillQuestions[career] || [];
  let formHtml = `
    <h2 class="text-3xl font-extrabold mb-4 text-indigo-700 bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow">
      Skill Assessment: ${document.querySelector('#career option:checked').textContent}
    </h2>
    <form id="skillForm" class="space-y-6">
  `;
  questions.forEach((q, idx) => {
    formHtml += `
      <div class="rounded-xl bg-gradient-to-r from-indigo-100 via-pink-100 to-purple-100 p-5 shadow-md animate-fade-in">
        <label class="block text-lg font-semibold mb-2 text-indigo-600" for="q${idx}">${q}</label>
        <div class="flex gap-6">
          <label class="inline-flex items-center">
            <input type="radio" name="q${idx}" value="yes" required class="accent-indigo-500 scale-125" />
            <span class="ml-2 font-medium text-green-700">Yes</span>
          </label>
          <label class="inline-flex items-center">
            <input type="radio" name="q${idx}" value="no" required class="accent-pink-500 scale-125" />
            <span class="ml-2 font-medium text-pink-700">No</span>
          </label>
        </div>
      </div>
    `;
  });
  formHtml += `
    <button type="submit"
      class="w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 text-white font-extrabold py-4 rounded-full shadow-lg hover:from-purple-500 hover:to-indigo-500 transition duration-300 transform hover:scale-105 text-xl tracking-wide btn-pulse flex items-center justify-center gap-2 mt-4">
      <span class="inline-block animate-pulse text-2xl">✅</span> Submit Assessment
    </button>
    </form>
    <div id="assessmentResult" class="mt-8 text-center text-xl font-bold text-indigo-700"></div>
    <div id="chartContainer" class="mt-8 flex justify-center"></div>
  `;
  document.querySelector('.max-w-md').innerHTML = formHtml;

  // Handle skill assessment submission
  document.getElementById('skillForm').addEventListener('submit', function(ev) {
    ev.preventDefault();
    let score = 0;
    let minus = 0;
    questions.forEach((_, idx) => {
      const val = document.querySelector(`input[name="q${idx}"]:checked`).value;
      if (val === "yes") score += 1;
      else minus += 1;
    });
    let level = '';
    let emoji = '';
    if (score === questions.length) {
      level = 'Excellent';
      emoji = '🏆';
    } else if (score >= Math.ceil(questions.length * 0.7)) {
      level = 'Good';
      emoji = '🚀';
    } else if (score >= Math.ceil(questions.length * 0.4)) {
      level = 'Average';
      emoji = '✨';
    } else {
      level = 'Beginner';
      emoji = '🌱';
    }
    document.getElementById('assessmentResult').innerHTML =
      `<div class="inline-block glass custom-shadow px-8 py-6 shadow-2xl border-2 border-indigo-300 animate-fade-in">
        <span class="block text-4xl mb-2">${emoji}</span>
        <div class="text-xl font-bold mb-1">Your Skill Level: <span class="text-indigo-600">${level}</span></div>
        <div class="text-gray-600">Score: ${score}/${questions.length} (${minus} No${minus === 1 ? '' : 's'})</div>
      </div>
      <div class="mt-8 flex justify-center">
        <canvas id="statusChart" width="320" height="220"></canvas>
      </div>
      `;
    drawStatusBar(level);
  });
}); 