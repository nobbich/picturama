import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RenderedCommands from './../rendered-commands';
import keymapManager from './../keymap-manager';
import Picture from './picture';

class Grid extends React.Component {
  static propTypes = {
    setExport: PropTypes.func.isRequired,
    setScrollTop: PropTypes.func.isRequired,
    highlighted: PropTypes.array.isRequired,
    current: PropTypes.number,
    actions: PropTypes.object.isRequired,
    photos: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    this.pressedEnter = this.pressedEnter.bind(this);
    this.state = { renderedCommands: new RenderedCommands('grid') };
  }

  handleFlagging() {
    let flagSet = this.props.photos
      .filter((photo, i) => this.state.highlighted.indexOf(i) !== -1);

    this.props.actions.flagSet(this.props.photos, flagSet, true);
  }

  pressedEnter() {
    if (this.props.highlighted.length === 1)
      this.props.actions.setCurrent(this.props.highlighted[0]);
  }

  componentDidMount() {
    this.state.renderedCommands.mount(Object.assign({}, this.props.actions, {
      pressedEnter: this.pressedEnter
    }));

    keymapManager.bind(this.refs.grid);
  }

  componentWillUnmount() {
    this.state.renderedCommands.unmount(Object.assign({}, this.props.actions, {
      pressedEnter: this.pressedEnter
    }));

    keymapManager.unbind();
  }

  render() {
    return (
      <div className="grid" ref="grid">
        {this.props.photos.map((photo, index) =>
          <Picture
            key={index}
            index={index}
            photo={photo}
            actions={this.props.actions}
            setFlagging={this.handleFlagging.bind(this)}
            setExport={this.props.setExport} />
          )
        }
      </div>
    );
  }
}

const ReduxGrid = connect(state => ({
  current: state.current,
  highlighted: state.highlighted
}))(Grid);

export default ReduxGrid;