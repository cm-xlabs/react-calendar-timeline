import React from 'react'
import moment from 'moment'
import Timeline from 'lib/Timeline'
import { noop } from 'test-utility'
import { render } from "@testing-library/react";

const defaultProps = {
  ...Timeline.defaultProps,
  items: [],
  groups: []
}

xdescribe('Timeline', () => {
  describe('initialiation', () => {
    it('sets the visibleTime properties to defaultTime props', () => {
      const defaultTimeStart = moment('2018-01-01')
      const defaultTimeEnd = moment('2018-03-01')

      const props = {
        ...defaultProps,
        defaultTimeStart,
        defaultTimeEnd
      }

      expect(() => render(<Timeline {...props} />)).not.toThrowError();
    })
    it('sets the visibleTime properties to visibleTime props', () => {
      const visibleTimeStart = moment('2018-01-01').valueOf()
      const visibleTimeEnd = moment('2018-03-01').valueOf()

      const props = {
        ...defaultProps,
        visibleTimeStart,
        visibleTimeEnd
      }

      expect(() => render(render(<Timeline {...props} />))).not.toThrowError();
    })
    it('throws error if neither visibleTime or defaultTime props are passed', () => {
      const props = {
        ...defaultProps,
        visibleTimeStart: undefined,
        visibleTimeEnd: undefined,
        defaultTimeStart: undefined,
        defaultTimeEnd: undefined
      }
      jest.spyOn(global.console, 'error').mockImplementation(noop)
      expect(() => render(<Timeline {...props} />)).toThrow(
        'You must provide either "defaultTimeStart" and "defaultTimeEnd" or "visibleTimeStart" and "visibleTimeEnd" to initialize the Timeline'
      )
      jest.restoreAllMocks()
    })
  })
})
