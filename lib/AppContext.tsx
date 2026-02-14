'use client';

import { createContext } from 'react';

export const AppContext = createContext({
    showPdfModal: false,
    setShowPdfModal: (value: boolean) => {},
    COLORS: ['#00D9C0', '#00B8D9', '#7C3AED', '#F59E0B', '#EF4444']
});
