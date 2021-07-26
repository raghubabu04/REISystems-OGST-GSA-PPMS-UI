/**@jsx jsx */
import React, { useState, useEffect, useRef } from "react";
import { css, jsx } from "@emotion/core";
import PPMSSliderContent from "./components/PPMS-slider-content";
import PPMSSlide from "./components/PPMS-slide";
import PPMSArrow from "./components/PPMS-arrow";
import PPMSDots from "./components/PPMS-dots";
import PPMSThumbnails from "./components/PPMS-thumbnails";
import { PPMSImageModal } from "../common/PPMS-Image-modal";

const getWidth = () => {
  return 800;
};

/**
 * @function Slider
 */
const PPMSImageCarousal = (props) => {
  const { slides } = props;
  const { names } = props;

  const firstSlide = slides ? slides[0] : "";
  const secondSlide = slides ? slides[1] : "";
  const lastSlide = slides ? slides[slides.length - 1] : "";

  const [state, setState] = useState({
    activeSlide: 0,
    translate: getWidth(),
    transition: 0.45,
    _slides: [lastSlide, firstSlide, secondSlide],
    thumbNailScroll: {},
    isImageEnlarged: false,
    imageSource: "",
    imageDisplayBlock: { display: `none` },
  });

  const {
    activeSlide,
    translate,
    _slides,
    transition,
    thumbNailScroll,
    isImageEnlarged,
  } = state;

  const autoPlayRef = useRef<any>();
  const transitionRef = useRef<any>();
  const resizeRef = useRef<any>();

  useEffect(() => {
    autoPlayRef.current = nextSlide;
    transitionRef.current = smoothTransition;
    resizeRef.current = handleResize;
  });

  useEffect(() => {
    const play = () => {
      autoPlayRef.current();
    };

    const smooth = (e) => {
      if (e.target.className.includes("SliderContent")) {
        transitionRef.current();
      }
    };

    const resize = () => {
      resizeRef.current();
    };

    const transitionEnd = window.addEventListener("transitionend", smooth);
    const onResize = window.addEventListener("resize", resize);

    let interval = null;

    if (props.autoPlay) {
      interval = setInterval(play, props.autoPlay * 1000);
    }

    return () => {
      // @ts-ignore
      window.removeEventListener("transitionend", transitionEnd);
      // @ts-ignore
      window.removeEventListener("resize", onResize);

      if (props.autoPlay) {
        clearInterval(interval);
      }
    };
  }, []);

  useEffect(() => {
    if (transition === 0) setState({ ...state, transition: 0.45 });
  }, [transition]);

  const handleResize = () => {
    setState({ ...state, translate: getWidth(), transition: 0 });
  };

  const smoothTransition = () => {
    let _slides = [];

    // We're at the last slide.
    if (activeSlide === slides.length - 1)
      _slides = [slides[slides.length - 2], lastSlide, firstSlide];
    // We're back at the first slide. Just reset to how it was on initial render
    else if (activeSlide === 0) _slides = [lastSlide, firstSlide, secondSlide];
    // Create an array of the previous last slide, and the next two slides that follow it.
    else _slides = slides.slice(activeSlide - 1, activeSlide + 2);

    setState({
      ...state,
      _slides,
      transition: 0,
      translate: getWidth(),
    });
  };

  const nextSlide = () => {
    let autoScrollWidth =
      activeSlide === slides.length - 1 ? 0 : activeSlide + 1;
    if (autoScrollWidth < slides.length - 3) {
      setState({
        ...state,
        translate: activeSlide == 0 ? 0 : translate + getWidth(),
        activeSlide: activeSlide === slides.length - 1 ? 0 : activeSlide + 1,
        thumbNailScroll: {
          transform: `translate3d(${autoScrollWidth * 90 * -1}px, 0, 0)`,
          transition: `transform 400ms ease-out`,
        },
      });
    } else {
      setState({
        ...state,
        translate: activeSlide == 0 ? 0 : translate + getWidth(),
        activeSlide: activeSlide === slides.length - 1 ? 0 : activeSlide + 1,
        thumbNailScroll: {
          transform: `translate3d(${(slides.length - 3) * 90 * -1}px, 0, 0)`,
          transition: `transform 400ms ease-out`,
        },
      });
    }
  };

  const prevSlide = () => {
    let autoScrollWidth =
      activeSlide === 0 ? slides.length - 1 : activeSlide - 1;
    if (autoScrollWidth < slides.length - 3) {
      setState({
        ...state,
        translate: activeSlide == 0 ? 0 : translate + getWidth(),
        activeSlide: autoScrollWidth,
        thumbNailScroll: {
          transform: `translate3d(${autoScrollWidth * 90 * -1}px, 0, 0)`,
          transition: `transform 400ms ease-out`,
        },
      });
    } else {
      setState({
        ...state,
        translate: activeSlide == 0 ? 0 : translate + getWidth(),
        activeSlide: autoScrollWidth,
        thumbNailScroll: {
          transform: `translate3d(${(slides.length - 3) * 90 * -1}px, 0, 0)`,
          transition: `transform 400ms ease-out`,
        },
      });
    }
  };

  const manageDots = (index, i) => {
    if (index < slides.length - 3) {
      setState({
        ...state,
        translate: activeSlide == 0 ? 0 : translate + getWidth(),
        activeSlide: index,
        thumbNailScroll: {
          transform: `translate3d(${index * 90 * -1}px, 0, 0)`,
          transition: `transform 400ms ease-out`,
        },
      });
    } else {
      setState({
        ...state,
        translate: activeSlide == 0 ? 0 : translate + getWidth(),
        activeSlide: index,
        thumbNailScroll: {
          transform: `translate3d(${(slides.length - 3) * 90 * -1}px, 0, 0)`,
          transition: `transform 400ms ease-out`,
        },
      });
    }
  };

  const manageThumbNailClick = (index, i) => {
    if (index < slides.length - 3) {
      setState({
        ...state,
        translate: activeSlide == 0 ? 0 : translate + getWidth(),
        activeSlide: index,
        thumbNailScroll: {
          transform: `translate3d(${index * 90 * -1}px, 0, 0)`,
          transition: `transform 400ms ease-out`,
        },
      });
    } else {
      setState({
        ...state,
        translate: activeSlide == 0 ? 0 : translate + getWidth(),
        activeSlide: index,
        thumbNailScroll: {
          transform: `translate3d(${(slides.length - 3) * 90 * -1}px, 0, 0)`,
          transition: `transform 400ms ease-out`,
        },
      });
    }
  };
  const handleClose = () => {
    setState({
      ...state,
      isImageEnlarged: false,
      imageSource: "",
    });
  };

  const getDisplayForImage = (index) => {
    let displayImage = "none";
    if (index == activeSlide) {
      displayImage = "block";
    }
    return {
      display: displayImage,
    };
  };

  const enlargeImage = (content, imageEvent) => {
    setState({
      ...state,
      isImageEnlarged: true,
      imageSource: content,
    });
  };

  if (!isImageEnlarged) {
    return slides && slides.length != 0 ? (
      <div>
        <div css={SliderCSS}>
          <PPMSSliderContent
            translate={translate}
            transition={transition}
            width={getWidth() * _slides?.length}
          >
            {_slides?.map((_slide, i) => (
              <PPMSSlide
                width={getWidth()}
                key={_slide + i}
                content={_slide}
                enlargeImage={enlargeImage}
              />
            ))}
          </PPMSSliderContent>

          <PPMSArrow direction="left" handleClick={prevSlide} />
          <PPMSArrow direction="right" handleClick={nextSlide} />

          <PPMSDots
            slides={slides}
            activeSlide={activeSlide}
            handleClick={manageDots}
          />
        </div>
        <div className="scrollMenu">
          <PPMSThumbnails
            slides={slides}
            activeSlide={activeSlide}
            thumbnailClick={manageThumbNailClick}
            thumbNailScroll={thumbNailScroll}
          />
        </div>
      </div>
    ) : (
      <div></div>
    );
  } else {
    const fullScreenStyle = {
      display: "block",
    };
    return slides && slides.length != 0 ? (
      <div>
        <div css={SliderCSS}>
          <PPMSSliderContent
            translate={translate}
            transition={transition}
            width={getWidth() * _slides?.length}
          >
            {_slides?.map((_slide, i) => (
              <PPMSSlide
                width={getWidth()}
                key={_slide + i}
                content={_slide}
                enlargeImage={enlargeImage}
              />
            ))}
          </PPMSSliderContent>

          <PPMSArrow direction="left" handleClick={prevSlide} />
          <PPMSArrow direction="right" handleClick={nextSlide} />

          <PPMSDots
            slides={slides}
            activeSlide={activeSlide}
            handleClick={manageDots}
          />
        </div>
      </div>
    ) : (
      <div />
    );
  }
};

const SliderCSS = css`
  position: relative;
  height: 30vh;
  width: 36vh;
  margin: 0 auto;
  overflow: hidden;
  white-space: pre-wrap;
`;

export default PPMSImageCarousal;
