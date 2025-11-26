import { useState, useEffect } from 'react';
import * as userApi from '../../api/userApi';
import type { UsuarioResponse, RolResponse } from '../../api/userApi';

function AdminUsuariosPage() {
  // 1. Estado para la lista de usuarios y roles
  const [users, setUsers] = useState<UsuarioResponse[]>([]);
  const [roles, setRoles] = useState<RolResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Estado para el modo de eliminación
  const [deleteMode, setDeleteMode] = useState(false);

  // 3. Estado para cambiar rol
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  // 4. Estado para gestión de roles (Modal)
  const [isRoleManagerOpen, setIsRoleManagerOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  // Cargar usuarios y roles al montar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [usersData, rolesData] = await Promise.all([
        userApi.getAllUsuarios(0, 100),
        userApi.getRoles()
      ]);
      setUsers(usersData.content);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar usuarios o roles');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Funciones de Gestión de Usuarios ---

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const deleteUser = async (id: number) => {
    if (window.confirm(`¿Estás seguro de desactivar al usuario con ID ${id}?`)) {
      try {
        await userApi.desactivarUsuario(id);
        await loadData(); // Recargar la lista
        alert('Usuario desactivado correctamente');
      } catch (error) {
        console.error('Error al desactivar usuario:', error);
        alert('Error al desactivar usuario');
      }
    }
  };

  const startEditingRole = (user: UsuarioResponse) => {
    setEditingUserId(user.id);
    setSelectedRoleId(null);
  };

  const cancelEditingRole = () => {
    setEditingUserId(null);
    setSelectedRoleId(null);
  };

  const saveRoleChange = async (userId: number) => {
    if (!selectedRoleId) return;

    try {
      await userApi.asignarRol(userId, selectedRoleId);
      await loadData();
      setSelectedRoleId(null); // Resetear selección
      alert('Rol añadido correctamente');
    } catch (error: any) {
      console.error('Error al asignar rol:', error);
      alert(error.response?.data?.mensaje || 'Error al asignar rol');
    }
  };

  const handleRemoveRoleFromUser = async (userId: number, rolId: number) => {
    if (!window.confirm('¿Estás seguro de quitar este rol al usuario?')) return;

    try {
      await userApi.removeRolFromUser(userId, rolId);
      await loadData();
      alert('Rol quitado correctamente');
    } catch (error: any) {
      console.error('Error al quitar rol:', error);
      alert(error.response?.data?.mensaje || 'Error al quitar rol');
    }
  };

  // --- Funciones de Gestión de Roles ---

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      await userApi.createRol(newRoleName.toUpperCase()); // Roles suelen ser mayúsculas
      setNewRoleName('');
      // Recargar roles
      const updatedRoles = await userApi.getRoles();
      setRoles(updatedRoles);
      alert('Rol creado correctamente');
    } catch (error: any) {
      console.error('Error al crear rol:', error);
      alert(error.response?.data?.mensaje || 'Error al crear rol');
    }
  };

  const handleDeleteRole = async (id: number, nombre: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el rol ${nombre}? Esto podría afectar a usuarios que lo tengan asignado.`)) {
      try {
        await userApi.deleteRol(id);
        // Recargar roles
        const updatedRoles = await userApi.getRoles();
        setRoles(updatedRoles);
        alert('Rol eliminado correctamente');
      } catch (error: any) {
        console.error('Error al eliminar rol:', error);
        alert(error.response?.data?.mensaje || 'Error al eliminar rol');
      }
    }
  };

  // --- Renderizado ---
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div id="users" className="section">
      <h2>👥 Gestión de Usuarios</h2>
      <div className="table-container">

        {/* Acciones (botones) */}
        <div className="actions mb-3 d-flex justify-content-between">
          <div>
            <button
              className={`delete-btn ${deleteMode ? 'btn-danger' : ''} me-2`}
              onClick={toggleDeleteMode}
            >
              🗑️ {deleteMode ? 'Cancelar Eliminación' : 'Activar Eliminación'}
            </button>
          </div>
          <div>
            <button
              className="btn btn-outline-dark"
              onClick={() => setIsRoleManagerOpen(true)}
            >
              ⚙️ Gestionar Roles
            </button>
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <table id="users-table" className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Run</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol Actual</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.run || 'N/A'}</td>
                <td>{`${user.nombre || user.name || ''} ${user.apellido || user.lastName || ''}`.trim() || 'N/A'}</td>
                <td>{user.email}</td>
                <td>
                  {editingUserId === user.id ? (
                    <div className="d-flex flex-column gap-2">
                      {/* Lista de roles actuales con opción de eliminar */}
                      <div className="d-flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((roleName, index) => {
                            // Encontrar el ID del rol basado en el nombre para poder eliminarlo
                            const roleObj = roles.find(r => r.nombre === roleName);
                            return (
                              <span key={index} className="badge bg-primary d-flex align-items-center gap-1">
                                {roleName}
                                {roleObj && (
                                  <span
                                    className="cursor-pointer text-white"
                                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                    onClick={() => handleRemoveRoleFromUser(user.id, roleObj.id)}
                                    title="Quitar rol"
                                  >
                                    &times;
                                  </span>
                                )}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-muted small">Sin roles</span>
                        )}
                      </div>

                      {/* Selector para añadir nuevo rol */}
                      <div className="d-flex gap-1">
                        <select
                          className="form-select form-select-sm"
                          value={selectedRoleId || ''}
                          onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                        >
                          <option value="">Añadir rol...</option>
                          {roles
                            .filter(r => !user.roles?.includes(r.nombre)) // Solo mostrar roles que no tiene
                            .map(role => (
                              <option key={role.id} value={role.id}>
                                {role.nombre}
                              </option>
                            ))
                          }
                        </select>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => saveRoleChange(user.id)}
                          disabled={!selectedRoleId}
                          title="Añadir Rol"
                        >
                          ➕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className={`badge ${user.roles?.includes('ADMIN') ? 'bg-danger' : 'bg-secondary'}`}>
                      {user.roles ? user.roles.join(', ') : 'N/A'}
                    </span>
                  )}
                </td>
                <td>
                  {editingUserId === user.id ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={cancelEditingRole}
                      title="Terminar Edición"
                    >
                      Listo
                    </button>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => startEditingRole(user)}
                        title="Gestionar Roles"
                      >
                        🛡️ Roles
                      </button>
                      {deleteMode && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteUser(user.id)}
                          title="Desactivar"
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Gestión de Roles */}
      {isRoleManagerOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">⚙️ Gestionar Roles</h5>
                <button type="button" className="btn-close" onClick={() => setIsRoleManagerOpen(false)}></button>
              </div>
              <div className="modal-body">
                {/* Crear Rol */}
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nuevo Rol (ej: SUPERVISOR)"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleCreateRole}>
                    ➕ Crear
                  </button>
                </div>

                {/* Lista de Roles */}
                <ul className="list-group">
                  {roles.map(role => (
                    <li key={role.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {role.nombre}
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteRole(role.id, role.nombre)}
                        title="Eliminar Rol"
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsRoleManagerOpen(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsuariosPage;