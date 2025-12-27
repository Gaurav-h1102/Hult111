// src/components/ProgressDashboard.jsx

//Need to connect it to app.js so that it works perfectly...................................................
import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen,
  Target,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from 'lucide-react';

const ProgressDashboard = () => {
  const [progressData, setProgressData] = useState({
    overallProgress: 72,
    courses: [
      { id: 1, name: 'Business Statistics', progress: 85, grade: 92, targetGrade: 85, status: 'excellent', assignments: '17/20' },
      { id: 2, name: 'Financial Accounting', progress: 65, grade: 68, targetGrade: 70, status: 'needs_practice', assignments: '13/20' },
      { id: 3, name: 'Marketing Management', progress: 90, grade: 88, targetGrade: 80, status: 'good', assignments: '18/20' },
      { id: 4, name: 'Organizational Behavior', progress: 45, grade: 62, targetGrade: 70, status: 'at_risk', assignments: '9/20' },
      { id: 5, name: 'Business Ethics', progress: 75, grade: 78, targetGrade: 75, status: 'good', assignments: '15/20' },
    ],
    statistics: {
      highGrade: 1,
      mediumGrade: 2,
      lowGrade: 1,
      failing: 1,
    }
  });

  const chartData = progressData.courses.map(course => ({
    name: course.name.substring(0, 12) + '...',
    progress: course.progress,
    grade: course.grade,
    target: course.targetGrade
  }));

  const pieChartData = [
    { name: 'A', value: progressData.statistics.highGrade, color: '#10b981' },
    { name: 'B', value: progressData.statistics.mediumGrade, color: '#0ea5e9' },
    { name: 'C/D', value: progressData.statistics.lowGrade, color: '#f59e0b' },
    { name: 'Needs Focus', value: progressData.statistics.failing, color: '#ef4444' }
  ];

  const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444'];

  const getStatusColor = (status) => {
    switch(status) {
      case 'excellent': return 'bg-emerald-100 text-emerald-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'needs_practice': return 'bg-amber-100 text-amber-800';
      case 'at_risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'needs_practice': return 'Needs Practice';
      case 'at_risk': return 'At Risk';
      default: return 'Pending';
    }
  };

  const handlePractice = (courseId) => {
    alert(`Starting practice session for course ${courseId}`);
    // Implement practice logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Progress Dashboard</h1>
        </div>
        <p className="text-gray-600">Track your course completion and performance</p>
      </div>

      {/* Overall Progress Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
            <div className="text-3xl font-bold text-blue-600">{progressData.overallProgress}%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressData.overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Statistics Cards */}
        {[
          { icon: CheckCircle, label: 'Courses (A)', value: progressData.statistics.highGrade, color: 'emerald' },
          { icon: BookOpen, label: 'Courses (B)', value: progressData.statistics.mediumGrade, color: 'blue' },
          { icon: AlertTriangle, label: 'Courses (C/D)', value: progressData.statistics.lowGrade, color: 'amber' },
          { icon: Target, label: 'Needs Focus', value: progressData.statistics.failing, color: 'red' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Progress Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChartIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Course Progress Overview</h2>
              </div>
              <select className="border rounded-lg px-3 py-2 text-sm">
                <option>Current Semester</option>
                <option>All Time</option>
                <option>Last Year</option>
              </select>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="progress" name="Completion %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="grade" name="Current Grade" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Courses Needing Practice */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-bold text-gray-900">Courses Needing Practice</h2>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                {progressData.courses.filter(c => c.status === 'needs_practice' || c.status === 'at_risk').length} Alerts
              </span>
            </div>

            <div className="space-y-4">
              {progressData.courses
                .filter(course => course.status === 'needs_practice' || course.status === 'at_risk')
                .map(course => (
                  <div key={course.id} className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.name}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(course.status)}`}>
                            {getStatusText(course.status)}
                          </span>
                          <span className="text-sm text-gray-600">Grade: {course.grade}%</span>
                          <span className="text-sm text-gray-600">Target: {course.targetGrade}%</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePractice(course.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        Practice
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress: {course.progress}%</span>
                        <span>Assignments: {course.assignments}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}

              {progressData.courses.filter(c => c.status === 'needs_practice' || c.status === 'at_risk').length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-gray-600">Great job! All courses are on track.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Grade Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Grade Distribution</h2>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* All Courses List */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">All Courses</h2>
            <div className="space-y-4">
              {progressData.courses.map(course => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(course.status)}`}>
                      {getStatusText(course.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress: {course.progress}%</span>
                      <span className="font-semibold">Grade: {course.grade}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${course.progress}%`,
                          backgroundColor: course.status === 'excellent' ? '#10b981' : 
                                         course.status === 'good' ? '#3b82f6' : 
                                         course.status === 'needs_practice' ? '#f59e0b' : '#ef4444'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;