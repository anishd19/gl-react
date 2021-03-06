//@flow
import React, { Component } from "react";
import { NearestCopy, LinearCopy, Uniform } from "gl-react";
import { Surface } from "../../gl-react-implementation";
import { BlurXY } from "../blurxy";
import { images } from "./meta";
import timeLoop from "../../HOC/timeLoop";

const ContinuousBlur = timeLoop(BlurXY);

export default class Example extends Component {
  state = {
    buffering: false,
  };
  componentWillReceiveProps({ image, refreshId }: *) {
    if (image !== this.props.image || refreshId !== this.props.refreshId) {
      this.setState({ buffering: false }); // start again with the image
    }
  }
  onDraw = () => {
    if (!this.state.buffering) {
      // after a first draw without buffering, enable it back
      this.setState({ buffering: true });
    }
  };
  getMainBuffer = () => {
    const { main } = this.refs;
    return main ? Uniform.backbufferFrom(main.getNodeRef()) : null;
  };
  render() {
    const { image, factor, width } = this.props;
    const { buffering } = this.state;
    return (
      <Surface style={{ width, height: width * 0.7 }} preload={images}>
        <NearestCopy>
          <LinearCopy backbuffering ref="main" onDraw={this.onDraw}>
            <ContinuousBlur factor={factor}>
              {!buffering ? image : this.getMainBuffer}
            </ContinuousBlur>
          </LinearCopy>
        </NearestCopy>
      </Surface>
    );
  }
  static defaultProps = {
    image: images[0],
    factor: 0,
    refreshId: 0,
  };
}
