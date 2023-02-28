import { useState, useEffect } from "react";

const useScreenSize = () => {
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
		if (window !== undefined) {
			setWidth(window.innerWidth);
    	setHeight(window.innerHeight);
		}
  };

  return { width, height };
};

export default useScreenSize;