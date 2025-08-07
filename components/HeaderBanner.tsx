import React, { useLayoutEffect, useEffect, useState } from 'react';

interface HeaderBannerProps {
  isDark: boolean;
  onVisibilityChange?: (visible: boolean) => void;
}

const HeaderBanner = React.forwardRef<HTMLDivElement, HeaderBannerProps>(
  ({ isDark, onVisibilityChange }, ref) => {
    const [checked, setChecked] = useState(false);
    const [visible, setVisible] = useState(false);

    useLayoutEffect(() => {
      let dismissed = false;
      try {
        dismissed = sessionStorage.getItem('bannerDismissed') === 'true';
      } catch {}
      setVisible(!dismissed);
      setChecked(true);
      onVisibilityChange?.(!dismissed);
    }, []);

    useEffect(() => {
      if (!checked || !visible) return;
      const t = setTimeout(() => {
        setVisible(false);
        onVisibilityChange?.(false);
      }, 60_000);
      return () => clearTimeout(t);
    }, [checked, visible, onVisibilityChange]);

    const handleClose = () => {
      setVisible(false);
      try {
        sessionStorage.setItem('bannerDismissed', 'true');
      } catch {}
      onVisibilityChange?.(false);
    };

    if (!checked || !visible) return null;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Promotional banner"
        className={`
          fixed left-0 right-0 top-0
          z-[60] flex w-full flex-wrap items-center
          justify-between gap-2 px-10 py-4 text-base
          transition-all duration-300
          ${isDark ? 'bg-[#495058] text-white' : 'bg-[#ffffff] text-black'}
        `}
      >
        <div className="flex-1 font-medium">
          Discover faster translations with Unelma-Code!
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className={`
              rounded px-4 py-2 font-semibold transition hover:opacity-90
              ${isDark ? 'bg-white text-[#343232]' : 'bg-[#000000] text-white'}
            `}
          >
            Learn More
          </a>
          <button
            onClick={handleClose}
            aria-label="Close banner"
            className="p-1 transition hover:opacity-90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.586l4.714 4.715a.75.75 0 01-1.06 1.06L12 11.646l-4.715 4.715a.75.75 0 01-1.06-1.06l4.714-4.715-4.714-4.715a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }
);

HeaderBanner.displayName = 'HeaderBanner';

export default HeaderBanner;
