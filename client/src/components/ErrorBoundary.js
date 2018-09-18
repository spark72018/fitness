import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = {
    hasError: false
  };
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
