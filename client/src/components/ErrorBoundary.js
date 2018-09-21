import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = {
    hasError: false
  };
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    return this.state.hasError ? (
      <h1>Something went wrong.</h1>
    ) : (
      this.props.children
    );
  }
}
