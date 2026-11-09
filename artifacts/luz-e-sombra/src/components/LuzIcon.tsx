/** Ícone de luz acesa/apagada no estilo do portal. */
export function LuzIcon({
  acesa,
  className = "w-5 h-5",
}: {
  acesa: boolean;
  className?: string;
}) {
  if (acesa) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
      >
        <path
          d="M12 3.2c-2.9 0-5.3 2.3-5.3 5.2 0 1.7.8 3.2 2.1 4.2v1.9c0 .6.5 1.1 1.1 1.1h4.2c.6 0 1.1-.5 1.1-1.1v-1.9c1.3-1 2.1-2.5 2.1-4.2 0-2.9-2.4-5.2-5.3-5.2Z"
          fill="#c8a56b"
          opacity="0.95"
        />
        <path
          d="M10.2 16.6h3.6v.7c0 .9-.7 1.6-1.6 1.6h-.4c-.9 0-1.6-.7-1.6-1.6v-.7Z"
          fill="#9c7742"
        />
        <path d="M10.6 19h2.8v.6a1.4 1.4 0 0 1-1.4 1.4h0a1.4 1.4 0 0 1-1.4-1.4V19Z" fill="#c8a56b" />
        <path d="M12 2v1.2" stroke="#e8d5b0" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M6.2 5.2 7.1 6" stroke="#e8d5b0" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M17.8 5.2 16.9 6" stroke="#e8d5b0" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M4.8 10.2H6" stroke="#e8d5b0" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M18 10.2h1.2" stroke="#e8d5b0" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M12 3.2c-2.9 0-5.3 2.3-5.3 5.2 0 1.7.8 3.2 2.1 4.2v1.9c0 .6.5 1.1 1.1 1.1h4.2c.6 0 1.1-.5 1.1-1.1v-1.9c1.3-1 2.1-2.5 2.1-4.2 0-2.9-2.4-5.2-5.3-5.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10.2 16.6h3.6v.7c0 .9-.7 1.6-1.6 1.6h-.4c-.9 0-1.6-.7-1.6-1.6v-.7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M10.6 19h2.8v.6a1.4 1.4 0 0 1-1.4 1.4h0a1.4 1.4 0 0 1-1.4-1.4V19Z" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
