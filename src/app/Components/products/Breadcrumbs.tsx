"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoChevronForward } from 'react-icons/io5';

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Build and sanitize segments: remove empty, 'undefined'/'null', and segments that decode to only punctuation/whitespace
  const raw = pathname?.split('/')?.filter(Boolean) ?? [];
  const segments = raw.filter((s) => {
    if (!s) return false;
    if (s === 'undefined' || s === 'null') return false;
    let decoded = s;
    try {
      decoded = decodeURIComponent(s);
    } catch (_) {
      decoded = s;
    }
    if (decoded.trim() === '') return false;
    // Skip segments that are only non-word chars (punctuation, dashes, underscores, spaces)
    if (/^[\W_]+$/.test(decoded)) return false;
    return true;
  });

  // If on a non-root page and no segments, don't render
  if (pathname !== '/' && segments.length === 0) {
    return null;
  }

  const formatDisplayText = (segment: string) => {
    try {
      return decodeURIComponent(segment)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    } catch {
      return segment;
    }
  };

  const items: { display: string; href: string }[] = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (!seg) continue;

    // When encountering the "category" or "subcategory" token, render the token itself
    // (e.g. "Category") and also render the next segment (the actual name) if present.
    if (seg === 'category' || seg === 'subcategory') {
      // push the token label (e.g. "Category")
      const hrefToken = '/' + segments.slice(0, i + 1).map(s => encodeURIComponent(s)).join('/');
      items.push({ display: formatDisplayText(seg), href: hrefToken });

      // push the name that follows (e.g. "Automotive") and include both parts in the href
      const name = segments[i + 1];
      if (name && name !== 'undefined' && name !== 'null') {
        const hrefName = '/' + segments.slice(0, i + 2).map(s => encodeURIComponent(s)).join('/');
        items.push({ display: formatDisplayText(name), href: hrefName });
        i++; // skip the name we consumed
      }
      continue;
    }

    const href = '/' + segments.slice(0, i + 1).map(s => encodeURIComponent(s)).join('/');
    items.push({ display: formatDisplayText(seg), href });
  }

  return (
    <nav className="bg-white py-2 sm:py-3 px-3 sm:px-4 border-b border-gray-200" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto">
        <ol className="flex flex-wrap items-center gap-1 sm:gap-2">
          {/* Home link */}
          <li>
            <Link
              href="/"
              className="text-sm sm:text-base text-gray-600 hover:text-cyan-600 transition-colors duration-200"
              aria-label="Go to homepage"
            >
              Home
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.display}-${index}`} className="flex items-center gap-1 sm:gap-2">
                <IoChevronForward
                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
                  aria-hidden="true"
                />
                {isLast ? (
                  <span className="text-sm sm:text-base text-cyan-600 font-medium break-words" aria-current="page">
                    {item.display}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm sm:text-base text-gray-600 hover:text-cyan-600 transition-colors duration-200 break-words"
                    aria-label={`Go to ${item.display}`}
                  >
                    {item.display}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}