// Create web server application with react.js

// Import modules
import React, { Component } from 'react';
import * as service from '../services/posts';

// Create comments component
class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      comment: '',
    };
  }

  // Create componentDidMount function
  componentDidMount() {
    this.fetchComments();
  }

  // Create fetchComments function
  fetchComments = async () => {
    const { postId } = this.props;
    const comments = await service.fetchComments(postId);
    this.setState({ comments });
  };

  // Create handleCommentChange function
  handleCommentChange = (e) => {
    this.setState({ comment: e.target.value });
  };

  // Create handleCommentSubmit function
  handleCommentSubmit = async () => {
    const { postId } = this.props;
    const { comment } = this.state;
    await service.createComment(postId, comment);
    this.setState({ comment: '' });
    this.fetchComments();
  };

  // Create render function
  render() {
    const { comments, comment } = this.state;
    return (
      <div>
        <h2>Comments</h2>
        <ul>
          {comments.map(({ id, body }) => (
            <li key={id}>{body}</li>
          ))}
        </ul>
        <input
          type="text"
          value={comment}
          onChange={this.handleCommentChange}
        />
        <button type="button" onClick={this.handleCommentSubmit}>
          Submit
        </button>
      </div>
    );
  }
}

// Export default
export default Comments;