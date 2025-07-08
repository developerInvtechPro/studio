
'use client';

import { useState } from 'react';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import UserFormDialog from './UserFormDialog';

interface UsersDataTableProps {
  initialUsers: Omit<User, 'password'>[];
}

export default function UsersDataTable({ initialUsers }: UsersDataTableProps) {
  const [users, setUsers] = useState<Omit<User, 'password'>[]>(initialUsers);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Omit<User, 'password'> | null>(null);

  const handleAddNew = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEdit = (user: Omit<User, 'password'>) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };
  
  const onUserSaved = (savedUser: Omit<User, 'password'>) => {
    const existingIndex = users.findIndex(u => u.id === savedUser.id);
    if (existingIndex > -1) {
      const updatedUsers = [...users];
      updatedUsers[existingIndex] = savedUser;
      setUsers(updatedUsers);
    } else {
      setUsers([savedUser, ...users]);
    }
    setDialogOpen(false);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>Añadir Usuario</Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre de Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
                <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'Administrador' : 'Cajero'}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <UserFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        onUserSaved={onUserSaved}
      />
    </>
  );
}
