import React from 'react';
import './StarRatingComponent.css';

export class Ratings extends React.Component{
  state={
      rating: this.props.rating || null,
  };
  rate = (rating) => {
    this.setState({
      rating: rating,
    });
  };
  render() {
    var stars = [];
    
    for(var i = 1; i < 6; i++) {
      var klass = 'star-rating__star';
      
      if (this.state.rating >= i && this.state.rating != null) {
        klass += ' is-selected';
      }

      stars.push(
        <label
          className={klass}
          title={this.props.rating+"/5"}
          >
          ★
        </label>
      );
    }
    
    return (
      <div className="star-rating">
         {stars}
      </div>
    );
  }
}

export default Ratings;