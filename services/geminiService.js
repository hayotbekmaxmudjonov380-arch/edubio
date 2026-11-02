import { GoogleGenAI, Modality, Type } from "@google/genai";

// Xavfsiz ishga tushirish
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let ai = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey: apiKey });
  } catch (error) {
    console.error("Gemini Client Init Error:", error);
  }
} else {
  console.warn("DIQQAT: VITE_GEMINI_API_KEY topilmadi! .env.local faylini tekshiring va terminalni qayta ishga tushiring.");
}

// System Instruction for Biology Teacher Persona
const BIO_TEACHER_INSTRUCTION = `
Siz EduBio AI, 5-11 sinf o'quvchilari uchun do'stona va aqlli biologiya o'qituvchisisiz.

**MULOQOT USLUBINGIZ (Juda muhim):**
Vaziyatga qarab ohangni o'zgartiring:

1. **ODDIY SUHBAT (Salomlashish, shaxsiy savollar, hazillar):**
   - Juda tabiiy, samimiy va insoniylarcha gapiring.
   - "Robot" kabi rasmiy bo'lmang.
   - Ilmiy atamalarni va maxsus formatlashni (yulduzcha, qavslar) ISHLATMANG.
   - Misol: "Salom! Yaxshimisiz? Bugun qanday qiziqarli narsalarni o'rganamiz?" yoki "Rahmat, o'zim ham yaxshiman. Savolingiz bormi?"

2. **BIOLOGIYA VA FAN (Dars jarayoni, atamalar, rasmlar tahlili):**
   - Professional o'qituvchiga aylaning.
   - Javob aniq, ilmiy va qiziqarli bo'lsin.
   - Quyidagi **FORMATLASH QOIDALARINI** faqat shu paytda ishlating:

**FORMATLASH QOIDALARI (Faqat dars paytida):**
- **Biologik atamalar** uchun ikki tomonlama yulduzcha: **Fotosintez**, **Xlorofill**. (Yashil rang uchun).
- **Muhim faktlar/raqamlar** uchun to'rtburchak qavs: [[6 marta]], [[juda muhim]]. (Sariq rang uchun).
- **Lotincha nomlar/olimlar** uchun oddiy qavs ichida qo'sh qavs: ((Homo Sapiens)), ((Darwin)). (Binafsha rang uchun).

**MAQSAD:** O'quvchi bilan do'st bo'ling, lekin fan haqida gap ketganda eng zo'r ustoz bo'ling.
`;

// System Instruction for Physics & Virtual Lab AI Tutor
const PHYSICS_TEACHER_INSTRUCTION = `
Siz FizLab AI, 7-11 sinf o'quvchilari uchun do'stona va tajribali Fizika va Virtual Laboratoriya AI ustozisiz.

**VAZIFANGIZ:**
- O'quvchining virtual laboratoriya topshiriqlarini real vaqt rejimida nazorat qilish.
- O'quvchi xato qilganda, unga ayblovsiz, xatoning AYNAN SABABINI va mantiqini tushuntirib berish.
- Fizik formulalar, o'lchov birliklari, Arximed kuchi, zichlik, hajm va asboblar bilan ishlashni sodda o'zbek tilida tushuntirish.

**FORMATLASH QOIDALARI:**
- **Fizik atamalar va formulalar** uchun ikki tomonlama yulduzcha: **Arximed kuchi**, **F_bu = P - F1**.
- **Muhim faktlar va birliklar** uchun to'rtburchak qavs: [[Nyuton (N)]], [[kg/m³]].
`;

// Text & Multimodal Chat for Biology
export const generateBioResponse = async (prompt, attachment) => {
  if (!ai) {
    return "Xatolik: API Kalit topilmadi. Iltimos dasturchiga murojaat qiling (.env.local faylini tekshiring).";
  }
  
  try {
    const model = 'gemini-2.5-flash'; 
    const contentParts = [];
    
    if (attachment) {
      contentParts.push({ inlineData: attachment });
    }
    
    const textPrompt = prompt.trim() === '' ? "Ushbu faylni tahlil qilib, mazmunini tushuntirib bering." : prompt;
    contentParts.push({ text: textPrompt });

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: contentParts },
      config: {
        systemInstruction: BIO_TEACHER_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text ? String(response.text) : "Kechirasiz, javobni shakllantira olmadim.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Xatolik yuz berdi. Internetni tekshiring yoki API kalitni yangilang.";
  }
};

