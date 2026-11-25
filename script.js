// --- DEFAULT STATE ---
const defaultProfile = {
  goalType: 'ganho',
  name: 'Letícia',
  startWeight: 51.0,
  targetWeight: 60.0,
  height: 162,
  days: 4,
  focus: 'gluteos'
};

const todayISO = new Date().toISOString().split('T')[0];

const defaultLogs = [
  {
    id: 1,
    date: todayISO,
    weight: 51.0,
    waist: 64,
    hip: 91,
    dietAdherence: 100,
    sleepQuality: 'bom',
    note: 'Ponto de partida! Focada na consistência.',
    photo: ''
  }
];

const mealTemplates = {
  ganho: [
    { id: 'm1', title: 'Café da Manhã (Pré-treino)', desc: '3 ovos mexidos + 2 fatias de pão integral + 1 banana com aveia', kcal: 480 },
    { id: 'm2', title: 'Almoço (Refeição Forte)', desc: '150g de arroz branco + 1 concha de feijão + 130g de frango/patinho + salada', kcal: 620 },
    { id: 'm3', title: 'Lanche da Tarde / Vitamina', desc: 'Vitamina: 250ml leite + 1 banana + 30g aveia + 1 scoop whey (ou pasta de amendoim)', kcal: 450 },
    { id: 'm4', title: 'Jantar', desc: '140g de arroz ou macarrão + 130g de proteína (frango, carne ou ovos) + legumes', kcal: 520 },
    { id: 'm5', title: 'Ceia Rápida', desc: 'Iogurte natural integral + mel ou 2 ovos cozidos antes de dormir', kcal: 180 }
  ],
  perda: [
    { id: 'm1', title: 'Café da Manhã Proteico', desc: '2 ovos mexidos + 1 fatia de pão integral + café sem açúcar + 1 fatia de mamão', kcal: 310 },
    { id: 'm2', title: 'Almoço Equilibrado', desc: '90g de arroz + 1 concha pequena de feijão + 140g de frango grelhado + salada à vontade', kcal: 430 },
    { id: 'm3', title: 'Lanche da Tarde', desc: '1 iogurte natural desnatado + 1 fruta (maçã ou morangos) + 15g de aveia', kcal: 220 },
    { id: 'm4', title: 'Jantar Leve', desc: '140g de filé de frango ou peixe + legumes refogados + 80g de batata doce ou arroz', kcal: 380 },
    { id: 'm5', title: 'Ceia Opcional', desc: 'Chá natural ou 1 gelatina zero / 1 ovo cozido se sentir fome', kcal: 90 }
  ],
  recomp: [
    { id: 'm1', title: 'Café da Manhã', desc: '3 ovos mexidos + 2 fatias de pão integral + 1 fruta', kcal: 410 },
    { id: 'm2', title: 'Almoço', desc: '120g de arroz + 1 concha de feijão + 140g de proteína magra + salada com azeite', kcal: 510 },
    { id: 'm3', title: 'Lanche da Tarde', desc: '1 scoop de whey ou 150g iogurte natural + 1 banana + 20g aveia', kcal: 310 },
    { id: 'm4', title: 'Jantar', desc: '110g de arroz ou mandioca + 140g de frango/carne + legumes', kcal: 460 },
    { id: 'm5', title: 'Ceia', desc: '2 ovos cozidos ou 1 copo de leite desnatado/vegetal', kcal: 150 }
  ],
  manter: [
    { id: 'm1', title: 'Café da Manhã', desc: '2 a 3 ovos + 2 fatias de pão + 1 fruta de preferência', kcal: 420 },
    { id: 'm2', title: 'Almoço', desc: '130g de arroz + feijão + 130g de proteína + salada variada', kcal: 550 },
    { id: 'm3', title: 'Lanche da Tarde', desc: 'Iogurte com frutas e aveia ou sanduíche natural de frango', kcal: 340 },
    { id: 'm4', title: 'Jantar', desc: '120g de carboidrato + 130g de proteína + legumes', kcal: 490 },
    { id: 'm5', title: 'Ceia', desc: 'Fruta ou iogurte leve', kcal: 150 }
  ]
};

