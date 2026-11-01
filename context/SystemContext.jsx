import React, { createContext, useContext } from 'react';

// 'school' — Maktab tizimi (5-11 sinf), 'institute' — Institut tizimi (oliy ta'lim)
export const SystemContext = createContext('school');

export const SystemProvider = SystemContext.Provider;

export const useSystem = () => useContext(SystemContext);

// Institut tizimida tanlangan fan (masalan: Fizika, Matematika...)
export const SubjectContext = createContext(null);

export const SubjectProvider = SubjectContext.Provider;

export const useSubject = () => useContext(SubjectContext);
