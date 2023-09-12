import React from 'react';
import PropTypes from 'prop-types';

class Delayed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hidden: true };
    this.timeoutId = null; // Store the timeout ID
  }

  componentDidMount() {
    this.startTimeout();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.waitBeforeShow !== this.props.waitBeforeShow) {
      // If the waitBeforeShow prop changes, restart the timeout
      clearTimeout(this.timeoutId); // Clear the previous timeout
      this.startTimeout(); // Start a new timeout
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId); // Clear the timeout when unmounting the component
  }

  startTimeout() {
    this.timeoutId = setTimeout(() => {
      this.setState({ hidden: false });
    }, this.props.waitBeforeShow);
  }

  render() {
    return this.state.hidden ? null : this.props.children;
  }
}

Delayed.propTypes = {
  waitBeforeShow: PropTypes.number.isRequired,
};

export default Delayed;
