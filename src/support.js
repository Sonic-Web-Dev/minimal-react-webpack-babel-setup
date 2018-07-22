import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { addWheelListener, removeWheelListener } from 'wheel';
import { spring } from 'react-motion';
import Slider from './slider';

class SliderSupport extends Component {
  constructor(props) {
    super(props);
    this.continous = false;
    this.state = {
      isPressed: false,
      isScrolling: false,
      onKeyPress: false,
      pressed: [0, 0],
      delta: [0, 0],
      pageIndex: 0,
    };
  }

  componentDidMount() {
    addWheelListener(document, this.onWheel);
    document.addEventListener('keydown', this.onKeydown);
    document.addEventListener('touchstart', this.start);
    document.addEventListener('touchmove', this.move);
    document.addEventListener('touchend', this.end);
  }

  componentWillUnmount() {
    removeWheelListener(document, this.onWheel);
    document.removeEventListener('keydown', this.onKeydown);
    document.removeEventListener('touchstart', this.start);
    document.removeEventListener('touchmove', this.move);
    document.removeEventListener('touchend', this.end);
  }

    onWheel = (e) => {
      const { deltaY } = e;
      if (deltaY < 0) {
        this.previous();
      } else if (deltaY > 0) {
        this.next();
      }
      if (e.preventDefault) {
        e.preventDefault();
      }
    }

    onKeydown = (e) => {
      if (e.key === 'ArrowUp') {
        this.previous(true);
      } else if (e.key === 'ArrowDown') {
        this.next(true);
      }
    }

    scrollTo = (index, onKeyPress) => {
      const { pageIndex, delta, isScrolling } = this.state;
      const { children, pageHeight } = this.props;
      const pageCount = Children.count(children);

      if (index > pageCount - 1 || isScrolling) {
        return;
      }

      const directional = pageIndex - index;
      const distance = directional * pageHeight;

      const [x] = delta;

      this.setState({
        pageIndex: index,
        delta: [x, distance],
        isScrolling: true,
        onKeyPress,
      });
    }

    previous = (onKeyPress) => {
      const { pageIndex } = this.state;
      if (pageIndex > 0) {
        this.scrollTo(pageIndex - 1, onKeyPress);
      }
    }

    next = (onKeyPress) => {
      const { pageIndex } = this.state;
      const { children } = this.props;
      const pageCount = Children.count(children);
      if (pageIndex < pageCount - 1) {
        this.scrollTo(pageIndex + 1, onKeyPress);
      }
    }

    start = (e) => {
      const source = e.touches ? e.touches[0] : e;
      const { pageX, pageY } = source;
      this.setState({
        isPressed: true,
        pressed: [pageX, pageY],
      });
    }

    move = (e) => {
      const source = e.touches ? e.touches[0] : e;
      const { pageX, pageY } = source;

      if (e.preventDefault) {
        e.preventDefault();
      }

      const { isPressed, pressed } = this.state;

      const [x, y] = pressed;
      if (isPressed) {
        this.setState({
          delta: [pageX - x, pageY - y],
        });
      }
    }

    end = (e) => {
      const { pageHeight, children, springThreashold } = this.props;
      const pageCount = Children.count(children);
      const { pageIndex, delta } = this.state;

      const [x, y] = delta;

      let newDelta = [0, 0];

      let nextPage = pageIndex;

      if (((y > 0 && pageIndex > 0) || (y < 0 && pageIndex < pageCount - 1)) && Math.abs(y) !== pageHeight) {
        if (Math.abs(y) > pageHeight * (springThreashold / 100)) {
          newDelta = [x, y > 0 ? pageHeight : -pageHeight];

          if (newDelta[1] > 0) {
            nextPage = pageIndex - 1;
          } else {
            nextPage = pageIndex + 1;
          }
        } else {
          newDelta = [1, 0];
        }
      }

      if ((y > 0 && pageIndex === 0) || (y < 0 && pageIndex === pageCount - 1)) {
        if (pageHeight > 0) {
          nextPage = 0;
        } else {
          nextPage = pageCount;
        }

        newDelta = [1, 0];
        this.setState({
          isPressed: false,
          delta: newDelta,
        });
        return;
      }

      this.setState({
        isPressed: false,
        delta: newDelta,
        pageIndex: nextPage,
      });
    }

    resetPage = () => {
      this.setState({
        pressed: [0, 0],
        delta: [0, 0],
        isScrolling: false,
        onKeyPress: false,
      });
    }

    handlePage = () => {
      const {
        pageIndex, isPressed, pressed, isScrolling, onKeyPress,
      } = this.state;
      const { onPage } = this.props;

      if (isPressed) {
        return;
      }

      if (pressed[0]) {
        this.resetPage();
      } else if (isScrolling) {
        if (onKeyPress) {
          console.log('onKeyPress')
          this.resetPage();
        } else {
          console.log('scroll')
          clearTimeout(this.scrollTimout);
          this.scrollTimout = setTimeout(() => {
            this.resetPage();
          }, 300);
        }
      }
     // onPage(pageIndex);
    }

    render() {
      let { style } = this.props;
      if (style) {
        console.log('style');
        return (
          <Slider
            ref={(ref) => { (this.slider = ref); }}
            {...this.props}
          />
        );
      }
      const {
        pageIndex, isPressed, isScrolling, delta,
      } = this.state;

      if (isPressed) {
        const [, y] = delta;
        style = {
          offset: y,
        };
      } else if (delta[0] || isScrolling) {
        const [, y] = delta;
        style = {
          offset: spring(y, { stiffness: 300, damping: 30, precision: 1 }),
        };
      } else {
        style = {
          offset: 0,
        };
      }

      return (
        <Slider
          {...this.props}
          ref={(ref) => { (this.slider = ref); }}
          pageIndex={pageIndex}
          style={style}
          onPage={this.handlePage}
        />
      );
    }
}


SliderSupport.propTypes = {
  pageHeight: PropTypes.number,
  onPage: PropTypes.func,
  style: PropTypes.object,
  children: PropTypes.any,
  springThreashold: PropTypes.number,
};
SliderSupport.defaultProps = {
  pageHeight: window.innerHeight,
  onPage: () => {},
  springThreashold: 15,
};


export default SliderSupport;