let profile = JSON.parse(localStorage.getItem('fit_profile')) || defaultProfile;
let logs = JSON.parse(localStorage.getItem('fit_logs')) || defaultLogs;
let completedMeals = JSON.parse(localStorage.getItem('fit_meals_done')) || {};
let savedLoads = JSON.parse(localStorage.getItem('fit_loads')) || {};
let activeWorkoutDay = 0;
let uploadedPhotoBase64 = '';
let chartInstance = null;

// --- WORKOUT TEMPLATES ---
function getWorkoutPlan() {
  const d = Number(profile.days);
  const plans = {
    3: [
      { name: 'Treino A — Inferiores Completo', exercises: [
        { id: 'a1', name: 'Agachamento Livre ou Guiado', sets: '4x 8-10', rest: '90s' },
        { id: 'a2', name: 'Leg Press 45°', sets: '4x 10-12', rest: '90s' },
        { id: 'a3', name: 'Elevação Pélvica na Máquina/Barra', sets: '4x 10-12', rest: '90s' },
        { id: 'a4', name: 'Cadeira Extensora', sets: '3x 12-15', rest: '60s' },
        { id: 'a5', name: 'Panturrilha em Pé', sets: '4x 15', rest: '45s' }
      ]},
      { name: 'Treino B — Superiores & Core', exercises: [
        { id: 'b1', name: 'Puxada Alta Frontal', sets: '4x 10-12', rest: '60s' },
        { id: 'b2', name: 'Remada Baixa Triângulo', sets: '3x 10-12', rest: '60s' },
        { id: 'b3', name: 'Desenvolvimento com Halteres', sets: '3x 10-12', rest: '60s' },
        { id: 'b4', name: 'Elevação Lateral', sets: '3x 12-15', rest: '45s' },
        { id: 'b5', name: 'Prancha Abdominal', sets: '3x 45s', rest: '45s' }
      ]},
      { name: 'Treino C — Posterior & Glúteos', exercises: [
        { id: 'c1', name: 'Stiff com Barra ou Halteres', sets: '4x 10', rest: '90s' },
        { id: 'c2', name: 'Mesa Flexora', sets: '4x 12', rest: '60s' },
        { id: 'c3', name: 'Afundo / Búlgaro', sets: '3x 10 cada', rest: '90s' },
        { id: 'c4', name: 'Cadeira Abdutora', sets: '4x 15', rest: '45s' },
        { id: 'c5', name: 'Glúteo na Polia (Coice)', sets: '3x 12 cada', rest: '45s' }
      ]}
    ],
    4: [
      { name: 'Treino A — Quadríceps & Panturrilha', exercises: [
        { id: '4a1', name: 'Agachamento Livre / Smith', sets: '4x 8-10', rest: '90s' },
        { id: '4a2', name: 'Leg Press 45°', sets: '4x 10-12', rest: '90s' },
        { id: '4a3', name: 'Cadeira Extensora', sets: '4x 12', rest: '60s' },
        { id: '4a4', name: 'Agachamento Sumô com Halter', sets: '3x 12', rest: '60s' },
        { id: '4a5', name: 'Panturrilha Sentada', sets: '4x 15', rest: '45s' }
      ]},
      { name: 'Treino B — Costas & Bíceps', exercises: [
        { id: '4b1', name: 'Puxada Alta Aberta', sets: '4x 10-12', rest: '60s' },
        { id: '4b2', name: 'Remada Curvada ou Máquina', sets: '4x 10', rest: '60s' },
        { id: '4b3', name: 'Pulldown na Polia', sets: '3x 12', rest: '60s' },
        { id: '4b4', name: 'Rosca Direta com Halteres', sets: '3x 12', rest: '45s' },
        { id: '4b5', name: 'Abdominal Supra no Solo', sets: '3x 15', rest: '45s' }
      ]},
      { name: 'Treino C — Glúteos & Posterior', exercises: [
        { id: '4c1', name: 'Elevação Pélvica', sets: '4x 8-12', rest: '90s' },
        { id: '4c2', name: 'Stiff com Barra', sets: '4x 10', rest: '90s' },
        { id: '4c3', name: 'Cadeira Flexora', sets: '4x 12', rest: '60s' },
        { id: '4c4', name: 'Agachamento Búlgaro', sets: '3x 10 cada', rest: '90s' },
        { id: '4c5', name: 'Cadeira Abdutora', sets: '4x 15', rest: '45s' }
      ]},
      { name: 'Treino D — Ombros, Peito & Tríceps', exercises: [
        { id: '4d1', name: 'Desenvolvimento com Halteres', sets: '4x 10', rest: '60s' },
        { id: '4d2', name: 'Elevação Lateral', sets: '4x 12-15', rest: '45s' },
        { id: '4d3', name: 'Supino Inclinado com Halteres', sets: '3x 12', rest: '60s' },
        { id: '4d4', name: 'Tríceps Corda na Polia', sets: '3x 12', rest: '45s' },
        { id: '4d5', name: 'Prancha Isométrica', sets: '3x 45s', rest: '45s' }
      ]}
    ],
    5: [
      { name: 'Treino A — Quadríceps', exercises: [
        { id: '5a1', name: 'Agachamento Livre', sets: '4x 8-10', rest: '90s' },
        { id: '5a2', name: 'Leg Press 45°', sets: '4x 10-12', rest: '90s' },
        { id: '5a3', name: 'Cadeira Extensora', sets: '4x 12-15', rest: '60s' },
        { id: '5a4', name: 'Passada com Halteres', sets: '3x 12 cada', rest: '60s' }
      ]},
      { name: 'Treino B — Costas & Abdômen', exercises: [
        { id: '5b1', name: 'Puxada Alta', sets: '4x 10-12', rest: '60s' },
        { id: '5b2', name: 'Remada Baixa', sets: '4x 10-12', rest: '60s' },
        { id: '5b3', name: 'Remada Unilateral (Serrote)', sets: '3x 10 cada', rest: '60s' },
        { id: '5b4', name: 'Abdominal Infra', sets: '4x 15', rest: '45s' }
      ]},
      { name: 'Treino C — Glúteos Isolado', exercises: [
        { id: '5c1', name: 'Elevação Pélvica', sets: '4x 8-10', rest: '90s' },
        { id: '5c2', name: 'Agachamento Búlgaro', sets: '3x 10 cada', rest: '90s' },
        { id: '5c3', name: 'Glúteo Coice na Polia', sets: '4x 12 cada', rest: '45s' },
        { id: '5c4', name: 'Cadeira Abdutora', sets: '4x 15', rest: '45s' }
      ]},
      { name: 'Treino D — Ombros & Braços', exercises: [
        { id: '5d1', name: 'Desenvolvimento Halteres', sets: '4x 10', rest: '60s' },
        { id: '5d2', name: 'Elevação Lateral', sets: '4x 15', rest: '45s' },
        { id: '5d3', name: 'Tríceps Francês / Polia', sets: '3x 12', rest: '45s' },
        { id: '5d4', name: 'Rosca Martelo', sets: '3x 12', rest: '45s' }
      ]},
      { name: 'Treino E — Posterior & Panturrilha', exercises: [
        { id: '5e1', name: 'Stiff com Barra', sets: '4x 10', rest: '90s' },
        { id: '5e2', name: 'Mesa Flexora', sets: '4x 12', rest: '60s' },
        { id: '5e3', name: 'Cadeira Flexora', sets: '3x 12', rest: '60s' },
        { id: '5e4', name: 'Panturrilha em Pé + Sentada', sets: '4x 15', rest: '45s' }
      ]}
    ]
  };
  return plans[d] || plans[4];
}

