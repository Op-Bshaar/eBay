import React, { useEffect, useState } from "react";
import api from "../../../frontend/src/api";
import { User } from "../../../frontend/src/utils/itemdata";
import './Users.css'; 

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("admin/users");
        setUsers(Array.isArray(response.data) ? response.data : response.data.users || []);
      } catch (error) {
        console.error("Axios fetch error:", error);
        setError("An error occurred while fetching users.");
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-container">
      <h1>المستخدمين</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.phone}</td>
              <td>{user.is_admin ? 'Admin' : 'User'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
