"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

interface AOSProviderProps {
  children: React.ReactNode;
}

export const AOSProvider: React.FC<AOSProviderProps> = ({ children }) => {
  useEffect(() => {
    AOS.init({
      // Global settings
      duration: 800, // values from 0 to 3000, with step 50ms
      easing: "ease-out-cubic", // default easing for AOS animations
      once: true, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
      anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
      offset: 50, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
      startEvent: "DOMContentLoaded", // name of the event dispatched on the document
      animatedClassName: "aos-animate", // class applied after initialization
      initClassName: "aos-init", // class applied on initialization
      useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
      disableMutationObserver: false, // disables automatic mutations' detections (advanced)
      debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
      throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

      // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
      disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    });

    // Refresh AOS when page loads
    AOS.refresh();

    return () => {
      AOS.refreshHard();
    };
  }, []);

  return <>{children}</>;
};

export default AOSProvider;