// --- CORE CALCULATIONS & RENDER ---
function getLatestLog() {
  const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  return sorted[sorted.length - 1] || defaultLogs[0];
}

function calculateNutrition(weight, goalType) {
  const maintenance = Math.round(weight * 33);
  let kcal = maintenance;
  let proteinMult = 2.0;
  let fatMult = 1.0;
  let badgeText = 'Calorias de manutenção';
  let proteinNote = 'Manutenção muscular';

  if (goalType === 'ganho') {
    kcal = maintenance + 380;
    proteinMult = 2.0;
    fatMult = 1.1;
    badgeText = '+380 kcal (Superávit Limpo)';
    proteinNote = 'Construção muscular';
  } else if (goalType === 'perda') {
    kcal = Math.max(1300, maintenance - 400);
    proteinMult = 2.2;
    fatMult = 0.8;
    badgeText = '-400 kcal (Déficit Seguro)';
    proteinNote = 'Protege massa magra';
  } else if (goalType === 'recomp') {
    kcal = maintenance - 100;
    proteinMult = 2.2;
    fatMult = 0.9;
    badgeText = 'Recomposição Corporal';
    proteinNote = 'Troca de gordura por músculo';
  }

  const protein = Math.round(weight * proteinMult);
  const fats = Math.round(weight * fatMult);
  const carbs = Math.max(60, Math.round((kcal - (protein * 4 + fats * 9)) / 4));
  const water = ((weight * 35) / 1000).toFixed(1);

  return { kcal, protein, carbs, fats, water, badgeText, proteinNote };
}

