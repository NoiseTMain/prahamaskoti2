export function WaveDivider({ color = '#FFFBF2', flip = false }: { color?: string; flip?: boolean }) {
  return (
    <div className={`wave-divider ${flip ? 'rotate-180' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="h-16 w-full sm:h-24">
        <path
          fill={color}
          d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
        />
      </svg>
    </div>
  )
}
