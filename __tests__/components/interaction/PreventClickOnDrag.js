import React from 'react'
import { noop } from 'test-utility'
import PreventClickOnDrag from 'lib/interaction/PreventClickOnDrag'
import {fireEvent, render} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const defaultClickTolerance = 10
describe('PreventClickOnDrag', () => {
  it('should prevent click if element is dragged further than clickTolerance pixels forwards', async () => {
    const onClickMock = jest.fn()
    const { container } = render(
      <PreventClickOnDrag
        onClick={onClickMock}
        clickTolerance={defaultClickTolerance}
      >
        <div />
      </PreventClickOnDrag>
    )

    const originalClientX = 100

    fireEvent.mouseDown(container.firstChild, {
      clientX: originalClientX
    })
    fireEvent.mouseUp(container.firstChild, {
      clientX: originalClientX + defaultClickTolerance + 1
    })

    const user = userEvent.setup();
    await user.click(container.firstChild)

    expect(onClickMock).not.toHaveBeenCalled()
  })

  it('should prevent click if element is dragged further than clickTolerance pixels backwards', async () => {
    const onClickMock = jest.fn()
    const { container } = render(
      <PreventClickOnDrag
        onClick={onClickMock}
        clickTolerance={defaultClickTolerance}
      >
        <div />
      </PreventClickOnDrag>
    )
    const originalClientX = 100

    fireEvent.mouseDown(container.firstChild, {
      clientX: originalClientX
    })
    fireEvent.mouseUp(container.firstChild, {
      clientX: originalClientX - defaultClickTolerance - 1
    })
    const user = userEvent.setup();
    await user.click(container.firstChild)

    expect(onClickMock).not.toHaveBeenCalled()
  })
  it('should not prevent click if element is dragged less than clickTolerance pixels forwards', async () => {
    const onClickMock = jest.fn()
    const { container } = render(
      <PreventClickOnDrag
        onClick={onClickMock}
        clickTolerance={defaultClickTolerance}
      >
        <div />
      </PreventClickOnDrag>
    )
    const originalClientX = 100

    fireEvent.mouseDown(container.firstChild, {
      clientX: originalClientX
    })

    fireEvent.mouseUp(container.firstChild, {
      clientX: originalClientX + defaultClickTolerance - 1
    })
    const user = userEvent.setup();
    await user.click(container.firstChild)

    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  it('should not prevent click if element is dragged less than clickTolerance pixels backwards', async () => {
    const onClickMock = jest.fn()
    const { container } = render(
      <PreventClickOnDrag
        onClick={onClickMock}
        clickTolerance={defaultClickTolerance}
      >
        <div />
      </PreventClickOnDrag>
    )
    const originalClientX = 100

    fireEvent.mouseDown(container.firstChild, {
      clientX: originalClientX
    })

    fireEvent.mouseUp(container.firstChild, {
      clientX: originalClientX - defaultClickTolerance + 1
    })
    const user = userEvent.setup();
    await user.click(container.firstChild)

    expect(onClickMock).toHaveBeenCalledTimes(1)
  })
  it('should not prevent click if first interaction was drag but second is click', async () => {
    const onClickMock = jest.fn()
    const { container } = render(
      <PreventClickOnDrag
        onClick={onClickMock}
        clickTolerance={defaultClickTolerance}
      >
        <div />
      </PreventClickOnDrag>
    )

    const originalClientX = 100

    fireEvent.mouseDown(container.firstChild, {
      clientX: originalClientX
    })
    fireEvent.mouseUp(container.firstChild, {
      clientX: originalClientX + defaultClickTolerance + 1
    })
    const user = userEvent.setup();
    await user.click(container.firstChild)

    expect(onClickMock).not.toHaveBeenCalled()

    fireEvent.mouseDown(container.firstChild, {
      clientX: originalClientX
    })
    fireEvent.mouseUp(container.firstChild, {
      clientX: originalClientX + defaultClickTolerance - 1 // less thanthreshold
    })
    await user.click(container.firstChild)

    expect(onClickMock).toHaveBeenCalled()
  })
  it('calls all other event handlers in wrapped component', async () => {
    const doubleClickMock = jest.fn()
    const { container } = render(
      <PreventClickOnDrag
        onClick={jest.fn()}
        clickTolerance={defaultClickTolerance}
      >
        <div onDoubleClick={doubleClickMock} />
      </PreventClickOnDrag>
    )

    const user = userEvent.setup();
    await user.dblClick(container.firstChild)

    expect(doubleClickMock).toHaveBeenCalled()
  })

  it('only allows single children element', () => {
    // dont emit propType error
    jest.spyOn(global.console, 'error').mockImplementation(noop)
    expect(() =>
      render(
        <PreventClickOnDrag
          onClick={noop}
          clickTolerance={defaultClickTolerance}
        >
          <div>hey</div>
          <div>hi</div>
          <div>how are ya </div>
        </PreventClickOnDrag>
      )
    ).toThrowError(
      'React.Children.only expected to receive a single React element child'
    )

    jest.restoreAllMocks()
  })
})
