import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PPMSScrollToTop() {
  //The useLocation hook returns the location object that represents the current URL.
  const { pathname } = useLocation();

  useEffect(() => {
    //whenver the path changes scroll to the top
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
