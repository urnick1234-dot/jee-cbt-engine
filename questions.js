const sections = {
  Math: [],
  Physics: [],
  Chemistry: []
};

function addQuestion(section, question, options, correct, type){
  sections[section].push({
    question,
    options,
    correct,
    type,
    visited:false,
    marked:false
  });
}

/* -------------------- MATH (25) -------------------- */
for(let i=1;i<=20;i++){
  addQuestion("Math",
    `Math MCQ ${i}: If f(x)=x²+${i}x, find f'(x).`,
    ["2x+"+i, "x²", "x+"+i, "2x"],
    0,
    "mcq"
  );
}
for(let i=1;i<=5;i++){
  addQuestion("Math",
    `Math Numerical ${i}: Evaluate ${i}+${i*2}`,
    [],
    i + i*2,
    "num"
  );
}

/* -------------------- PHYSICS (25) -------------------- */
for(let i=1;i<=20;i++){
  addQuestion("Physics",
    `Physics MCQ ${i}: Force on 2kg body with acceleration ${i} m/s²?`,
    [`${2*i} N`, `${i} N`, `${3*i} N`, `${4*i} N`],
    0,
    "mcq"
  );
}
for(let i=1;i<=5;i++){
  addQuestion("Physics",
    `Physics Numerical ${i}: If v=${i*5} m/s and t=2s, find distance.`,
    [],
    (i*5)*2,
    "num"
  );
}

/* -------------------- CHEMISTRY (25) -------------------- */
for(let i=1;i<=20;i++){
  addQuestion("Chemistry",
    `Chemistry MCQ ${i}: Atomic number of element with ${i} protons?`,
    [`${i}`, `${i+1}`, `${i-1}`, `${i+2}`],
    0,
    "mcq"
  );
}
for(let i=1;i<=5;i++){
  addQuestion("Chemistry",
    `Chemistry Numerical ${i}: Find molar mass of O${i}`,
    [],
    16*i,
    "num"
  );
}

/* Randomize each subject */
Object.keys(sections).forEach(sec=>{
  sections[sec].sort(()=>Math.random()-0.5);
});
