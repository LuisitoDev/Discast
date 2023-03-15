import { useState, useEffect, useCallback } from "react";

const useInfiniteScroll = (callback, container) => {
  const [isFetching, setIsFetching] = useState(false);
  // const [container.current, setContainer] = useState(null)

  const onScroll = useCallback(() => {
    if (container.current !== null) {
      if (
        container.current.innerHeight +
          document.documentElement.scrollTop +
          100 <
          document.documentElement.offsetHeight ||
        isFetching
      )
        return;

      setIsFetching(true);
    }
  }, [isFetching]);

  useEffect(() => {
    if (container.current !== null) {
      container.current.addEventListener("scroll", onScroll);
    }
    // return ()=>window.removeEventListener('scroll', onScroll)
  }, [container.current, onScroll]);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching]);

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
