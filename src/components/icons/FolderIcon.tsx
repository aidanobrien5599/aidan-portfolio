interface FolderIconProps {
  size?: number;
  style?: React.CSSProperties;
}

export function FolderIcon({ size = 24, style }: FolderIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 56"
      style={style}
      aria-hidden="true"
    >
      <path d="M2 10 h22 l6 8 h40 v4 H2 z" fill="#d9a441" />
      <rect x="2" y="18" width="68" height="34" rx="3" fill="#d9a441" />
      <path d="M2 26 h68 l-6 26 H8 z" fill="#f2c14e" />
    </svg>
  );
}
