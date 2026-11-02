/**
 * FizLab AI — Diagnostic rules (qoidalar asosida MVP)
 * Word hujjatidagi §6.6 va §6.7 ga asosan.
 */

// Standart me'yoriy vaqtlar (soniya) — har bir bosqich uchun
export const STEP_STANDARD_TIME = {
  step1: 60,   // Nazariy savol
  step2: 30,   // Asbob tanlash
  step3: 30,   // Havoda o'lchash
  step4: 30,   // Suyuqlikda o'lchash
  step5: 60,   // Slayderlar bilan parametr o'zgartirish
  step6: 40,   // Jadvalga kiritish va hisoblash
  step7: 60,   // Xulosa yozish
};

export const DIAG_RULES = {
  green: { maxErrors: 1, maxTimeMultiplier: 1.0 },
  yellow: { maxErrors: 2, maxTimeMultiplier: 1.5 },
  red: { maxErrors: 3, maxTimeMultiplier: 2.0 },
};

export function getStepColor(errors = 0, spentSeconds = 0, standardSeconds = 30, helpRequested = false) {
  if (helpRequested || errors >= DIAG_RULES.red.maxErrors || spentSeconds >= standardSeconds * DIAG_RULES.red.maxTimeMultiplier) {
    return 'red';
  }
  if (errors >= DIAG_RULES.yellow.maxErrors || spentSeconds >= standardSeconds * DIAG_RULES.yellow.maxTimeMultiplier) {
    return 'yellow';
  }
  return 'green';
}

export function generateDiagnostic(studentData = {}) {
  const steps = studentData?.steps || {};
  const studentName = studentData?.name || "O'quvchi";
  const studentSid = studentData?.sid || "guest";
  const stepIds = Object.keys(STEP_STANDARD_TIME);

  let totalErrors = 0;
  let totalTimeRatio = 0;
  let helpCount = 0;
  const stepColors = {};

  stepIds.forEach((stepId) => {
    const s = steps[stepId] || { errors: 0, time: 0, help: false };
    totalErrors += s.errors || 0;
    totalTimeRatio += (s.time || 0) / STEP_STANDARD_TIME[stepId];
    if (s.help) helpCount += 1;

    const color = getStepColor(
      s.errors || 0,
      s.time || 0,
      STEP_STANDARD_TIME[stepId],
      s.help || false
    );
    stepColors[stepId] = color;
  });

  const avgTimeRatio = totalTimeRatio / stepIds.length;

  // Umumiy rang
  let overallColor = 'green';
  if (helpCount > 0 || totalErrors >= 3 || avgTimeRatio >= 2.0) {
    overallColor = 'red';
  } else if (totalErrors >= 2 || avgTimeRatio >= 1.5) {
    overallColor = 'yellow';
  }

  // Ko'nikmalar (skills)
  const skills = {
    'Asbob tanlash': steps.step2?.errors === 0 ? 'high' : (steps.step2?.errors ?? 0) <= 1 ? 'medium' : 'low',
    'Tajriba rejalashtirish': steps.step3?.errors === 0 && steps.step4?.errors === 0 ? 'high' : 'medium',
    "O'lchash": steps.step5?.errors === 0 ? 'high' : 'medium',
    'Hisoblash (Arximed kuchi)': steps.step6?.errors === 0 ? 'high' : 'medium',
    'Xulosa yozish': steps.step7?.errors === 0 ? 'high' : 'medium',
  };

  // Xatolar
  const errorsList = [];
  if (steps.step2?.errors > 0) errorsList.push('Asbob tanlash: past');
  if (steps.step5?.errors > 1) errorsList.push('Tajriba rejalashtirish: past');
  if (steps.step6?.errors > 0) errorsList.push('Birliklar va hisoblash: past');
  if (steps.step7?.errors > 0) errorsList.push('Tushunchaviy xato: xulosa mantiqqa zid');
  if (helpCount > 0) errorsList.push('Umumiy: yordam so‘ralgan (qizil)');

  // Kuchli va zaif tomonlar
  const strengths = Object.entries(skills)
    .filter(([, v]) => v === 'high')
    .map(([k]) => k);
  const weaknesses = Object.entries(skills)
    .filter(([, v]) => v === 'low')
    .map(([k]) => k);

  const aiText = buildAIText(studentName, overallColor, strengths, weaknesses, errorsList);

  return {
    sid: studentSid,
    name: studentName,
    overallColor,
    totalErrors,
    avgTimeRatio,
    helpCount,
    stepColors,
    skills,
    errors: errorsList,
    strengths,
    weaknesses,
    aiText,
    confirmed: false,
  };
}

function buildAIText(name, color, strengths, weaknesses, errors) {
  const colorText =
    color === 'green'
      ? "Ajoyib! Barcha bosqichlar me'yoriy vaqtda va kam xatolik bilan bajarildi."
      : color === 'yellow'
        ? "Yaxshi natija, lekin bir necha joyda xatolar yoki vaqt yo'qotilgan."
        : "Qayta ishlash kerak. Ko'p xatolar yoki ko'p vaqt sarflangan, yordam so'ralgan.";

  const strongText = strengths.length
    ? `Kuchli tomonalar: ${strengths.join(', ')}.`
    : 'Kuchli tomonalar aniqlanmadi.';
  const weakText = weaknesses.length
    ? `Zaif tomonalar: ${weaknesses.join(', ')}.`
    : 'Zaif tomonalar aniqlanmadi.';
  const errText = errors.length ? `Xatolar: ${errors.join('; ')}.` : "Xatolar yo'q.";

  return `${name} uchun diagnostika xulosa: ${colorText} ${strongText} ${weakText} ${errText}`;
}
