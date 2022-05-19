import React from 'react'
import { sel, noop } from 'test-utility'
import ScrollElement from 'lib/scroll/ScrollElement'
import {fireEvent, render} from "@testing-library/react";

const defaultProps = {
  width: 1000,
  height: 800,
  onZoom: noop,
  onWheelZoom: noop,
  onScroll: noop,
  traditionalZoom: false,
  scrollRef: noop,
  isInteractingWithItem: false,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseEnter: noop,
  onContextMenu: noop
}

const createMouseEvent = pageX => ({
  button: 0,
  pageX,
  preventDefault: noop
})

const scrollElementSelector = sel('scroll-element')

xdescribe('ScrollElement', () => {
  describe('mouse event delegates', () => {
    let onDoubleClickMock,
      onMouseLeaveMock,
      onMouseMoveMock,
      onMouseEnterMock,
      onContextMenuMock,
      container

    beforeEach(() => {
      onDoubleClickMock = jest.fn()
      onMouseLeaveMock = jest.fn()
      onMouseMoveMock = jest.fn()
      onMouseEnterMock = jest.fn()
      onContextMenuMock = jest.fn()

      const props = {
        ...defaultProps,
        onDoubleClick: onDoubleClickMock,
        onMouseLeave: onMouseLeaveMock,
        onMouseMove: onMouseMoveMock,
        onMouseEnter: onMouseEnterMock,
        onContextMenu: onContextMenuMock
      }

      container = render(
        <ScrollElement {...props}>
          <div />
        </ScrollElement>
      ).container;
    })

    it('scroll element onMouseLeave calls passed in onMouseLeave', () => {
      fireEvent.mouseLeave(container.querySelector(scrollElementSelector));
      expect(onMouseLeaveMock).toHaveBeenCalledTimes(1)
    })
    it('scroll element onMouseMove calls passed in onMouseMove', () => {
      fireEvent.mouseMove(container.querySelector(scrollElementSelector));
      expect(onMouseMoveMock).toHaveBeenCalledTimes(1)
    })
    it('scroll element onMouseEnter calls passed in onMouseEnter', () => {
      fireEvent.mouseEnter(container.querySelector(scrollElementSelector));
      expect(onMouseEnterMock).toHaveBeenCalledTimes(1)
    })
    it('scroll element onContextMenu calls passed in onContextMenu', () => {
      fireEvent.contextMenu(container.querySelector(scrollElementSelector));
      expect(onContextMenuMock).toHaveBeenCalledTimes(1)
    })
  })
  describe('mouse drag', () => {
    let container

    beforeEach(() => {
      container = render(
        <ScrollElement {...defaultProps}>
          <div />
        </ScrollElement>
      ).container
    })
    it('scrolls left', () => {
      const originX = 100
      const destinationX = 200

      const scrollDifference = -(destinationX - originX)

      const mouseDownEvent = createMouseEvent(originX)
      const mouseOverEvent = createMouseEvent(destinationX)

      container.firstElementChild.scrollComponent.scrollLeft = originX

      const scrollElement = container.querySelector(scrollElementSelector);
      fireEvent.mouseDown(scrollElement, mouseDownEvent);
      fireEvent.mouseMove(scrollElement, mouseOverEvent);

      expect(container.firstElementChild.scrollComponent.scrollLeft).toBe(
        originX + scrollDifference
      )
    })

    it('scrolls right', () => {
      const originX = 300
      const destinationX = 100

      const scrollDifference = -(destinationX - originX)

      const mouseDownEvent = createMouseEvent(originX)
      const mouseOverEvent = createMouseEvent(destinationX)

      container.firstElementChild.scrollComponent.scrollLeft = originX

      const scrollElement = container.querySelector(scrollElementSelector);
      fireEvent.mouseDown(scrollElement, mouseDownEvent);
      fireEvent.mouseMove(scrollElement, mouseOverEvent);

      expect(container.firstElementChild.scrollComponent.scrollLeft).toBe(
        originX + scrollDifference
      )
    })
  })

  describe('mouse leave', () => {
    // guard against bug where dragging persisted after mouse leave
    it('cancels dragging on mouse leave', () => {
      const { container } = render(
        <ScrollElement {...defaultProps}>
          <div />
        </ScrollElement>
      )

      const initialScrollLeft = container.firstElementChild.scrollComponent.scrollLeft
      const mouseDownEvent = createMouseEvent(100)
      const mouseLeaveEvent = createMouseEvent(100)
      const mouseMoveEvent = createMouseEvent(200)

      const scrollElement = container.querySelector(scrollElementSelector);
      fireEvent.mouseDown(scrollElement, mouseDownEvent);
      fireEvent.mouseLeave(scrollElement, mouseLeaveEvent);
      fireEvent.mouseMove(scrollElement, mouseMoveEvent);

      // scrollLeft doesnt move
      expect(container.firstElementChild.scrollComponent.scrollLeft).toBe(
        initialScrollLeft
      )
    })
  })

  describe('scroll', () => {
    it('calls onScroll with current scrollLeft', () => {
      const onScrollMock = jest.fn()
      const props = {
        ...defaultProps,
        onScroll: onScrollMock
      }

      const { container } = render(
        <ScrollElement {...props}>
          <div />
        </ScrollElement>
      )
      const scrollLeft = 200
      container.firstElementChild.scrollComponent.scrollLeft = scrollLeft

      fireEvent.scroll(container.querySelector(scrollElementSelector));

      expect(onScrollMock).toHaveBeenCalledTimes(1)
    })
    it('adds width to scrollLeft if scrollLeft is less than half of width', () => {
      const width = 800
      const props = {
        ...defaultProps,
        width
      }

      const { container } = render(
        <ScrollElement {...props}>
          <div />
        </ScrollElement>
      )

      const currentScrollLeft = 300
      container.firstElementChild.scrollComponent.scrollLeft = currentScrollLeft

      fireEvent.scroll(container.firstElementChild);

      expect(container.firstElementChild.scrollComponent.scrollLeft).toBe(
        currentScrollLeft + width
      )
    })
    it('subtracts width from scrollLeft if scrollLeft is greater than one and a half of width', () => {
      const width = 800
      const props = {
        ...defaultProps,
        width
      }

      const { container } = render(
        <ScrollElement {...props}>
          <div />
        </ScrollElement>
      )

      const currentScrollLeft = 1300
      container.firstElementChild.scrollComponent.scrollLeft = currentScrollLeft

      fireEvent.scroll(container.firstElementChild)

      expect(container.firstElementChild.scrollComponent.scrollLeft).toBe(
        currentScrollLeft - width
      )
    })

    it('does not alter scrollLeft if scrollLeft is between 0.5 and 1.5 of width', () => {
      const width = 800
      const props = {
        ...defaultProps,
        width
      }

      const { container } = render(
        <ScrollElement {...props}>
          <div />
        </ScrollElement>
      )

      // three samples between this range
      const scrolls = [width * 0.5 + 1, width, width * 1.5 - 1]

      scrolls.forEach(scroll => {
        container.firstElementChild.scrollComponent.scrollLeft = scroll

        fireEvent.scroll(container.firstElementChild);

        expect(container.firstElementChild.scrollComponent.scrollLeft).toBe(scroll)
      })
    })
  })
})
