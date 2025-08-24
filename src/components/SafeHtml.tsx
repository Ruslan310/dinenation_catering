'use client';

import { ReactNode } from 'react';

interface SafeHtmlProps {
  children: ReactNode;
  lang?: string;
}

export default function SafeHtml({ children, lang = 'en' }: SafeHtmlProps) {
  // suppressHydrationWarning подавляет ошибки гидратации,
  // вызванные браузерными расширениями, которые модифицируют HTML
  return (
    <html lang={lang} suppressHydrationWarning={true}>
      {children}
    </html>
  );
}
