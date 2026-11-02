/**
 * FizLab AI — Logger
 * Har bir o'quvchi harakatini loglaydi (boshqa faylga o'zgartirish kiritilmaydi)
 */

const LOGS_KEY = 'fizlab_logs';

export const FizLabLogger = {
  /**
   * Yangi log yozish
   * @param {string} sid — o'quvchi sessiya IDsi
   * @param {string} type — voqea turi (asbob_tanlandi, parametr_ozgardi, ...)
   * @param {object} data — qo'shimcha ma'lumotlar
   */
  log(sid, type, data = {}) {
    const log = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      sid,
      type,
      data,
      ts: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
      existing.push(log);
      localStorage.setItem(LOGS_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error('FizLabLogger xatolik:', e);
    }

    return log;
  },

  /**
   * Bir o'quvchi barcha loglarini olish
   */
  getLogsBySid(sid) {
    try {
      const all = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
      return all.filter((l) => l.sid === sid).sort((a, b) => a.ts - b.ts);
    } catch (e) {
      return [];
    }
  },

  /**
   * Barcha loglarni olish (o'qituvchi panelida kerak bo'ladi)
   */
  getAllLogs() {
    try {
      return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]').sort((a, b) => a.ts - b.ts);
    } catch (e) {
      return [];
    }
  },

  clear() {
    localStorage.removeItem(LOGS_KEY);
  },
};
