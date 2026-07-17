import { cn } from '@/lib/utils';

type ActionSpinnerSize = 'sm' | 'md' | 'lg';
type ActionSpinnerTone = 'fire' | 'light' | 'muted';

interface ActionSpinnerProps {
  className?: string;
  size?: ActionSpinnerSize;
  tone?: ActionSpinnerTone;
}

const sizeClassMap: Record<ActionSpinnerSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4.5 w-4.5',
  lg: 'h-5 w-5',
};

const toneClassMap: Record<ActionSpinnerTone, string> = {
  fire: 'text-primary',
  light: 'text-primary-foreground',
  muted: 'text-muted-foreground',
};

export function ActionSpinner({
  className,
  size = 'md',
  tone = 'fire',
}: ActionSpinnerProps) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center',
        sizeClassMap[size],
        toneClassMap[tone],
        className,
      )}
      aria-hidden="true"
    >
      <span className="absolute inset-0 rounded-full border-2 border-current/30" />
      <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-current border-r-current" />
      <span className="h-1 w-1 rounded-full bg-current" />
    </span>
  );
}
