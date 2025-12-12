import { useState, useMemo } from 'react';
import {
  Users,
  Key,
  Shield,
  ShieldCheck,
  Plus,
  X,
  AlertTriangle,
  Check,
  Lock,
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
  color: string;
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    usersCount: 2,
    permissions: ['all'],
    color: 'bg-red-500',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Park Manager',
    description: 'Manage park operations, attractions, and staff',
    usersCount: 5,
    permissions: ['attractions.manage', 'tickets.manage', 'users.view', 'analytics.view', 'reports.generate'],
    color: 'bg-blue-500',
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Ticket Operator',
    description: 'Handle ticket sales, validation, and customer queries',
    usersCount: 12,
    permissions: ['tickets.validate', 'tickets.view', 'users.view'],
    color: 'bg-emerald-500',
    createdAt: '2024-01-15',
  },
  {
    id: '4',
    name: 'Attraction Operator',
    description: 'Manage attraction status and wait times',
    usersCount: 24,
    permissions: ['attractions.update', 'attractions.view', 'queues.manage'],
    color: 'bg-purple-500',
    createdAt: '2024-01-15',
  },
  {
    id: '5',
    name: 'Analytics Viewer',
    description: 'View-only access to reports and analytics',
    usersCount: 8,
    permissions: ['analytics.view', 'reports.view'],
    color: 'bg-amber-500',
    createdAt: '2024-02-01',
  },
];

