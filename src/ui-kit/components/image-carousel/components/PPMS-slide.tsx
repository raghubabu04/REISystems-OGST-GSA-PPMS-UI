/** @jsx jsx */
import React from 'react'
import { css, jsx } from '@emotion/core'

const PPMSSlide = ({ content, width, enlargeImage }) => (

    <img
    onClick={enlargeImage.bind(this, content)}
    src={content}
    css={css`
      height: 100%;
      width: 648px;
      image-rendering: pixelated;
      cursor: pointer;
    `}
    >

    </img>
)

export default PPMSSlide
