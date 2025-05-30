document.getElementById('assessmentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const certs = parseInt(document.getElementById('certs').value, 10) || 0;
  const hackathons = parseInt(document.getElementById('hackathons').value, 10) || 0;
  const linkedin = document.getElementById('linkedin').value.trim();
  const experience = document.getElementById('experience').value.trim();

  // Simple scoring logic
  let score = 0;
  if (linkedin) score += 30;
  score += Math.min(certs, 5) * 10; // Max 50 points for certs
  score += Math.min(hackathons, 5) * 4; // Max 20 points for hackathons
  if (experience.length > 50) {
    score += 10; // Bonus for detailed experience
  } else if (experience.length > 0) {
    score += 5; // Small bonus for any input
  }

  let level = '';
  let emoji = '';
  if (score >= 80) { level = 'Expert'; emoji = '🏆'; }
  else if (score >= 60) { level = 'Advanced'; emoji = '🚀'; }
  else if (score >= 40) { level = 'Intermediate'; emoji = '✨'; }
  else { level = 'Beginner'; emoji = '🌱'; }

  document.getElementById('result').innerHTML =
    `<div class="inline-block bg-white/90 rounded-3xl px-12 py-10 shadow-2xl border-2 border-purple-300 animate-fade-in">
      <span class="block text-5xl mb-4">${emoji}</span>
      Your Skill Level: <span class="text-pink-600">${level}</span> <br>
      <span class="text-gray-600 text-2xl">Score: ${score}/100</span>
    </div>`;

  // Draw/update the chart
  drawScoreChart(score);
});

// Chart.js doughnut chart
let scoreChart;
function drawScoreChart(score) {
  const ctx = document.getElementById('scoreChart').getContext('2d');
  if (scoreChart) scoreChart.destroy();
  scoreChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Your Score', 'Remaining'],
      datasets: [{
        data: [score, 100 - score],
        backgroundColor: [
          'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)', // gradient (will fallback to purple)
          '#f3f4f6' // light gray
        ],
        borderWidth: 8,
        borderColor: [
          'rgba(168,139,250,1)', // purple border
          'rgba(243,244,246,1)'
        ],
        hoverOffset: 8
      }]
    },
    options: {
      cutout: '70%',
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + ' points';
            }
          }
        },
        // Custom plugin for center text
        beforeDraw: chart => {
          const {ctx, width, height} = chart;
          ctx.save();
          ctx.font = 'bold 2.5rem "Segoe UI", Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#8b5cf6';
          ctx.shadowColor = '#f472b6';
          ctx.shadowBlur = 18;
          ctx.fillText(score + '/100', width / 2, height / 2);
          ctx.restore();
        }
      },
      animation: {
        animateRotate: true,
        duration: 1200,
        easing: 'easeOutBounce'
      }
    },
    plugins: [{
      // Fallback for gradient fill
      beforeDraw: function(chart) {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        if (!chartArea) return;
        const gradient = ctx.createLinearGradient(chartArea.left, chartArea.top, chartArea.right, chartArea.bottom);
        gradient.addColorStop(0, '#a78bfa');
        gradient.addColorStop(1, '#f472b6');
        chart.data.datasets[0].backgroundColor[0] = gradient;
      }
    }]
  });
}

// Certification dynamic file input logic
const certsInput = document.getElementById('certs');
const certListContainer = document.getElementById('certListContainer');
const certInputs = document.getElementById('certInputs');

certsInput.addEventListener('input', function () {
  const count = parseInt(this.value, 10);
  certInputs.innerHTML = '';
  if (count > 0) {
    certListContainer.classList.remove('hidden');
    for (let i = 1; i <= count; i++) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.name = `certification_${i}`;
      fileInput.accept = ".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf";
      fileInput.className = 'w-full px-6 py-3 rounded-xl border-2 border-pink-200 bg-white/80 text-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition placeholder:text-pink-300 font-semibold shadow';
      fileInput.required = true;
      certInputs.appendChild(fileInput);
    }
  } else {
    certListContainer.classList.add('hidden');
  }
});

// Hackathon dynamic file input logic
const hackathonsInput = document.getElementById('hackathons');
const hackListContainer = document.getElementById('hackListContainer');
const hackInputs = document.getElementById('hackInputs');

hackathonsInput.addEventListener('input', function () {
  const count = parseInt(this.value, 10);
  hackInputs.innerHTML = '';
  if (count > 0) {
    hackListContainer.classList.remove('hidden');
    for (let i = 1; i <= count; i++) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.name = `hackathon_${i}`;
      fileInput.accept = ".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf";
      fileInput.className = 'w-full px-6 py-3 rounded-xl border-2 border-purple-200 bg-white/80 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder:text-purple-300 font-semibold shadow';
      fileInput.required = true;
      hackInputs.appendChild(fileInput);
    }
  } else {
    hackListContainer.classList.add('hidden');
  }
}); 