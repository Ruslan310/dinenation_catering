'use client';

import { ReactNode } from 'react';

interface SafeBodyProps {
  children: ReactNode;
  className?: string;
}

export default function SafeBody({ children, className }: SafeBodyProps) {
  // suppressHydrationWarning подавляет ошибки гидратации,
  // вызванные браузерными расширениями, которые модифицируют body
  return (
    <body className={className} suppressHydrationWarning={true}>
      {children}
    </body>
  );
}
