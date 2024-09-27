import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Input from 'react-phone-number-input/input';
import { isValidNumber } from 'libphonenumber-js';

const EditProfile: React.FC = () => {

  const [user, setUser] = useState({
    username: '',
    email: '',
    phone: '',
  });


  const [errorMessage, setErrorMessage] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(true);

 
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
 
    axios.get('/api/user/profile')
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setErrorMessage('Failed to fetch user data.');
      });
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handlePhoneChange = (value: string | undefined) => {
    if (value && isValidNumber(value)) {
      setIsPhoneValid(true);
      setUser({ ...user, phone: value });
    } else {
      setIsPhoneValid(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPhoneValid) {
      setErrorMessage('Invalid phone number');
      return;
    }

    setIsLoading(true);
    axios.put('/api/user/profile', user)
      .then(response => {
        setUser(response.data);
        setErrorMessage('Profile updated successfully');
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        setErrorMessage('Failed to update profile');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <Input
            country="US"
            value={user.phone}
            onChange={handlePhoneChange}
            required
          />
          {!isPhoneValid && <span style={{ color: 'red' }}>Invalid phone number</span>}
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'حفظ...' : 'حفظ المتغيرات'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