// Text & Multimodal Chat for Physics
export const generatePhysicsResponse = async (prompt, attachment) => {
  if (!ai) {
    return "FizLab AI: AI xizmati ulangan emas (VITE_GEMINI_API_KEY). Standart diagnostika rejimi ishlamoqda.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const contentParts = [];

    if (attachment) {
      contentParts.push({ inlineData: attachment });
    }

    const textPrompt = prompt.trim() === '' ? "Ushbu fizik masala yoki faylni tahlil qilib beriring." : prompt;
    contentParts.push({ text: textPrompt });

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: contentParts },
      config: {
        systemInstruction: PHYSICS_TEACHER_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text ? String(response.text) : "Kechirasiz, javobni shakllantira olmadim.";
  } catch (error) {
    console.error("Gemini Physics Error:", error);
    return "Xatolik yuz berdi. Internetni tekshiring yoki API kalitni yangilang.";
  }
};

// Real-time Virtual Laboratory Step Analysis
export const analyzeLabStepRealtimeAI = async ({ step, selectedTools, weightAir, weightLiquid, volume, density, tableData, conclusion }) => {
  if (!ai) return null;

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
O'quvchi 7-sinf "Arximed kuchi" virtual laboratoriyasida ishlamoqda.
Joriy bosqich: ${step}
Tanlangan asboblar: ${JSON.stringify(selectedTools || [])}
Havoda og'irlik: ${weightAir || 'kiritilmagan'}
Suyuqlikda og'irlik: ${weightLiquid || 'kiritilmagan'}
Slayderlar: Hajm V=${volume} sm³, Zichlik ρ=${density} kg/m³
Jadval ma'lumotlari: ${JSON.stringify(tableData || {})}
Xulosa matni: "${conclusion || ''}"

Vazifa: O'quvchining joriy bosqichdagi harakatlarini tahlil qiling.
Agar xato bo'lsa (masalan: noto'g'ri asbob tanlangan, hisob xato, birlik xato), xatoning AYNAN SABABINI o'zbek tilida 2-3 ta gapda sodda va tushunarli qilib tushuntiring.
Agar xato bo'lsa, uni rag'batlantiring va keyingi mantiqiy qadamni ayting.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: PHYSICS_TEACHER_INSTRUCTION,
        temperature: 0.5,
      },
    });

    return response.text ? String(response.text) : null;
  } catch (error) {
    console.error("Realtime Lab Analysis Error:", error);
    return null;
  }
};

// Generate Personalized Learning Roadmap (Yo'l Haritasi)
export const generateLearningRoadmapAI = async (studentName, studentData, diagnosticResult) => {
  if (!ai) return null;

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
O'quvchi ${studentName} "Arximed kuchi" laboratoriyasini tugatdi.
Diagnostika natijalari:
- Umumiy daraja (rang): ${diagnosticResult?.overallColor || 'sariq'}
- Jami xatolar: ${diagnosticResult?.totalErrors || 0}
- Sarflangan vaqt nisbati: ${diagnosticResult?.avgTimeRatio || 1}
- Aniqlangan xatolar ro'yxati: ${JSON.stringify(diagnosticResult?.errors || [])}
- Ko'nikmalar: ${JSON.stringify(diagnosticResult?.skills || {})}

Vazifa: Ushbu o'quvchi uchun O'ZLASHTIRISH YO'L HARITASI (Personalized Learning Roadmap) va tavsiyalar tuzib bering.
Javobingizni quyidagi o'zbek tilidagi do'stona va aniq formatda yozing:

1. **Joriy Bilim Darajasi Tahlili**
2. **Nima Sababdan Xatolar Yuz Berganligi (Sabablar Tahlili)**
3. **3 Bosqichli O'zlashtirish Yo'l Haritasi**:
   - **1-Qadam (Nazariya)**: [aniq mavzu va takrorlash vazifasi]
   - **2-Qadam (Amaliyot va Asboblar)**: [simulyatsiya va tajriba mashqi]
   - **3-Qadam (Hisoblash va Birliklar)**: [masalalar va formulalar bilan ishlash]
4. **AI Ustoz Tavsiyasi**
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: PHYSICS_TEACHER_INSTRUCTION,
        temperature: 0.6,
      },
    });

    return response.text ? String(response.text) : null;
  } catch (error) {
    console.error("Roadmap Generation Error:", error);
    return null;
  }
};

// Image Generation
export const generateBioImage = async (prompt) => {
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Generate a scientific illustration for education: ${prompt}` }]
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

// Text-to-Speech (TTS)
export const generateSpeech = async (text) => {
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }
    return null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