function renderAll() {
  const latest = getLatestLog();
  const currentW = Number(latest.weight);
  const startW = Number(profile.startWeight);
  const targetW = Number(profile.targetWeight);
  const goal = profile.goalType || 'ganho';

  const goalMeta = {
    ganho: { label: 'Ganho de Peso & Hipertrofia', tag: 'Ganho de Massa' },
    perda: { label: 'Perda de Peso & Definição', tag: 'Emagrecimento' },
    recomp: { label: 'Recomposição Corporal', tag: 'Secar & Definir' },
    manter: { label: 'Manutenção & Saúde', tag: 'Manutenção' }
  }[goal];

  document.getElementById('headerBadge').innerText = `${targetW}kg`;
  document.getElementById('headerTitle').innerText = `Meta ${targetW}kg — ${profile.name}`;
  document.getElementById('headerSubtitle').innerText = `${goalMeta.label} • ${profile.days}x na semana`;
  document.getElementById('goalTag').innerText = goalMeta.tag;

  let pct = 0;
  let remainingText = '';
  if (goal === 'manter' || Math.abs(targetW - startW) < 0.1) {
    const diffFromTarget = Math.abs(currentW - targetW);
    pct = diffFromTarget <= 1 ? 100 : Math.max(0, 100 - Math.round(diffFromTarget * 10));
    remainingText = diffFromTarget <= 0.5 ? 'Dentro da faixa ideal!' : `${diffFromTarget.toFixed(1)} kg de diferença da meta`;
  } else {
    const totalDelta = targetW - startW;
    const currentDelta = currentW - startW;
    pct = Math.min(Math.max(Math.round((currentDelta / totalDelta) * 100), 0), 100);
    const left = Math.abs(targetW - currentW).toFixed(1);
    const reached = (totalDelta > 0 && currentW >= targetW) || (totalDelta < 0 && currentW <= targetW);
    remainingText = reached ? 'Meta alcançada! 🎉' : `Faltam ${left} kg`;
  }

  document.getElementById('currentWeightDisplay').innerText = `${currentW.toFixed(1)} kg`;
  document.getElementById('targetWeightDisplay').innerText = `${targetW.toFixed(1)} kg`;
  document.getElementById('progressPercentDisplay').innerText = `${pct}%`;
  document.getElementById('remainingWeightDisplay').innerText = remainingText;
  document.getElementById('progressBar').style.width = `${pct}%`;

  const nutri = calculateNutrition(currentW, goal);
  document.getElementById('summaryCalories').innerText = `${nutri.kcal.toLocaleString('pt-BR')} kcal`;
  document.getElementById('summaryProtein').innerText = `${nutri.protein} g`;
  document.getElementById('summaryWater').innerText = `${nutri.water} L`;
  document.getElementById('summarySplit').innerText = `${profile.days}x / semana`;

  document.getElementById('dietWeightRef').innerText = currentW.toFixed(1);
  document.getElementById('dietStrategyBadge').innerText = nutri.badgeText;
  document.getElementById('macroKcal').innerText = nutri.kcal.toLocaleString('pt-BR');
  document.getElementById('macroProtein').innerText = `${nutri.protein}g`;
  document.getElementById('macroProteinNote').innerText = nutri.proteinNote;
  document.getElementById('macroCarbs').innerText = `${nutri.carbs}g`;
  document.getElementById('macroFats').innerText = `${nutri.fats}g`;

  document.getElementById('lastCheckinDate').innerText = formatDateBR(latest.date);
  document.getElementById('lastCheckinNote').innerText = latest.note || 'Sem observações registradas.';
  document.getElementById('lastCheckinWeight').innerText = `${currentW.toFixed(1)} kg`;
  document.getElementById('lastCheckinMeasures').innerText = `${latest.waist || '--'} / ${latest.hip || '--'} cm`;
  document.getElementById('lastCheckinHabits').innerText = `${latest.dietAdherence}% dieta / Sono ${latest.sleepQuality}`;

  renderChart();
  renderHistoryAndComparison();
  renderMeals();
  renderWorkouts();
  renderDiagnostics();
}

