
import { useState, useEffect } from 'react';
import { User } from "../types"; // Import User from types.ts instead of defining locally

// Mock data for development purposes
const mockUsers: User[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date('2023-05-20'),
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    email: 'maria@example.com',
    role: 'instructor',
    status: 'active',
    createdAt: new Date('2023-02-01'),
    lastLogin: new Date('2023-05-22'),
  },
  {
    id: 3,
    name: 'Carlos Pereira',
    email: 'carlos@example.com',
    role: 'student',
    status: 'inactive',
    createdAt: new Date('2023-03-10'),
    lastLogin: new Date('2023-04-15'),
  },
  {
    id: 4,
    name: 'Ana Souza',
    email: 'ana@example.com',
    role: 'viewer',
    status: 'active',
    createdAt: new Date('2023-04-05'),
    lastLogin: new Date('2023-05-25'),
  },
  {
    id: 5,
    name: 'Ricardo Alves',
    email: 'ricardo@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2023-05-01'),
    lastLogin: new Date('2023-05-28'),
  },
];

export const useUserData = (isAuthenticated: boolean = true, initialUsers: User[] = []) => {
  const [users, setUsers] = useState<User[]>(initialUsers.length > 0 ? initialUsers : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    // Only fetch data if no initial users were provided
    if (initialUsers.length === 0) {
      // In a real app, this would be an API call
      // For now, we're using mock data
      const fetchUsers = async () => {
        try {
          // Simulating API delay
          await new Promise(resolve => setTimeout(resolve, 800));
          setUsers(mockUsers);
          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setLoading(false);
        }
      };
      
      if (isAuthenticated) {
        fetchUsers();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, initialUsers]);
  
  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      createdAt: new Date(),
    };
    setUsers([...users, newUser]);
  };
  
  const updateUser = (id: number, userData: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
  };
  
  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };
  
  return {
    users,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    setUsers,
    loading,
    isLoading: loading,
    error,
    addUser,
    updateUser,
    deleteUser
  };
};
