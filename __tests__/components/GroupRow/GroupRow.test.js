import React from 'react'
import { noop } from 'test-utility'
import GroupRow from 'lib/row/GroupRow'
import {fireEvent, render} from "@testing-library/react";
import userEvent from '@testing-library/user-event'

const defaultProps = {
  onClick: noop,
  onDoubleClick: noop,
  onContextMenu: noop,
  isEvenRow: false,
  clickTolerance: 10,
  style: {},
  group: {}
}

// using mount to be able to interact with element, render
// to assert dom level props (styles, className)
describe('GroupRow', () => {
  it('calls passed in onDoubleClick', async () => {
    const onDoubleClickMock = jest.fn()
    const props = {
      ...defaultProps,
      onDoubleClick: onDoubleClickMock
    }

    const { container } = render(<GroupRow {...props} />)

    const user = userEvent.setup();
    await user.dblClick(container.firstChild);

    expect(onDoubleClickMock).toHaveBeenCalledTimes(1)
  })

  it('calls passed in onClick', async () => {
    const onClickMock = jest.fn()
    const props = {
      ...defaultProps,
      onClick: onClickMock
    }

    const { container } = render(<GroupRow {...props} />)

    const user = userEvent.setup();
    await user.click(container.firstChild);

    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  it('calls passed in onContextMenu', () => {
    const onContextMenuMock = jest.fn()
    const props = {
      ...defaultProps,
      onContextMenu: onContextMenuMock
    }

    const { container } = render(<GroupRow {...props} />)

    fireEvent.contextMenu(container.firstChild);

    expect(onContextMenuMock).toHaveBeenCalledTimes(1)
  })
  it('assigns "rct-hl-even" class if isEvenRow is true', () => {
    const props = {
      ...defaultProps,
      isEvenRow: true
    }

    const { container } = render(<GroupRow {...props} />)

    expect(container.firstElementChild.className.trim()).toBe('rct-hl-even')
  })
  it('assigns "rct-hl-odd" if isEvenRow is false', () => {
    const props = {
      ...defaultProps,
      isEvenRow: false
    }

    const { container } = render(<GroupRow {...props} />)

    expect(container.firstElementChild.className.trim()).toBe('rct-hl-odd')
  })
  it('passes style prop to style', () => {
    const props = {
      ...defaultProps,
      style: { border: '1px solid black' }
    }

    const { container } = render(<GroupRow {...props} />)

    expect(container.firstElementChild.style.border).toBe(props.style.border)
  })
})
