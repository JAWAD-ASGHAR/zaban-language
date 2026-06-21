type UrduLogoProps = {
  className?: string;
};

export function UrduLogo({ className = "" }: UrduLogoProps) {
  return (
    <span className={`urdu-logo-wrap-nav ${className}`.trim()}>
      <span className="urdu-logo" lang="ur" dir="rtl">
        زبان
      </span>
    </span>
  );
}
