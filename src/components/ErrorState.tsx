'use client';

interface Props { message: string; onRetry: () => void; }

/** Reusable error state with retry — satisfies "Loader/Error states" bonus */
export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="bg-[#1A1D27] border border-red-900/40 rounded-2xl
        px-8 py-8 text-center max-w-sm w-full shadow-xl">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-white text-lg font-semibold mb-2">Something went wrong</h2>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800
            text-white rounded-xl text-sm font-semibold transition-colors duration-150"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
