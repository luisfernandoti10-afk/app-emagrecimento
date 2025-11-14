export default function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Círculo externo */}
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="3" />
      
      {/* Raio/Lightning bolt estilizado */}
      <path
        d="M55 20L35 50H50L45 80L65 50H50L55 20Z"
        fill="currentColor"
      />
      
      {/* Detalhe de fitness - haltere minimalista */}
      <rect x="30" y="48" width="8" height="4" rx="1" fill="currentColor" />
      <rect x="62" y="48" width="8" height="4" rx="1" fill="currentColor" />
      <rect x="38" y="49" width="24" height="2" fill="currentColor" />
    </svg>
  );
}
