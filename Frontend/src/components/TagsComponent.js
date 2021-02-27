import React from 'react';
import './TagsComponent.css';

export class TagsComponent extends React.Component {
  state={
    tags: this.props.tags
  };

  render() {
    return (
      <div className="form">
        <div className="tags">
          <ul style={{listStyle: "none"}}>
            {this.props.tags.map((tag, i) => (
              <li key={tag + i} className="tag">
                {tag} 
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default TagsComponent; 