'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _wheel = require('wheel');

var _reactMotion = require('react-motion');

var _slider = require('./slider');

var _slider2 = _interopRequireDefault(_slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SliderSupport = function (_Component) {
  _inherits(SliderSupport, _Component);

  function SliderSupport(props) {
    _classCallCheck(this, SliderSupport);

    var _this = _possibleConstructorReturn(this, (SliderSupport.__proto__ || Object.getPrototypeOf(SliderSupport)).call(this, props));

    _this.onWheel = function (e) {
      var deltaY = e.deltaY;

      if (deltaY < 0) {
        _this.previous();
      } else if (deltaY > 0) {
        _this.next();
      }
      if (e.preventDefault) {
        e.preventDefault();
      }
    };

    _this.onKeydown = function (e) {
      if (e.key === 'ArrowUp') {
        _this.previous(true);
      } else if (e.key === 'ArrowDown') {
        _this.next(true);
      }
    };

    _this.scrollTo = function (index, onKeyPress) {
      var _this$state = _this.state,
          pageIndex = _this$state.pageIndex,
          delta = _this$state.delta,
          isScrolling = _this$state.isScrolling;
      var _this$props = _this.props,
          children = _this$props.children,
          pageHeight = _this$props.pageHeight;

      var pageCount = _react.Children.count(children);

      if (index > pageCount - 1 || isScrolling) {
        return;
      }

      var directional = pageIndex - index;
      var distance = directional * pageHeight;

      var _delta = _slicedToArray(delta, 1),
          x = _delta[0];

      _this.setState({
        pageIndex: index,
        delta: [x, distance],
        isScrolling: true,
        onKeyPress: onKeyPress
      });
    };

    _this.previous = function (onKeyPress) {
      var pageIndex = _this.state.pageIndex;

      if (pageIndex > 0) {
        _this.scrollTo(pageIndex - 1, onKeyPress);
      }
    };

    _this.next = function (onKeyPress) {
      var pageIndex = _this.state.pageIndex;
      var children = _this.props.children;

      var pageCount = _react.Children.count(children);
      if (pageIndex < pageCount - 1) {
        _this.scrollTo(pageIndex + 1, onKeyPress);
      }
    };

    _this.start = function (e) {
      var source = e.touches ? e.touches[0] : e;
      var pageX = source.pageX,
          pageY = source.pageY;

      _this.setState({
        isPressed: true,
        pressed: [pageX, pageY]
      });
    };

    _this.move = function (e) {
      var source = e.touches ? e.touches[0] : e;
      var pageX = source.pageX,
          pageY = source.pageY;


      if (e.preventDefault) {
        e.preventDefault();
      }

      var _this$state2 = _this.state,
          isPressed = _this$state2.isPressed,
          pressed = _this$state2.pressed;

      var _pressed = _slicedToArray(pressed, 2),
          x = _pressed[0],
          y = _pressed[1];

      if (isPressed) {
        _this.setState({
          delta: [pageX - x, pageY - y]
        });
      }
    };

    _this.end = function (e) {
      var _this$props2 = _this.props,
          pageHeight = _this$props2.pageHeight,
          children = _this$props2.children,
          springThreashold = _this$props2.springThreashold;

      var pageCount = _react.Children.count(children);
      var _this$state3 = _this.state,
          pageIndex = _this$state3.pageIndex,
          delta = _this$state3.delta;

      var _delta2 = _slicedToArray(delta, 2),
          x = _delta2[0],
          y = _delta2[1];

      var newDelta = [0, 0];

      var nextPage = pageIndex;

      if ((y > 0 && pageIndex > 0 || y < 0 && pageIndex < pageCount - 1) && Math.abs(y) !== pageHeight) {
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

      if (y > 0 && pageIndex === 0 || y < 0 && pageIndex === pageCount - 1) {
        if (pageHeight > 0) {
          nextPage = 0;
        } else {
          nextPage = pageCount;
        }

        newDelta = [1, 0];
        _this.setState({
          isPressed: false,
          delta: newDelta
        });
        return;
      }

      _this.setState({
        isPressed: false,
        delta: newDelta,
        pageIndex: nextPage
      });
    };

    _this.resetPage = function () {
      _this.setState({
        pressed: [0, 0],
        delta: [0, 0],
        isScrolling: false,
        onKeyPress: false
      });
    };

    _this.handlePage = function () {
      var _this$state4 = _this.state,
          pageIndex = _this$state4.pageIndex,
          isPressed = _this$state4.isPressed,
          pressed = _this$state4.pressed,
          isScrolling = _this$state4.isScrolling,
          onKeyPress = _this$state4.onKeyPress;
      var onPage = _this.props.onPage;


      if (isPressed) {
        return;
      }

      if (pressed[0]) {
        _this.resetPage();
      } else if (isScrolling) {
        if (onKeyPress) {
          console.log('onKeyPress');
          _this.resetPage();
        } else {
          console.log('scroll');
          clearTimeout(_this.scrollTimout);
          _this.scrollTimout = setTimeout(function () {
            _this.resetPage();
          }, 300);
        }
      }
      // onPage(pageIndex);
    };

    _this.continous = false;
    _this.state = {
      isPressed: false,
      isScrolling: false,
      onKeyPress: false,
      pressed: [0, 0],
      delta: [0, 0],
      pageIndex: 0
    };
    return _this;
  }

  _createClass(SliderSupport, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      (0, _wheel.addWheelListener)(document, this.onWheel);
      document.addEventListener('keydown', this.onKeydown);
      document.addEventListener('touchstart', this.start);
      document.addEventListener('touchmove', this.move);
      document.addEventListener('touchend', this.end);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      (0, _wheel.removeWheelListener)(document, this.onWheel);
      document.removeEventListener('keydown', this.onKeydown);
      document.removeEventListener('touchstart', this.start);
      document.removeEventListener('touchmove', this.move);
      document.removeEventListener('touchend', this.end);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var style = this.props.style;

      if (style) {
        console.log('style');
        return _react2.default.createElement(_slider2.default, _extends({
          ref: function ref(_ref) {
            _this2.slider = _ref;
          }
        }, this.props));
      }
      var _state = this.state,
          pageIndex = _state.pageIndex,
          isPressed = _state.isPressed,
          isScrolling = _state.isScrolling,
          delta = _state.delta;


      if (isPressed) {
        var _delta3 = _slicedToArray(delta, 2),
            y = _delta3[1];

        style = {
          offset: y
        };
      } else if (delta[0] || isScrolling) {
        var _delta4 = _slicedToArray(delta, 2),
            _y = _delta4[1];

        style = {
          offset: (0, _reactMotion.spring)(_y, { stiffness: 300, damping: 30, precision: 1 })
        };
      } else {
        style = {
          offset: 0
        };
      }

      return _react2.default.createElement(_slider2.default, _extends({}, this.props, {
        ref: function ref(_ref2) {
          _this2.slider = _ref2;
        },
        pageIndex: pageIndex,
        style: style,
        onPage: this.handlePage
      }));
    }
  }]);

  return SliderSupport;
}(_react.Component);

SliderSupport.propTypes = {
  pageHeight: _propTypes2.default.number,
  onPage: _propTypes2.default.func,
  style: _propTypes2.default.object,
  children: _propTypes2.default.any,
  springThreashold: _propTypes2.default.number
};
SliderSupport.defaultProps = {
  pageHeight: window.innerHeight,
  onPage: function onPage() {},
  springThreashold: 15
};

exports.default = SliderSupport;