import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Receiver.css';
import Swap from '../Swap';
import Clock from 'react-live-clock';

class Unassigned extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interval: 0,
      image: 0,
      shuffledImages: []
    };
  }

  componentWillMount() {
    this.getRandomImage();
  }

  componentDidMount() {
    this.setState({
      interval: setInterval(this.updateDisplayedImage, 60 * 1000)
    });
  }

  componentWillUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.getRandomImage();
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  getRandomImage = () => {
    if (!this.props.unassigned)
      return;
    let array = JSON.parse(JSON.stringify(this.props.unassigned));
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    this.setState({
      shuffledImages: array,
      image: 0
    });
  }

  updateDisplayedImage = () => {
    if (this.state.image === this.state.shuffledImages.length - 1) {
      this.getRandomImage();
    } else {
      this.setState({
        image: this.state.image + 1
      });
    }
  }

  render() {
    const style = this.props.background_choice !== 'image'
      ? { backgroundColor: this.props.background_color,
          top: '0',
          left: '0',
          position: 'absolute',
          height: '100%',
          width: '100%' }
      : { backgroundImage: `url(${this.props.background_image})`,
          top: '0',
          left: '0',
          position: 'absolute',
          height: '100%',
          width: '100%',
          backgroundSize: 'cover' 
        };
    return (
      <>
        <Swap control={this.props.useBranding === true}>
          <div style={style}>
            { this.props.loading_image && <img 
              className='logo'
              src={this.props.loading_image} 
              alt='logo'
              /> }
          </div>
          <div style={{
            top: '0',
            left: '0',
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            backgroundImage: `url(${this.state.shuffledImages[this.state.image]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 1s, opacity 1s',
          }} />
        </Swap>
        <div className='right-bottom clock'>
          <Clock format={'HH:mm'} ticking={true} timezone={this.props.timezone} />
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
	return ({
    receiverConnected: state.Receiver.receiverConnected,
    useBranding: state.Settings.useBranding,
    timezone: state.Settings.timezone,
    background_choice: state.Settings.background_choice,
    background_color: state.Settings.background_color,
    background_image: state.Settings.background_image,
    loading_image: state.Settings.loading_image,
    unassigned: state.Settings.unassigned,
	});
}

export default connect(mapStateToProps)(Unassigned);