function renderChart() {
  const ctx = document.getElementById('weightChart').getContext('2d');
  const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const labels = sorted.map(l => formatDateBR(l.date));
  const data = sorted.map(l => l.weight);

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Peso (kg)',
        data,
        borderColor: '#059669',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        borderWidth: 3,
        pointBackgroundColor: '#059669',
        pointRadius: 5,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          suggestedMin: Math.min(...data) - 1,
          suggestedMax: Math.max(...data) + 1.5,
          grid: { color: '#f1f5f9' }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

function renderHistoryAndComparison() {
  const sortedDesc = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  const historyEl = document.getElementById('historyList');
  historyEl.innerHTML = sortedDesc.map(item => `
    <div class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        ${item.photo
          ? `<img src="${item.photo}" class="w-14 h-14 rounded-lg object-cover border border-slate-200" />`
          : `<div class="w-14 h-14 rounded-lg bg-slate-200/70 flex items-center justify-center text-slate-400 text-[10px] font-bold text-center p-1">Sem foto</div>`
        }
        <div>
          <div class="flex items-center gap-2">
            <span class="font-extrabold text-sm text-slate-900">${Number(item.weight).toFixed(1)} kg</span>
            <span class="text-[11px] text-slate-500">• ${formatDateBR(item.date)}</span>
          </div>
          <p class="text-xs text-slate-600 mt-0.5">${item.note || 'Registro de evolução'}</p>
          <div class="text-[11px] text-slate-400 mt-1">Dieta: ${item.dietAdherence}% • Sono: ${item.sleepQuality} ${item.waist ? `• Cintura: ${item.waist}cm` : ''}</div>
        </div>
      </div>
      ${logs.length > 1 ? `<button onclick="deleteLog(${item.id})" class="text-xs text-rose-500 hover:underline">Excluir</button>` : ''}
    </div>
  `).join('');

  const selA = document.getElementById('compareSelectA');
  const selB = document.getElementById('compareSelectB');
  const sortedAsc = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));

  selA.innerHTML = sortedAsc.map((l, idx) => `<option value="${l.id}" ${idx === 0 ? 'selected' : ''}>${formatDateBR(l.date)} (${l.weight}kg)</option>`).join('');
  selB.innerHTML = sortedAsc.map((l, idx) => `<option value="${l.id}" ${idx === sortedAsc.length - 1 ? 'selected' : ''}>${formatDateBR(l.date)} (${l.weight}kg)</option>`).join('');

  renderComparison();
}

