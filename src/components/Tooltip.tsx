'use client';

import { useState } from 'react';

interface Props {
  content: string;
  children: React.ReactNode;
  disabled?: boolean;
  align?: 'left' | 'right' | 'center';
}

/**
 * White tooltip bubble — shows full uncompacted value on hover.
 * Bubble appears ABOVE the element; arrow points DOWN toward the element.
 * Matches the demo video exactly.
 */
export default function Tooltip({ content, children, disabled, align = 'right' }: Props) {
  const [show, setShow] = useState(false);
  if (disabled) return <>{children}</>;

  const alignClass =
    align === 'left'   ? 'left-0'   :
    align === 'center' ? 'left-1/2 -translate-x-1/2' :
                         'right-0';

  const arrowAlign =
    align === 'left'   ? 'justify-start pl-3' :
    align === 'center' ? 'justify-center'      :
                         'justify-end pr-3';

  return (
    <div
      className="relative inline-block cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
        <div className={`absolute z-50 bottom-full mb-1 ${alignClass} pointer-events-none select-none`}>
          {/* White bubble */}
          <div className="bg-white text-gray-900 text-xs font-semibold
            px-3 py-2 rounded-xl shadow-2xl whitespace-nowrap
            border border-black/8 drop-shadow-lg">
            {content}
          </div>
          {/* Arrow pointing DOWN toward the hovered value */}
          <div className={`flex ${arrowAlign} -mt-px`}>
            <div className="w-2.5 h-2.5 bg-white rotate-45
              border-r border-b border-black/8
              shadow-sm -mt-1.5" />
          </div>
        </div>
      )}
    </div>
  );
}