const allPermissions: Permission[] = [
  // Attractions
  { id: 'attractions.view', name: 'View Attractions', description: 'View attraction list and details', category: 'Attractions' },
  { id: 'attractions.manage', name: 'Manage Attractions', description: 'Create, edit, delete attractions', category: 'Attractions' },
  { id: 'attractions.update', name: 'Update Status', description: 'Update wait times and status', category: 'Attractions' },
  // Tickets
  { id: 'tickets.view', name: 'View Tickets', description: 'View ticket types and sales', category: 'Tickets' },
  { id: 'tickets.manage', name: 'Manage Tickets', description: 'Create, edit ticket types', category: 'Tickets' },
  { id: 'tickets.validate', name: 'Validate Tickets', description: 'Scan and validate tickets', category: 'Tickets' },
  { id: 'tickets.refund', name: 'Process Refunds', description: 'Process ticket refunds', category: 'Tickets' },
  // Users
  { id: 'users.view', name: 'View Users', description: 'View user list', category: 'Users' },
  { id: 'users.manage', name: 'Manage Users', description: 'Create, edit, delete users', category: 'Users' },
  { id: 'users.roles', name: 'Assign Roles', description: 'Assign roles to users', category: 'Users' },
  // Analytics
  { id: 'analytics.view', name: 'View Analytics', description: 'View analytics dashboard', category: 'Analytics' },
  { id: 'reports.view', name: 'View Reports', description: 'View generated reports', category: 'Analytics' },
  { id: 'reports.generate', name: 'Generate Reports', description: 'Create new reports', category: 'Analytics' },
  // Queues
  { id: 'queues.view', name: 'View Queues', description: 'View queue status', category: 'Queues' },
  { id: 'queues.manage', name: 'Manage Queues', description: 'Manage virtual queues', category: 'Queues' },
  // Settings
  { id: 'settings.view', name: 'View Settings', description: 'View system settings', category: 'Settings' },
  { id: 'settings.manage', name: 'Manage Settings', description: 'Modify system settings', category: 'Settings' },
  // Audit
  { id: 'audit.view', name: 'View Audit Logs', description: 'View audit trail', category: 'Security' },
  { id: 'audit.export', name: 'Export Audit Logs', description: 'Export audit data', category: 'Security' },
];

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');

  const permissionCategories = useMemo(() => [...new Set(allPermissions.map((p) => p.category))], []);

  const stats = useMemo(() => {
    const totalRoles = mockRoles.length;
    const totalUsers = mockRoles.reduce((sum, r) => sum + r.usersCount, 0);
    const totalPermissions = allPermissions.length;

    return { totalRoles, totalUsers, totalPermissions };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-500 mt-1">Manage user roles and access control</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRoles}</p>
              <p className="text-sm text-gray-500">Total Roles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-gray-500">Users with Roles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Key className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPermissions}</p>
              <p className="text-sm text-gray-500">Total Permissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'roles'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Roles ({mockRoles.length})
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'permissions'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Permissions ({allPermissions.length})
        </button>
      </div>

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roles List */}
          <div className="lg:col-span-1 space-y-4">
            {mockRoles.map((role) => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`bg-white rounded-xl p-4 border cursor-pointer transition-all ${
                  selectedRole?.id === role.id
                    ? 'ring-2 ring-teal-500 border-teal-500'
                    : 'border-gray-100 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 ${role.color} rounded-full mt-1.5`} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Users className="w-4 h-4" />
                        {role.usersCount} users
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Key className="w-4 h-4" />
                        {role.permissions.length === 1 && role.permissions[0] === 'all'
                          ? 'All'
                          : role.permissions.length}{' '}
                        permissions
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Role Details */}
          <div className="lg:col-span-2">
            {selectedRole ? (
              <div className="bg-white rounded-xl border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 ${selectedRole.color} rounded-full`} />
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedRole.name}</h2>
                        <p className="text-gray-500">{selectedRole.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Edit
                      </button>
                      {selectedRole.name !== 'Super Admin' && (
                        <button className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Permissions</h3>

                  {selectedRole.permissions[0] === 'all' ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-red-700 font-medium">
                        <AlertTriangle className="w-5 h-5" />
                        This role has full system access
                      </div>
                      <p className="text-red-600 text-sm mt-1">
                        All permissions are granted to users with this role.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {permissionCategories.map((category) => {
                        const categoryPermissions = allPermissions.filter((p) => p.category === category);
                        const grantedPermissions = categoryPermissions.filter((p) =>
                          selectedRole.permissions.includes(p.id)
                        );

                        if (grantedPermissions.length === 0) return null;

                        return (
                          <div key={category} className="border border-gray-200 rounded-xl p-4">
                            <h4 className="font-medium text-gray-700 mb-3">{category}</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {categoryPermissions.map((permission) => {
                                const isGranted = selectedRole.permissions.includes(permission.id);
                                return (
                                  <label
                                    key={permission.id}
                                    className={`flex items-center gap-2 p-2 rounded-lg ${
                                      isGranted ? 'bg-emerald-50' : 'bg-gray-50'
                                    }`}
                                  >
                                    <div
                                      className={`w-5 h-5 rounded flex items-center justify-center ${
                                        isGranted ? 'bg-emerald-500 text-white' : 'bg-gray-200'
                                      }`}
                                    >
                                      {isGranted && <Check className="w-3 h-3" />}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-700">{permission.name}</p>
                                      <p className="text-xs text-gray-500">{permission.description}</p>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Users with this role */}
                <div className="p-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Users with this role ({selectedRole.usersCount})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Park Admin', 'John Manager', 'Sarah Lee']
                      .slice(0, selectedRole.usersCount)
                      .map((name, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          {name}
                        </span>
                      ))}
                    {selectedRole.usersCount > 3 && (
                      <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-500">
                        +{selectedRole.usersCount - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">Select a role</h3>
                <p className="text-gray-500 mt-2">Click on a role to view and manage its permissions</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="space-y-6">
          {permissionCategories.map((category) => (
            <div key={category} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900">{category}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                      <th className="px-4 py-3 font-medium">Permission</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">Granted To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPermissions
                      .filter((p) => p.category === category)
                      .map((permission) => {
                        const grantedRoles = mockRoles.filter(
                          (r) => r.permissions.includes(permission.id) || r.permissions.includes('all')
                        );
                        return (
                          <tr key={permission.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <span className="font-medium text-gray-900">{permission.name}</span>
                              <span className="block text-xs text-gray-400 font-mono mt-0.5">{permission.id}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{permission.description}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {grantedRoles.map((role) => (
                                  <span
                                    key={role.id}
                                    className={`px-2 py-0.5 text-xs text-white rounded ${role.color}`}
                                  >
                                    {role.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Create New Role</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Marketing Manager"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={2}
                  placeholder="Describe what this role can do..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {permissionCategories.map((category) => (
                    <div key={category} className="border border-gray-200 rounded-xl p-3">
                      <h4 className="font-medium text-gray-700 mb-2">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {allPermissions
                          .filter((p) => p.category === category)
                          .map((permission) => (
                            <label
                              key={permission.id}
                              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1.5 rounded"
                            >
                              <input type="checkbox" className="rounded text-teal-600" />
                              {permission.name}
                            </label>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
