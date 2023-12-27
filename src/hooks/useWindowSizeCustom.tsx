import { useEffect, useState } from "react";

interface WindowSizeProps {
  width: number;
  height: number;
}

const useWindowSizeCustom = () => {
  const [windowSize, setWindowSize] = useState<WindowSizeProps>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth <= 390) {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
        else {
            setWindowSize({
                width: 373,
                height: 373,
              });
        }
      };

      window.addEventListener("resize", handleResize);

      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    } else {
      return () =>
        window.removeEventListener("resize", () => {
          return null;
        });
    }
  }, [windowSize.width]); // Run when the width of windowSize changes

  return windowSize;
};

export default useWindowSizeCustom;