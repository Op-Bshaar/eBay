import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/URL';

const axiosInstance = axios.create({
  baseURL: BASE_URL
});
const AddCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: any) => {
    console.log(name, description);
    e.preventDefault();
      axiosInstance
      .post('/admin/AddCategory', { name, description })
      .then((response) => {
        setMessage(response.data.message);
        setName('');
        setDescription('');
      })
      .catch((error) => {
        console.error('Error adding category:', error);
      });
  };

  return (
    <div>
      <h2>Add New Category</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
