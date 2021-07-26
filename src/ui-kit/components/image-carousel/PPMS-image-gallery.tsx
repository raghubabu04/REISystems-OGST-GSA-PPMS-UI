import React from "react";
import { PPMSImageModal } from "../common/PPMS-Image-modal";
export interface PPMSImageGalleryProps {
  images: any;
  names: any;
  width?: any;
  height?: any;
}
export interface PPMSImageGalleryState {
  activeSlide: any;
  thumbNailScroll: any;
  enlargeImage?: any;
}

export class PPMSImageGallery extends React.Component<
  PPMSImageGalleryProps,
  PPMSImageGalleryState
> {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
      thumbNailScroll: {},
    };
    this.handleLeft = this.handleLeft.bind(this);
    this.handleRight = this.handleRight.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.enlargeImage = this.enlargeImage.bind(this);
  }

  handleLeft = () => {
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

  enlargeImage = (index) => {
    this.setState({
      enlargeImage: true,
      activeSlide: index,
    });
  };

  render() {
    let imageModal;
    if (this.state.enlargeImage) {
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
                  src={image.preSignedURI}
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
        <aside className={"thumbsContainer"}>
          {this.props.images.map((image, i) => (
            <div className={"thumb"} key={image.name}>
              <div className={"thumbInner"}>
                <img
                  src={image.preSignedURI}
                  className={"thumbImage"}
                  onClick={() => this.enlargeImage(i)}
                />
              </div>
            </div>
          ))}
        </aside>
        {imageModal}
      </div>
    );
  }
}
