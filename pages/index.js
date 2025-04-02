// pages/index.js
import { useState, useEffect } from 'react';

export default function Home() {
  const [jsonData, setJsonData] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        setJsonData(JSON.stringify(data, null, 2));
      })
      .catch((err) => {
        setMessage('Error loading data');
        console.error(err);
      });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    try {
      const parsedData = JSON.parse(jsonData);
      fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      })
        .then((res) => res.json())
        .then((data) => {
          setMessage(data.message || 'Data saved successfully');
          setIsEditing(false);
        })
        .catch((err) => {
          setMessage('Error saving data');
          console.error(err);
        });
    } catch (error) {
      setMessage('Invalid JSON format');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        setJsonData(JSON.stringify(data, null, 2));
        setMessage('');
      });
  };

  return (
    <div className="container">
      <h1>JSON Editor</h1>
      {message && <p className={message.includes('Error') ? 'error' : 'success'}>{message}</p>}
      
      <div className="editor-container">
        {isEditing ? (
          <>
            <textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="json-editor"
              rows={20}
            />
            <div className="button-group">
              <button onClick={handleSave} className="save-button">
                Save
              </button>
              <button onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <pre className="json-viewer">{jsonData}</pre>
            <button onClick={handleEdit} className="edit-button">
              Edit
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          text-align: center;
        }
        .editor-container {
          margin-top: 20px;
        }
        .json-editor, .json-viewer {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-family: monospace;
          background-color: #f9f9f9;
        }
        .json-editor {
          min-height: 300px;
        }
        .button-group {
          margin-top: 10px;
          display: flex;
          gap: 10px;
        }
        button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .edit-button {
          background-color: #4CAF50;
          color: white;
        }
        .save-button {
          background-color: #2196F3;
          color: white;
        }
        .cancel-button {
          background-color: #f44336;
          color: white;
        }
        .error {
          color: #f44336;
        }
        .success {
          color: #4CAF50;
        }
      `}</style>
    </div>
  );
}
