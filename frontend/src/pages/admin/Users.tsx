import React, { useEffect, useState } from "react";
import { API_URL } from "../../constants/URL";
import { User } from "../../utils/itemdata";
import api from "../../api";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("admin/users");
        setUsers(Array.isArray(response.data) ? response.data : response.data.users || [])
      } catch (error) {
        console.error("Axios fetch error:", error);
        setError("An error occurred while fetching users.");
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div>Users</div>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.email} {user.id} {user.is_admin ? 'Admin' : 'User'} {user.phone} {user.username}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Users;