function renderComparison() {
  const idA = Number(document.getElementById('compareSelectA').value);
  const idB = Number(document.getElementById('compareSelectB').value);
  const itemA = logs.find(l => l.id === idA) || logs[0];
  const itemB = logs.find(l => l.id === idB) || logs[logs.length - 1];

  const renderSlot = (item, label) => `
    <div class="border border-slate-200 rounded-xl p-3 bg-slate-50">
      <div class="flex justify-between items-center mb-2 text-xs">
        <span class="font-bold text-slate-700">${label}: ${formatDateBR(item.date)}</span>
        <span class="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">${Number(item.weight).toFixed(1)} kg</span>
      </div>
      ${item.photo
        ? `<img src="${item.photo}" class="w-full h-64 object-cover rounded-lg border border-slate-200" />`
        : `<div class="w-full h-64 rounded-lg bg-slate-200/60 flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
            <span>Nenhuma foto anexada nesta data</span>
            <span class="text-[11px] mt-1">Adicione fotos em "+ Novo Registro" para comparar</span>
           </div>`
      }
    </div>
  `;

  document.getElementById('comparisonContainer').innerHTML = renderSlot(itemA, 'Antes') + renderSlot(itemB, 'Depois');
}

function renderMeals() {
  const goal = profile.goalType || 'ganho';
  const list = mealTemplates[goal] || mealTemplates.ganho;
  const container = document.getElementById('mealList');
  container.innerHTML = list.map(m => {
    const isDone = !!completedMeals[m.id];
    return `
      <div onclick="toggleMeal('${m.id}')" class="cursor-pointer p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${isDone ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-slate-200 hover:bg-slate-50'}">
        <div class="flex items-center gap-3">
          <input type="checkbox" ${isDone ? 'checked' : ''} class="w-4 h-4 accent-emerald-600 rounded" />
          <div>
            <div class="text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}">${m.title}</div>
            <div class="text-xs text-slate-500 mt-0.5">${m.desc}</div>
          </div>
        </div>
        <span class="text-xs font-bold text-slate-600 whitespace-nowrap">${m.kcal} kcal</span>
      </div>
    `;
  }).join('');
}

function renderWorkouts() {
  const plan = getWorkoutPlan();
  if (activeWorkoutDay >= plan.length) activeWorkoutDay = 0;

  document.getElementById('workoutPlanTitle').innerText = `Ficha Personalizada — ${profile.days}x na Semana`;
  const dayTabs = document.getElementById('workoutDayTabs');
  dayTabs.innerHTML = plan.map((day, idx) => `
    <button onclick="selectWorkoutDay(${idx})" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${idx === activeWorkoutDay ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
      Dia ${idx + 1}
    </button>
  `).join('');

  const currentDay = plan[activeWorkoutDay];
  const container = document.getElementById('workoutExercisesContainer');
  container.innerHTML = `
    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-3 flex justify-between items-center">
      <span class="font-bold text-sm text-slate-800">${currentDay.name}</span>
      <span class="text-[11px] text-slate-500">Anote suas cargas para progredir</span>
    </div>
    ${currentDay.exercises.map(ex => `
      <div class="p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="font-bold text-xs text-slate-900">${ex.name}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Séries: <strong>${ex.sets}</strong> • Descanso: ${ex.rest}</div>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-[11px] text-slate-500">Carga (kg):</label>
          <input type="text" value="${savedLoads[ex.id] || ''}" onchange="saveExerciseLoad('${ex.id}', this.value)" placeholder="Ex: 20kg" class="w-20 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-center" />
        </div>
      </div>
    `).join('')}
  `;
}

