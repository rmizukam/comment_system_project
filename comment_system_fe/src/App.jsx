import { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://127.0.0.1:8000/api/comments/';

export default function App() {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentId, setNewCommentId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to retrieve comment list.');
      const data = await response.json();
      setComments(data);
      setError(null);
    } catch(err){
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchComments([]);
  }, []);

  const handleAddComment = async(e) => {
    e.preventDefault();
    if (!newCommentText || !newCommentId) return;
    try{
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(newCommentId, 10),
          post_text: newCommentText,
          author: "Admin",
        }),
      });
      if (!response.ok){
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to append comment.' );
      }
      setNewCommentText('');
      setNewCommentId('');
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStartEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.post_text);
  }

  const handleSaveEdit = async(id) => {
    try{
      const response = await fetch(`${API_BASE_URL}${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_text: editText }),
      });
      if (!response.ok) throw new Error('Failed to modify text');
      setEditingId(null);
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}${id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to delete comment');
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

return (
    <div className="container">
      <header className="header">
        <h1>Comment System Project</h1>
      </header>

      {error && <div className="error-banner">Error: {error}</div>}

      <section className="card">
        <h3 className="card-title">Add Comment</h3>
        <form onSubmit={handleAddComment} className="form">
          <div className="input-group">
            <label className="label">Explicit Record ID:</label>
            <input
              type="number"
              placeholder="e.g., 901"
              value={newCommentId}
              onChange={(e) => setNewCommentId(e.target.value)}
              className="input"
              required
            />
          </div>
          <div className="input-group">
            <label className="label">Comment Text:</label>
            <textarea
              placeholder="Type system alert, observation, or notes..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="textarea"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Commit as Admin
          </button>
        </form>
      </section>

      <section className="list-container">
        <h3 className="card-title">Active Database Table Records ({comments.length})</h3>
        {comments.length === 0 ? (
          <p className="empty-text">No data records currently inside the target table view.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-row">
              <div className="comment-meta">
                {comment.image_url && (
                  <img
                    src={comment.image_url}
                    alt={`${comment.author}'s profile`}
                    className="profile-avatar"
                  />
                )}
                <span className="badge">ID: {comment.id}</span>
                <span className="author"> {comment.author}</span>
                <span className="time">{new Date(comment.created_at).toLocaleString()}</span>
              </div>

              {editingId === comment.id ? (
                <div className="edit-interface">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-textarea"
                  />
                  <div className="action-row">
                    <button onClick={() => handleSaveEdit(comment.id)} className="save-button">
                      Save Alteration
                    </button>
                    <button onClick={() => setEditingId(null)} className="cancel-button">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="content-body">
                  <p className="text">{comment.post_text}</p>
                  <div className="action-row">
                    <button onClick={() => handleStartEdit(comment)} className="edit-button">
                      Edit Text
                    </button>
                    <button onClick={() => handleDeleteComment(comment.id)} className="delete-button">
                      Delete Record
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}