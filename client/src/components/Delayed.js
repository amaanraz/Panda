import React from 'react';
import PropTypes from 'prop-types';

class Delayed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hidden: true };
  }

  componentDidMount() {
    this.startTimeout();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.hidden && !this.state.hidden) {
      // If hidden becomes false (component is about to show),
      // start a new timeout
      this.startTimeout();
    }
  }

  startTimeout() {
    setTimeout(() => {
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
