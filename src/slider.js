import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';

const wrapperStyle = {
  WebkitTransform: 'translate3d(0, 0, 0)',
  transform: 'translate3d(0, 0, 0)',
  height: '100%',
};

export default class Slider extends Component {
  handleMotionRest = () => {
    const { onPage } = this.props;
    onPage();
  }

  updateStyle(value) {
    // https://github.com/chenglou/react-motion/issues/322
    // onRest in react-motion doesn't trigger re-render
    // here we could determine whether the previous animation has ended
    // by checking out if currentStyle === lastStyle && nextStyle === initialStyle
    const { style, pageHeight, pageIndex } = this.props;

    const { offset } = value;

    if (Math.abs(style.offset) === Math.abs(pageHeight)) {
      return {
        height: pageHeight,
        WebkitTransform: `translate3d(0, ${style.offset}, 0)`,
        transform: `translate3d(0, ${style.offset}, 0)`,
      };
    }

    const calcOffset = `${Math.abs(offset) === pageHeight && style.offset === 0
      ? -pageHeight * pageIndex
      : -pageHeight * pageIndex + offset}`;

    const { val } = style.offset;
    let adjustedOffset = calcOffset;

    if (val) {
      adjustedOffset = Math.abs(calcOffset) > Math.abs(val) ? calcOffset - val : calcOffset - pageHeight;
    }

    const newOffset = `${adjustedOffset}px`;

    return {
      height: pageHeight,
      WebkitTransform: `translate3d(0, ${newOffset}, 0)`,
      transform: `translate3d(0, ${newOffset}, 0)`,
    };
  }

  render() {
    const { style, children } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <Motion style={style} onRest={this.handleMotionRest}>
          {value => (
            <div
              style={Object.assign({}, wrapperStyle, this.updateStyle(value))}
            >
              {children}
            </div>
          )}
        </Motion>
      </div>
    );
  }
}

Slider.propTypes = {
  pageIndex: PropTypes.number.isRequired,
  pageHeight: PropTypes.number.isRequired,
  onPage: PropTypes.func,
  children: PropTypes.any,
  style: PropTypes.object,
};

Slider.defaultProps = {
  pageIndex: 0,
  style: {
    offset: 0,
  },
  onPage: () => {},
};