function renderDiagnostics() {
  const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const latest = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;
  const goal = profile.goalType || 'ganho';
  const cards = [];

  if (previous) {
    const diff = Number((latest.weight - previous.weight).toFixed(1));

    if (goal === 'ganho') {
      if (diff <= 0) {
        cards.push({ type: 'warning', title: '⚠️ Ganho de Peso Estagnado', text: `Seu peso variou ${diff} kg. Para destravar a hipertrofia, adicione +200 kcal na dieta (mais arroz, aveia ou vitamina calórica) e revise o descanso.` });
      } else if (diff > 1.0) {
        cards.push({ type: 'info', title: '⚡ Ganho Rápido Detectado', text: `Você ganhou +${diff} kg. Excelente sinal de superávit, mas acompanhe a medida da cintura para garantir qualidade muscular.` });
      } else {
        cards.push({ type: 'success', title: '✅ Ritmo Perfeito de Ganho', text: `Você ganhou +${diff} kg no último período! Continue nessa faixa (0,25kg a 0,5kg/semana) para bater os ${profile.targetWeight} kg com qualidade.` });
      }
    } else if (goal === 'perda') {
      if (diff >= 0) {
        cards.push({ type: 'warning', title: '⚠️ Perda de Peso Estagnada', text: `Seu peso variou +${diff} kg. Revise beliscos fora da dieta, aumente sua meta de passos/cardio leve e mantenha a proteína alta para destravar o déficit.` });
      } else if (diff < -1.2) {
        cards.push({ type: 'info', title: '⚡ Perda Acelerada', text: `Você eliminou ${Math.abs(diff)} kg. Ótimo resultado, mas cuide para não cortar calorias demais e acabar perdendo massa muscular.` });
      } else {
        cards.push({ type: 'success', title: '✅ Emagrecimento Consistente', text: `Você eliminou ${Math.abs(diff)} kg! Esse é o ritmo ideal para secar gordura preservando seus músculos.` });
      }
    } else {
      cards.push({ type: 'success', title: '⚖️ Acompanhamento de Recomposição', text: `Variação de ${diff > 0 ? '+' + diff : diff} kg. Na recomposição, observe também suas fotos e medidas da cintura, pois você pode estar trocando gordura por músculo.` });
    }
  } else {
    cards.push({
      type: 'info',
      title: '📊 Aguardando 2º Registro para Análise',
      text: 'Seu ponto de partida já está salvo. Faça uma nova pesagem daqui a 7 dias na aba Evolução para o sistema diagnosticar seu ritmo automaticamente.'
    });
  }

  if (Number(latest.dietAdherence) < 85) {
    cards.push({
      type: 'warning',
      title: '🍽️ Onde Melhorar: Consistência na Dieta',
      text: goal === 'ganho'
        ? 'Você marcou adesão abaixo de 85%. No ganho de peso, pular refeições anula o superávit da semana. Use vitaminas líquidas nos dias mais corridos.'
        : 'Você marcou adesão abaixo de 85%. No emagrecimento, escapadas no fim de semana costumam zerar o déficit da semana. Planeje lanches proteicos práticos.'
    });
  }

  if (latest.sleepQuality !== 'bom') {
    cards.push({
      type: 'warning',
      title: '😴 Onde Melhorar: Sono & Hidratação',
      text: 'Dormir pouco aumenta o estresse hormonal (cortisol), atrapalha tanto o ganho de massa quanto a queima de gordura e aumenta a retenção de líquido.'
    });
  }

  cards.push({
    type: 'neutral',
    title: goal === 'perda' ? '🔥 Estratégia de Treino para Definição' : '🏋️‍♀️ Estratégia de Treino para Hipertrofia',
    text: goal === 'perda'
      ? 'Mantenha a intensidade e as cargas na musculação para sinalizar ao corpo que ele precisa manter os músculos enquanto queima gordura, e adicione 20-30 min de cardio pós-treino.'
      : 'Foque em progressão de carga nos exercícios principais (Agachamento, Leg Press, Elevação Pélvica e Stiff). Quando completar todas as repetições com boa técnica, aumente o peso.'
  });

  const styles = {
    warning: 'bg-amber-50 border-amber-200 text-amber-950',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    info: 'bg-sky-50 border-sky-200 text-sky-950',
    neutral: 'bg-slate-50 border-slate-200 text-slate-900'
  };

  document.getElementById('diagnosticCards').innerHTML = cards.map(c => `
    <div class="p-4 rounded-xl border ${styles[c.type]}">
      <div class="font-bold text-sm">${c.title}</div>
      <p class="text-xs mt-1 leading-relaxed opacity-90">${c.text}</p>
    </div>
  `).join('');
}

