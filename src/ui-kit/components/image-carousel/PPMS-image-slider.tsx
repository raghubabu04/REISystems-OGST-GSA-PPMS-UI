import React from "react";
import PPMSThumbnails from "./components/PPMS-thumbnails";
import PPMSDots from "./components/PPMS-dots";
import { PPMSImageModal } from "../common/PPMS-Image-modal";
import { isEmptyCheck } from "../../../app/user-profile/SalesProfile/profile-sales-validations/UserProfileForAddEditSalesUserValidations";
export interface PPMSImageSliderProps {
  images: any;
  names?: any;
  width?: any;
  height?: any;
  descriptions?: any;
  imageSlideType?: any;
  autoPlaySpeed?: string;
}
export interface PPMSImageModalState {
  activeSlide: any;
  thumbNailScroll: any;
  enlargeImage?: any;
  intervalId?: any;
  timer?: any;
  link?: any;
}

export class PPMSImageSlider extends React.Component<
  PPMSImageSliderProps,
  PPMSImageModalState
> {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
      thumbNailScroll: {},
      intervalId: "",
      timer: this.props.autoPlaySpeed,
      link: "",
    };
    this.handleLeft = this.handleLeft.bind(this);
    this.handleRight = this.handleRight.bind(this);
    this.manageThumbNailClick = this.manageThumbNailClick.bind(this);
    this.manageDots = this.manageDots.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.enlargeImage = this.enlargeImage.bind(this);
  }

  componentDidMount = () => {
    if (!isEmptyCheck(this.props.autoPlaySpeed)) {
      let intervalId = setInterval(this.autoPlay, this.state.timer);
      this.setState({ intervalId: intervalId });
    }
  };

  componentWillUnmount = () => {
    if (!isEmptyCheck(this.props.autoPlaySpeed)) {
      window.clearInterval(this.state.intervalId);
    }
  };

  autoPlay = () => {
    this.handleRight();
  };

  resetInterval = () => {
    if (!isEmptyCheck(this.props.autoPlaySpeed)) {
      window.clearInterval(this.state.intervalId);
      let intervalId = setInterval(this.autoPlay, this.state.timer);
      this.setState({ intervalId: intervalId });
    }
  };

  handleLeft = () => {
    this.resetInterval();
    let activeSlide = this.state.activeSlide;
    this.setState({
      activeSlide:
        activeSlide === 0 ? this.props.images.length - 1 : activeSlide - 1,
    });
    if (this.props.images.length > 3) {
      let autoScrollWidth =
        activeSlide === 0 ? this.props.images.length - 1 : activeSlide - 1;
      if (autoScrollWidth <= this.props.images.length - 3) {
        this.setState({
          thumbNailScroll: {
            transform: `translate3d(${autoScrollWidth * 75 * -1}px, 0, 0)`,
            transition: `transform 400ms ease-out`,
          },
        });
      } else {
        this.setState({
          thumbNailScroll: {
            transform: `translate3d(${
              (this.props.images.length - 3) * 75 * -1
            }px, 0, 0)`,
            transition: `transform 400ms ease-out`,
          },
        });
      }
    }
  };

  handleRight = () => {
    this.resetInterval();
    let activeSlide = this.state.activeSlide;
    this.setState({
      activeSlide:
        activeSlide === this.props.images.length - 1 ? 0 : activeSlide + 1,
    });
    if (this.props.images.length > 3) {
      let autoScrollWidth =
        activeSlide === this.props.images.length - 1 ? 0 : activeSlide + 1;
      if (autoScrollWidth <= this.props.images.length - 3) {
        this.setState({
          thumbNailScroll: {
            transform: `translate3d(${autoScrollWidth * 75 * -1}px, 0, 0)`,
            transition: `transform 400ms ease-out`,
          },
        });
      } else {
        this.setState({
          thumbNailScroll: {
            transform: `translate3d(${
              (this.props.images.length - 3) * 75 * -1
            }px, 0, 0)`,
            transition: `transform 400ms ease-out`,
          },
        });
      }
    }
  };

  manageThumbNailClick = (index, i) => {
    this.setState({
      activeSlide: index,
    });
    if (this.props.images.length > 3) {
      if (index <= this.props.images.length - 3) {
        this.setState({
          thumbNailScroll: {
            transform: `translate3d(${index * 75 * -1}px, 0, 0)`,
            transition: `transform 400ms ease-out`,
          },
        });
      } else {
        this.setState({
          thumbNailScroll: {
            transform: `translate3d(${
              (this.props.images.length - 3) * 75 * -1
            }px, 0, 0)`,
            transition: `transform 400ms ease-out`,
          },
        });
      }
    }
  };

  manageDots = (index, i) => {
    this.setState({
      activeSlide: index,
    });

    if (index <= this.props.images.length - 3) {
      this.setState({
        thumbNailScroll: {
          transform: `translate3d(${index * 75 * -1}px, 0, 0)`,
          transition: `transform 400ms ease-out`,
        },
      });
    } else {
      this.setState({
        thumbNailScroll: {
          transform: `translate3d(${
            (this.props.images.length - 3) * 75 * -1
          }px, 0, 0)`,
          transition: `transform 400ms ease-out`,
        },
      });
    }
  };

  getImageStyle(index) {
    let displayImage = "none";
    if (index === this.state.activeSlide) {
      displayImage = "block";
    }
    return {
      display: displayImage,
    };
  }

  handleClose = () => {
    this.setState({
      enlargeImage: false,
    });
  };

  enlargeImage = () => {
    this.setState({
      enlargeImage: true,
    });
  };

  getImageSrc = (image: any) => {
    switch (this.props.imageSlideType) {
      case "banner":
        return image.preSignedUrl;
      default:
        return image;
    }
  };

  getImageAlt = (image: any) => {
    switch (this.props.imageSlideType) {
      case "banner":
        return image.bannerDescription;
      default:
        return "Slider Image";
    }
  };

  getImageClass = () => {
    switch (this.props.imageSlideType) {
      case "banner":
        return "imageSliderFull";
      default:
        return "imageSlider";
    }
  };

  getRightArrowClass = () => {
    switch (this.props.imageSlideType) {
      case "banner":
        return "rightArrowImageSliderFull";
      default:
        return "rightArrowImageSlider";
    }
  };

  getLeftArrowClass = () => {
    switch (this.props.imageSlideType) {
      case "banner":
        return "leftArrowImageSliderFull";
      default:
        return "leftArrowImageSlider";
    }
  };

  isThumbnailEnabled = () => {
    return this.props.imageSlideType !== "banner";
  };

  isImageModalEnabled = () => {
    return this.props.imageSlideType !== "banner";
  };

  onClick = (image: any) => {
    switch (this.props.imageSlideType) {
      case "banner":
        return () => window.open(image.linkUrl, "_blank");
      default:
        return this.enlargeImage;
    }
  };

  render() {
    let imageModal;
    if (this.state.enlargeImage && this.isImageModalEnabled()) {
      imageModal = (
        <PPMSImageModal
          handleNext={this.handleRight}
          handlePrevious={this.handleLeft}
          size={"xl"}
          body={
            <div>
              {this.props.images.map((image, i) => (
                <img
                  style={this.getImageStyle(i)}
                  alt={"Modal Image"}
                  src={image}
                  width={this.props.width}
                  height={this.props.height}
                  className={"image-gallery-modal-focus"}
                />
              ))}
            </div>
          }
          id={"image-enlarged"}
          show={true}
          title={this.props.names[this.state.activeSlide]}
          handleClose={this.handleClose}
        />
      );
    }

    return (
      <div>
        <div className={"imageSliderPadding"}>
          {this.props.images.map((image, i) => (
            <img
              key={`${i}-slider-image`}
              className={this.getImageClass()}
              style={this.getImageStyle(i)}
              src={this.getImageSrc(image)}
              alt={this.getImageAlt(image)}
              onClick={this.onClick(image)}
              width={this.props.width}
              height={this.props.height}
            />
          ))}
        </div>
        <a className={this.getLeftArrowClass()} onClick={this.handleLeft}>
          &#10094;
        </a>
        <a className={this.getRightArrowClass()} onClick={this.handleRight}>
          &#10095;
        </a>
        <PPMSDots
          slides={this.props.images}
          activeSlide={this.state.activeSlide}
          handleClick={this.manageDots}
          containerStyle={"full"}
        />
        {this.isThumbnailEnabled() && (
          <div className="scrollMenu2">
            <PPMSThumbnails
              slides={this.props.images}
              activeSlide={this.state.activeSlide}
              thumbnailClick={this.manageThumbNailClick}
              thumbNailScroll={this.state.thumbNailScroll}
            />
          </div>
        )}
        {this.isImageModalEnabled() && imageModal}
      </div>
    );
  }
}
