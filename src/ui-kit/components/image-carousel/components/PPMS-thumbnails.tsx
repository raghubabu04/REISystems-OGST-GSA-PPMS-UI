import React from "react";
const PPMSThumbnails = ({
  slides,
  activeSlide,
  thumbnailClick,
  thumbNailScroll,
}) => {
  if (thumbNailScroll) {
    return (
      <div
        className="image-gallery-thumbnails-container"
        style={thumbNailScroll}
      >
        {slides.map((slide, index) => (
          <button
            key={`${index}-thumb`}
            type={"button"}
            aria-pressed={activeSlide === index}
            className={
              activeSlide === index
                ? "image-gallery-thumbnail active"
                : "image-gallery-thumbnail"
            }
            onClick={thumbnailClick.bind(this, index)}
          >
            <div className={"image-gallery-thumbnail-inner"}>
              <img
                className="image-gallery-thumbnail-image"
                src={slide}
                width={"92"}
                height={"69"}
                alt={"thumbnail"}
              />
            </div>
          </button>
        ))}
      </div>
    );
  } else {
    return (
      <div className="image-gallery-thumbnails-container">
        {slides.map((slide, index) => (
          <button
            type={"button"}
            aria-pressed={activeSlide === index}
            className={
              activeSlide === index
                ? "image-gallery-thumbnail active"
                : "image-gallery-thumbnail"
            }
            onClick={thumbnailClick.bind(this, index)}
          >
            <div className={"image-gallery-thumbnail-inner"}>
              <img
                className="image-gallery-thumbnail-image"
                src={slide}
                alt={"thumbnail"}
              />
            </div>
          </button>
        ))}
      </div>
    );
  }
};

export default PPMSThumbnails;
