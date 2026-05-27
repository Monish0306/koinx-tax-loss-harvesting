'use client';

interface Props {
  checked: boolean;
  indeterminate?: boolean;
  onChange?: () => void;
  label?: string;
}

/** Reusable accessible checkbox with indeterminate state */
export default function Checkbox({ checked, indeterminate = false, onChange, label }: Props) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={label}
      onClick={e => { e.stopPropagation(); onChange?.(); }}
      className={`w-[18px] h-[18px] rounded border-2 flex-shrink-0
        flex items-center justify-center transition-all duration-150 focus:outline-none
        focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1
        focus-visible:ring-offset-transparent
        ${checked || indeterminate
          ? 'bg-blue-600 border-blue-600'
          : 'border-gray-500 bg-transparent hover:border-blue-400'
        }`}
    >
      {checked && !indeterminate && (
        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {indeterminate && (
        <span className="block w-2.5 h-0.5 bg-white rounded-full" />
      )}
    </button>
  );
}
