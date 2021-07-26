import React, { useRef, useState } from "react";
import Carousel from "react-elastic-carousel";
import styled from "styled-components";

interface PPMSCarouselProps {
  items: any;
  itemsToShow: number;
  autoPlaySpeed?: number;
  hidePagination?: boolean;
}

interface PaginationProps {
  direction: string;
  display: string;
}

interface PaginationButtonProps {
  active: boolean;
}

const Pagination = styled.div<PaginationProps>`
  display: ${({ display }) => display};
  flex-direction: ${({ direction }) => direction};
  margin-top: 20px;
`;

const PaginationButton = styled.div<PaginationButtonProps>`
  cursor: pointer;
  transition: all 250ms ease-in;
  background-color: ${({ active }) => (active ? "#000" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "333")};
  transform: scale(1.1);
  border-radius: 50%;
  box-shadow: 0 0 2px 1px #555;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10px;
  height: 10px;
  margin: 0 10px;
`;

export const PPMSCarousel = (props: PPMSCarouselProps) => {
  const carouselRef = useRef(null);

  const onChange = (currentItem: any, curPageIndex: number) => {
    let numberOfPages: number = Math.ceil(props.items.length / 4);
    let lastPageIndex: number = numberOfPages - 1;
    if (curPageIndex === lastPageIndex) {
      startFromBegining(curPageIndex);
    }
  };

  const startFromBegining = (curPageIndex: number) => {
    let timerId = setInterval(() => {
      carouselRef.current.goTo(0);
    }, props.autoPlaySpeed);

    setTimeout(() => {
      clearInterval(timerId);
    }, props.autoPlaySpeed);
  };

  const renderPagination = ({ pages, activePage, onClick }) => {
    return (
      <Pagination
        direction="row"
        display={props.hidePagination ? "none" : "flex"}
      >
        {pages.map((page: number) => {
          const isActivePage = activePage === page;
          return (
            <PaginationButton
              key={page}
              onClick={() => onClick(page.toString())}
              active={isActivePage}
            />
          );
        })}
      </Pagination>
    );
  };

  return (
    <Carousel
      isRTL={false}
      ref={carouselRef}
      itemsToShow={props.itemsToShow}
      itemsToScroll={props.itemsToShow}
      enableAutoPlay={props.autoPlaySpeed ? true : false}
      autoPlaySpeed={props.autoPlaySpeed}
      renderPagination={renderPagination}
      onChange={onChange}
    >
      {props.items}
    </Carousel>
  );
};
