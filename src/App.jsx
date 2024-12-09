import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]); // Kullanıcılar için state
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Güncellemeye geçildiğini anlamak için state
  const [currentUserId, setCurrentUserId] = useState(null); // Güncellenecek kullanıcı ID'si

  // Yeni kullanıcıyı eklemek için bir async function
  const addUser = async (e) => {
    e.preventDefault(); // Formun sayfa yenilemesini engelle

    const newUser = {
      name: name, // Yalnızca name özelliği
    };

    try {
      const response = await axios.post('http://localhost:3006/users', newUser);
      setSuccessMessage('User added successfully!');
      setName(''); // Name'i sıfırlıyoruz
      fetchUsers(); // Kullanıcıları tekrar getir
    } catch (err) {
      setError('Error adding user: ' + err.message);
    }
  };

  // Kullanıcıları almak için bir async function
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3006/users');
      setUsers(response.data); // Kullanıcıları state'e ekliyoruz
    } catch (err) {
      setError('Error fetching users: ' + err.message);
    }
  };

  // Kullanıcıyı güncellemek için bir async function
  const updateUser = async (e) => {
    e.preventDefault(); // Formun sayfa yenilemesini engelle

    const updatedUser = {
      name: name, // Güncellenmiş name
    };

    try {
      const response = await axios.put(`http://localhost:3006/users/${currentUserId}`, updatedUser);
      setSuccessMessage('User updated successfully!');
      setName(''); // Name'i sıfırlıyoruz
      setIsEditing(false); // Güncelleme işlemini bitir
      setCurrentUserId(null); // Güncellenen kullanıcının ID'sini sıfırlıyoruz
      fetchUsers(); // Kullanıcıları tekrar getir
    } catch (err) {
      setError('Error updating user: ' + err.message);
    }
  };

  // Kullanıcıyı silmek için bir async function
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3006/users/${userId}`);
      setSuccessMessage('User deleted successfully!');
      fetchUsers(); // Kullanıcıları tekrar getir
    } catch (err) {
      setError('Error deleting user: ' + err.message);
    }
  };

  // Component yüklendiğinde fetchUsers çalışacak
  useEffect(() => {
    fetchUsers();
  }, []);

  // Güncelleme formunu göster
  const startEditing = (user) => {
    setIsEditing(true); // Güncellemeye başla
    setName(user.name); // Seçilen kullanıcının adını formda göster
    setCurrentUserId(user.id); // Güncellenen kullanıcı ID'sini kaydet
  };

  return (
    <div>
      <h1>{isEditing ? 'Update User' : 'Add a New User'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={isEditing ? updateUser : addUser}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isEditing ? 'Update User' : 'Add User'}</button>
      </form>

      <h2>Users List</h2>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              {user.name}
              <button onClick={() => startEditing(user)} style={{ marginLeft: '10px' }}>
                Edit
              </button>
              <button onClick={() => deleteUser(user.id)} style={{ marginLeft: '20px', color: 'red' }}>
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No users found</p>
        )}
      </ul>
    </div>
  );
}

export default App;
