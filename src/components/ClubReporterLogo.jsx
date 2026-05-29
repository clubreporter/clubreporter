import { Link } from 'react-router-dom';

export const LOGO_SRC = '/logo.png';

/**
 * ClubReporter.ie brand logo — use instead of text lockups in headers and auth screens.
 */
export default function ClubReporterLogo({
  className = 'h-9 w-auto',
  linkTo = '/',
  asLink = true,
  onDark = false,
}) {
  const img = (
    <img
      src={LOGO_SRC}
      alt="ClubReporter.ie"
      className={`object-contain object-left ${className}`}
      width={180}
      height={36}
    />
  );

  const content = onDark ? (
    <span className="inline-flex items-center rounded-xl bg-white px-3 py-2 shadow-sm">
      {img}
    </span>
  ) : (
    img
  );

  if (asLink && linkTo) {
    return (
      <Link to={linkTo} className="inline-flex shrink-0 items-center min-h-[44px]">
        {content}
      </Link>
    );
  }

  return content;
}
