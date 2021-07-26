/** @jsx jsx */
import { css, jsx } from "@emotion/core";

let cssContainerDefault = `transform: translate(-35%, 0%);
position: relative;
bottom: 55px;
left: 120px;
overflow: hidden;
width: 317px;
display: flex;
align-items: center;
justify-content: center;`;

let cssContainerCentralized = `transform: translate(-35%, 0%);
position: relative;
bottom: 15px;
left: 47%;
overflow: hidden;
width: 317px;
display: flex;
align-items: center;
justify-content: center;`;

const getPPMSContainerStyle = (containerStyle: string) => {
  switch (containerStyle) {
    case "full":
      return cssContainerCentralized;
    default:
      return cssContainerDefault;
  }
};

let cssDotsDefault = (activeSlide: string, i: string) => {
  let backgroundColor = activeSlide === i ? "black" : "white";
  let css = `transform: translate(-35%, 0%);
padding: 5px;
margin-right: 5px;
cursor: pointer;
border-radius: 50%;
background: ${backgroundColor}`;
  return css;
};

let cssDotsCentralized = (activeSlide: string, i: string) => {
  let backgroundColor = activeSlide === i ? "black" : "white";
  let css = `transform: translate(-35%, 0%);
padding: 6px;
margin-right: 5px;
cursor: pointer;
border-radius: 50%;
background: ${backgroundColor}`;
  return css;
};

const getPPMSDotsStyle = (
  containerStyle: string,
  activeSlide: string,
  i: string
) => {
  switch (containerStyle) {
    case "full":
      return cssDotsCentralized(activeSlide, i);
    default:
      return cssDotsDefault(activeSlide, i);
  }
};

const PPMSDots = ({
  slides,
  activeSlide,
  handleClick,
  containerStyle = "",
}) => (
  <div
    css={css`
      ${getPPMSContainerStyle(containerStyle)}
    `}
  >
    {slides.map((slide, i) => (
      <span
        key={`${i}-dot`}
        data-key={i}
        onClick={handleClick.bind(this, i)}
        css={css`
          ${getPPMSDotsStyle(containerStyle, activeSlide, i)}
        `}
      />
    ))}
  </div>
);

export default PPMSDots;
