export class PPMSImageEdit {
  static changeHeightWidth(height, maxHeight, width, maxWidth) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
    if (width < maxWidth && height < maxHeight) {
      if (width < height) {
        height = maxHeight;
        width = Math.round((width * maxHeight) / height);
      } else if (height < width) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      } else if (height === width && maxHeight !== maxWidth) {
        if (maxHeight < maxWidth) {
          height = maxHeight;
          width = maxHeight;
        } else if (maxWidth < maxHeight) {
          height = maxWidth;
          width = maxWidth;
        }
      } else {
        height = maxHeight;
        width = maxWidth;
      }
    }
    return { height, width };
  }

  static resizeAndRotateImage(
    image,
    maxWidth,
    maxHeight,
    type = "image/jpeg",
    quality = 100,
    rotation = 0,
    flip = ""
  ) {
    let qualityDecimal = quality / 100;
    let canvas = document.createElement("canvas");

    let width = image.width;
    let height = image.height;

    let newHeightWidth = this.changeHeightWidth(
      height,
      maxHeight,
      width,
      maxWidth
    );
    if (rotation && (rotation === 90 || rotation === 270)) {
      canvas.width = Math.round((height * maxHeight) / width);
      canvas.height = maxHeight;
      width = Math.round((height * maxHeight) / width);
      height = maxHeight;
    } else {
      canvas.width = newHeightWidth.width;
      canvas.height = newHeightWidth.height;
      width = newHeightWidth.width;
      height = newHeightWidth.height;
    }

    let ctx = canvas.getContext("2d");

    if (rotation) {
      ctx.rotate((rotation * Math.PI) / 180);
      if (rotation === 90) {
        ctx.translate(0, -canvas.width);
      } else if (rotation === 180) {
        ctx.translate(-canvas.width, -canvas.height);
      } else if (rotation === 270) {
        ctx.translate(-canvas.height, 0);
      } else if (rotation === 0 || rotation === 360) {
        ctx.translate(0, 0);
      }
    }
    if (rotation && (rotation === 90 || rotation === 270)) {
      ctx.drawImage(image, 0, 0, height, width);
    } else if (flip !== "") {
      if (flip === "vertical") {
        PPMSImageEdit.mirrorImage(ctx, image, 0, 0, true, false);
      } else if (flip === "horizontal") {
        PPMSImageEdit.mirrorImage(ctx, image, 0, 0, false, true);
      }
    } else {
      ctx.drawImage(image, 0, 0, width, height);
    }
    return canvas.toDataURL(type, qualityDecimal);
  }

  static b64toBlob(name, b64Data, contentType) {
    contentType = contentType || "image/jpeg";
    let sliceSize = 512;

    let byteCharacters = atob(
      b64Data.toString().replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
    );
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return new File([blob], name, { type: contentType });
  }

  static createResizedImage(
    file,
    maxWidth,
    maxHeight,
    type,
    quality,
    rotation,
    responseUriFunc,
    outputType = "base64",
    flip = ""
  ) {
    let blob = null;
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        let image = new Image();
        image.src = reader.result.toString();
        image.onload = function () {
          let resizedDataUrl = PPMSImageEdit.resizeAndRotateImage(
            image,
            maxWidth,
            maxHeight,
            type,
            quality,
            rotation,
            flip
          );
          blob = PPMSImageEdit.b64toBlob(file.name, resizedDataUrl, type);
          outputType === "blob"
            ? responseUriFunc(blob)
            : responseUriFunc(resizedDataUrl);
        };
      };
      reader.onerror = (error) => {
        responseUriFunc(error);
      };
    } else {
      responseUriFunc("File Not Found");
    }
  }
  static mirrorImage(
    ctx,
    image,
    x = 0,
    y = 0,
    horizontal = false,
    vertical = false
  ) {
    ctx.save(); // save the current canvas state
    ctx.setTransform(
      horizontal ? -1 : 1,
      0, // set the direction of x axis
      0,
      vertical ? -1 : 1, // set the direction of y axis
      horizontal ? image.width : 0, // set the x origin
      vertical ? image.height : 0 // set the y origin
    );
    ctx.drawImage(image, 0, 0);
    ctx.restore(); // restore the state as it was when this function was called
  }
}
