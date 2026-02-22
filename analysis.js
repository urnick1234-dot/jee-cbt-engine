let currentSection = "Math";
let currentIndex = 0;
let answers = {
  Math: Array(25).fill(null),
  Physics: Array(25).fill(null),
  Chemistry: Array(25).fill(null)
};

/* ---------------- TIMER ---------------- */
let totalTime = 3 * 60 * 60;
const timerEl = document.getElementById("timer");

const timerInterval = setInterval(()=>{
  let h = Math.floor(totalTime/3600);
  let m = Math.floor((totalTime%3600)/60);
  let s = totalTime%60;

  timerEl.innerText =
    String(h).padStart(2,'0') + ":" +
    String(m).padStart(2,'0') + ":" +
    String(s).padStart(2,'0');

  if(totalTime <= 0){
    clearInterval(timerInterval);
    submitTest();
  }
  totalTime--;
},1000);

/* ---------------- LOAD QUESTION ---------------- */
function loadQuestion(){
  const qObj = sections[currentSection][currentIndex];

  document.getElementById("question-title").innerText =
    currentSection + " Question " + (currentIndex+1);

  document.getElementById("question-text").innerText = qObj.question;

  const container = document.getElementById("options-container");
  container.innerHTML = "";

  if(qObj.type === "mcq"){
    qObj.options.forEach((opt,i)=>{
      const label = document.createElement("label");
      label.innerHTML =
        `<input type="radio" name="opt"
        ${answers[currentSection][currentIndex]===i?"checked":""}
        onchange="saveAnswer(${i})"> ${opt}`;
      container.appendChild(label);
    });
  } else {
    container.innerHTML =
      `<input type="number"
       value="${answers[currentSection][currentIndex] || ""}"
       onchange="saveAnswer(this.value)">`;
  }

  qObj.visited = true;
  updatePalette();
}

/* ---------------- SAVE ANSWER ---------------- */
function saveAnswer(val){
  answers[currentSection][currentIndex] = val;
  updatePalette();
}

/* ---------------- NAVIGATION ---------------- */
function nextQuestion(){
  if(currentIndex < 24){
    currentIndex++;
    loadQuestion();
  }
}

function prevQuestion(){
  if(currentIndex > 0){
    currentIndex--;
    loadQuestion();
  }
}

function switchSection(sec){
  currentSection = sec;
  currentIndex = 0;
  loadQuestion();
}

/* ---------------- MARK REVIEW ---------------- */
function markForReview(){
  sections[currentSection][currentIndex].marked = true;
  updatePalette();
}

/* ---------------- PALETTE ---------------- */
function updatePalette(){
  const pal = document.getElementById("palette");
  pal.innerHTML = "";

  sections[currentSection].forEach((q,i)=>{
    const btn = document.createElement("button");
    btn.classList.add("palette-btn");
    btn.innerText = i+1;

    if(!q.visited){
      btn.classList.add("not-visited");
    }
    else if(answers[currentSection][i] == null){
      btn.classList.add("not-answered");
    }
    else{
      btn.classList.add("answered");
    }

    if(q.marked){
      btn.classList.remove("answered");
      btn.classList.add("review");
    }

    btn.onclick = ()=>{
      currentIndex = i;
      loadQuestion();
    };

    pal.appendChild(btn);
  });
}

/* ---------------- SUBMIT ---------------- */
function submitTest(){

  clearInterval(timerInterval);

  let totalScore = 0;
  let totalAttempted = 0;
  let totalCorrect = 0;
  let totalWrong = 0;

  let subjectScore = {
    Math:0,
    Physics:0,
    Chemistry:0
  };

  Object.keys(sections).forEach(sec=>{
    sections[sec].forEach((q,i)=>{
      const ans = answers[sec][i];

      if(ans != null){
        totalAttempted++;
      }

      if(q.type === "mcq"){
        if(ans == q.correct){
          totalScore += 4;
          subjectScore[sec] += 4;
          totalCorrect++;
        }
        else if(ans != null){
          totalScore -= 1;
          subjectScore[sec] -= 1;
          totalWrong++;
        }
      }
      else{
        if(Number(ans) === q.correct){
          totalScore += 4;
          subjectScore[sec] += 4;
          totalCorrect++;
        }
      }
    });
  });

  const accuracy = totalAttempted === 0 ? 0 :
    ((totalCorrect/totalAttempted)*100).toFixed(2);

  let predictedRank;

  if(totalScore > 260) predictedRank = "Under 5,000";
  else if(totalScore > 220) predictedRank = "Under 15,000";
  else if(totalScore > 180) predictedRank = "Under 35,000";
  else if(totalScore > 140) predictedRank = "Under 60,000";
  else predictedRank = "Above 1 Lakh";

  showResult(totalScore, totalAttempted, totalCorrect,
             totalWrong, accuracy,
             subjectScore, predictedRank);
}

/* ---------------- RESULT DISPLAY ---------------- */
function showResult(score, attempted, correct,
                    wrong, accuracy,
                    subjectScore, rank){

  document.body.innerHTML = `
  <div style="padding:40px;font-family:Arial">
    <h2>JEE Mock Result</h2>
    <h3>Total Score: ${score}</h3>
    <p>Attempted: ${attempted}</p>
    <p>Correct: ${correct}</p>
    <p>Wrong: ${wrong}</p>
    <p>Accuracy: ${accuracy}%</p>
    <hr>
    <h4>Subject Scores</h4>
    <p>Math: ${subjectScore.Math}</p>
    <p>Physics: ${subjectScore.Physics}</p>
    <p>Chemistry: ${subjectScore.Chemistry}</p>
    <hr>
    <h3>Predicted AIR: ${rank}</h3>
    <canvas id="rankChart" width="500" height="300"></canvas>
  </div>
  `;

  drawGraph(score);
}

/* ---------------- SIMPLE GRAPH ---------------- */
function drawGraph(score){
  const canvas = document.getElementById("rankChart");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0a3d91";
  ctx.fillRect(50, 250-score, 100, score);

  ctx.fillStyle = "black";
  ctx.fillText("Your Score", 50, 270);
}

/* INIT */
loadQuestion();
