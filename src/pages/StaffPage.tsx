import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Users,
  UserCheck,
  Coffee,
  Star,
  BarChart3,
  ChevronDown,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  Building2,
  Shield,
  Utensils,
  Wrench,
  Headphones,
  Briefcase,
  Sparkles,
  UserX,
} from 'lucide-react';
import { staff, zones, type Staff } from '@themepark/shared';
import { StatCard } from '../components/ui';

function getDepartmentIcon(department: string) {
  switch (department) {
    case 'Operations': return <Briefcase className="w-4 h-4 text-blue-600" />;
    case 'Maintenance': return <Wrench className="w-4 h-4 text-amber-600" />;
    case 'Guest Services': return <Headphones className="w-4 h-4 text-teal-600" />;
    case 'Security': return <Shield className="w-4 h-4 text-red-600" />;
    case 'Food & Beverage': return <Utensils className="w-4 h-4 text-purple-600" />;
    case 'Entertainment': return <Sparkles className="w-4 h-4 text-pink-600" />;
    case 'Retail': return <Building2 className="w-4 h-4 text-indigo-600" />;
    default: return <Users className="w-4 h-4 text-gray-600" />;
  }
}

function getStatusStyles(status: Staff['status']) {
  switch (status) {
    case 'active': return { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' };
    case 'on_leave': return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'inactive': return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
    case 'training': return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
  }
}

function getShiftStatusStyles(shiftStatus: Staff['shiftStatus']) {
  switch (shiftStatus) {
    case 'on_duty': return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    case 'break': return { bg: 'bg-amber-100', text: 'text-amber-700' };
    case 'off_duty': return { bg: 'bg-gray-100', text: 'text-gray-600' };
    case 'overtime': return { bg: 'bg-purple-100', text: 'text-purple-700' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
  }
}

function getFullName(s: Staff): string {
  return `${s.firstName} ${s.lastName}`;
}

function getInitials(s: Staff): string {
  return `${s.firstName[0]}${s.lastName[0]}`;
}

function getAttendancePercent(s: Staff): number {
  if (s.attendance.totalDays === 0) return 0;
  return Math.round((s.attendance.present / s.attendance.totalDays) * 100);
}

function getZoneName(zoneId: string | null): string {
  if (!zoneId) return 'Roaming';
  const zone = zones.find((z) => z.id === zoneId);
  return zone?.name || 'Unknown';
}

function getShiftDisplay(s: Staff): string {
  if (!s.currentShift) return 'Not scheduled';
  return `${s.currentShift.start} - ${s.currentShift.end}`;
}

const departments = ['All', 'Operations', 'Maintenance', 'Guest Services', 'Security', 'Food & Beverage', 'Entertainment', 'Retail'];

export default function StaffPage() {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate stats
  const stats = useMemo(() => {
    const onDutyCount = staff.filter((s) => s.shiftStatus === 'on_duty').length;
    const onBreakCount = staff.filter((s) => s.shiftStatus === 'break').length;
    const avgRating = staff.reduce((sum, s) => sum + s.rating, 0) / staff.length;
    const avgAttendance = staff.reduce((sum, s) => sum + getAttendancePercent(s), 0) / staff.length;
    return {
      total: staff.length,
      onDuty: onDutyCount,
      onBreak: onBreakCount,
      avgRating: avgRating.toFixed(1),
      avgAttendance: Math.round(avgAttendance),
    };
  }, []);

  // Filter staff
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchesDepartment = filterDepartment === 'All' || s.department === filterDepartment;
      const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
      const fullName = getFullName(s).toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                            s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDepartment && matchesStatus && matchesSearch;
    });
  }, [filterDepartment, filterStatus, searchTerm]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage employees, schedules, and performance</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5 text-teal-600" />}
          iconBg="bg-teal-50"
          value={stats.total}
          label="Total Staff"
        />
        <StatCard
          icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          value={stats.onDuty}
          label="On Duty"
          valueColor="text-emerald-600"
        />
        <StatCard
          icon={<Coffee className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
          value={stats.onBreak}
          label="On Break"
          valueColor="text-amber-600"
        />
        <StatCard
          icon={<Star className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-50"
          value={stats.avgRating}
          label="Avg. Rating"
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          value={`${stats.avgAttendance}%`}
          label="Attendance"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search staff by name, role, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
              <option value="training">Training</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member) => {
          const statusStyles = getStatusStyles(member.status);
          const shiftStatusStyles = getShiftStatusStyles(member.shiftStatus);
          const fullName = getFullName(member);
          return (
            <div
              key={member.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setSelectedStaff(member)}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center text-lg font-bold text-teal-600">
                      {getInitials(member)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${statusStyles.dot}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{fullName}</h3>
                    <p className="text-sm text-gray-500 truncate">{member.role}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                        {member.status.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full font-medium ${shiftStatusStyles.bg} ${shiftStatusStyles.text}`}>
                        {member.shiftStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                      {getDepartmentIcon(member.department)}
                      <span>Department</span>
                    </div>
                    <span className="font-medium text-gray-900">{member.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>Zone</span>
                    </div>
                    <span className="font-medium text-gray-900">{getZoneName(member.zoneAssignment)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Shift</span>
                    </div>
                    <span className="font-medium text-gray-900">{getShiftDisplay(member)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-gray-900">{member.rating}</span>
                    <span className="text-gray-400 text-sm">({member.reviewCount})</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {getAttendancePercent(member)}% attendance
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredStaff.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <UserX className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No staff found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Add Staff Member</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Ahmad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="bin Hassan"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="ahmad@themepark.my"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="+60 12-345 6789"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Operations</option>
                    <option>Maintenance</option>
                    <option>Guest Services</option>
                    <option>Security</option>
                    <option>Food & Beverage</option>
                    <option>Entertainment</option>
                    <option>Retail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., Ride Operator"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Zone</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="">Roaming (All Zones)</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>{zone.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Shift</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="morning">06:00 - 14:00 (Morning)</option>
                  <option value="afternoon">10:00 - 18:00 (Afternoon)</option>
                  <option value="night">14:00 - 22:00 (Night)</option>
                  <option value="split">Split Shift</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-xl font-bold text-teal-600">
                      {getInitials(selectedStaff)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusStyles(selectedStaff.status).dot}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{getFullName(selectedStaff)}</h2>
                    <p className="text-gray-500">{selectedStaff.role}</p>
                    <p className="text-sm text-gray-400">{selectedStaff.employeeId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    {getDepartmentIcon(selectedStaff.department)}
                    Department
                  </div>
                  <p className="font-semibold text-gray-900">{selectedStaff.department}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <MapPin className="w-4 h-4" />
                    Zone
                  </div>
                  <p className="font-semibold text-gray-900">{getZoneName(selectedStaff.zoneAssignment)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                  <p className="font-semibold text-gray-900 text-sm truncate">{selectedStaff.email}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Phone className="w-4 h-4" />
                    Phone
                  </div>
                  <p className="font-semibold text-gray-900">{selectedStaff.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="text-2xl font-bold text-gray-900">{selectedStaff.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">Rating ({selectedStaff.reviewCount})</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-emerald-600">{getAttendancePercent(selectedStaff)}%</p>
                  <p className="text-xs text-gray-500">Attendance</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm font-bold text-gray-900">{getShiftDisplay(selectedStaff)}</p>
                  <p className="text-xs text-gray-500">Current Shift</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Shield className="w-4 h-4" />
                  Certifications
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedStaff.certifications.map((cert, i) => (
                    <span key={i} className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  Hire Date
                </div>
                <p className="font-semibold text-gray-900">{formatDate(selectedStaff.hireDate)}</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-between">
              <button className="px-4 py-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium">
                Deactivate
              </button>
              <div className="flex gap-3">
                <button className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Edit
                </button>
                <button className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                  View Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