// --- INTERACTIONS ---
function switchTab(tab) {
  ['evolucao', 'dieta', 'treinos', 'diagnostico'].forEach(t => {
    document.getElementById(`view-${t}`).classList.toggle('hidden', t !== tab);
    const btn = document.getElementById(`tab-${t}`);
    btn.className = t === tab
      ? 'tab-active px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition'
      : 'tab-inactive px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition';
  });
}

function openGoalsModal() {
  document.getElementById('cfgGoalType').value = profile.goalType || 'ganho';
  document.getElementById('cfgName').value = profile.name;
  document.getElementById('cfgStartWeight').value = profile.startWeight;
  document.getElementById('cfgTargetWeight').value = profile.targetWeight;
  document.getElementById('cfgHeight').value = profile.height;
  document.getElementById('cfgDays').value = profile.days;
  document.getElementById('cfgFocus').value = profile.focus;
  document.getElementById('goalsModal').classList.remove('hidden');
}

function closeGoalsModal() {
  document.getElementById('goalsModal').classList.add('hidden');
}

function saveGoals() {
  profile = {
    goalType: document.getElementById('cfgGoalType').value,
    name: document.getElementById('cfgName').value || 'Atleta',
    startWeight: parseFloat(document.getElementById('cfgStartWeight').value) || 51.0,
    targetWeight: parseFloat(document.getElementById('cfgTargetWeight').value) || 60.0,
    height: parseInt(document.getElementById('cfgHeight').value) || 162,
    days: parseInt(document.getElementById('cfgDays').value) || 4,
    focus: document.getElementById('cfgFocus').value
  };
  localStorage.setItem('fit_profile', JSON.stringify(profile));
  closeGoalsModal();
  renderAll();
}

function openLogModal() {
  document.getElementById('logDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('logWeight').value = getLatestLog().weight;
  document.getElementById('logWaist').value = '';
  document.getElementById('logHip').value = '';
  document.getElementById('logNote').value = '';
  uploadedPhotoBase64 = '';
  document.getElementById('photoPreview').classList.add('hidden');
  document.getElementById('logPhotoInput').value = '';
  document.getElementById('logModal').classList.remove('hidden');
}

function closeLogModal() {
  document.getElementById('logModal').classList.add('hidden');
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxW = 500;
      const scale = maxW / img.width;
      canvas.width = maxW;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      uploadedPhotoBase64 = canvas.toDataURL('image/jpeg', 0.72);
      const preview = document.getElementById('photoPreview');
      preview.src = uploadedPhotoBase64;
      preview.classList.remove('hidden');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function saveLog() {
  const weightVal = parseFloat(document.getElementById('logWeight').value);
  if (!weightVal) return alert('Informe seu peso atual!');

  const newEntry = {
    id: Date.now(),
    date: document.getElementById('logDate').value || todayISO,
    weight: weightVal,
    waist: document.getElementById('logWaist').value,
    hip: document.getElementById('logHip').value,
    dietAdherence: document.getElementById('logDietAdherence').value,
    sleepQuality: document.getElementById('logSleepQuality').value,
    note: document.getElementById('logNote').value,
    photo: uploadedPhotoBase64
  };

  logs.push(newEntry);
  localStorage.setItem('fit_logs', JSON.stringify(logs));
  closeLogModal();
  renderAll();
}

function deleteLog(id) {
  logs = logs.filter(l => l.id !== id);
  localStorage.setItem('fit_logs', JSON.stringify(logs));
  renderAll();
}

function toggleMeal(id) {
  completedMeals[id] = !completedMeals[id];
  localStorage.setItem('fit_meals_done', JSON.stringify(completedMeals));
  renderMeals();
}

function resetMeals() {
  completedMeals = {};
  localStorage.setItem('fit_meals_done', JSON.stringify(completedMeals));
  renderMeals();
}

function selectWorkoutDay(idx) {
  activeWorkoutDay = idx;
  renderWorkouts();
}

function saveExerciseLoad(id, val) {
  savedLoads[id] = val;
  localStorage.setItem('fit_loads', JSON.stringify(savedLoads));
}

function formatDateBR(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

renderAll();
