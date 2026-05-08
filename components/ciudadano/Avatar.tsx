type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  nombre: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, { wrapper: string; text: string }> = {
  sm: { wrapper: 'w-8 h-8 text-xs', text: 'text-xs' },
  md: { wrapper: 'w-10 h-10 text-sm', text: 'text-sm' },
  lg: { wrapper: 'w-16 h-16 text-xl', text: 'text-xl' },
  xl: { wrapper: 'w-20 h-20 text-2xl', text: 'text-2xl' },
};

export default function Avatar({
  src,
  nombre,
  size = 'md',
  className = '',
}: AvatarProps) {
  const { wrapper } = sizeClasses[size];
  const iniciales = nombre.slice(0, 2).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={nombre}
        referrerPolicy="no-referrer"
        className={`${wrapper} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${wrapper} rounded-full bg-primary flex items-center justify-center flex-shrink-0 ${className}`}
    >
      <span className={`font-semibold text-on-primary leading-none ${sizeClasses[size].text}`}>
        {iniciales}
      </span>
    </div>
  );
}
