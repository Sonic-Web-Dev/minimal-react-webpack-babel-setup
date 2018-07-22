/*eslint no-console: "error"*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Slider from '../src';

const Page = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
`;

class App extends Component {

  handlePage = (pageIndex) => {
    console.log(pageIndex);
  }

  render() {
    const pageCount = 10;
    const pages = Array(...Array(pageCount)).map((_, i) => (
      <Page key={i}>
        {i}
      </Page>
    ));
    return (
      <Slider pageHeight={window.innerHeight} onPage={this.handlePage}>
        {pages}
      </Slider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
