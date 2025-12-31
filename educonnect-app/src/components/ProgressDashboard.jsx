import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen,
  Target,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from 'lucide-react';

const ProgressDashboard = ({ 
  isAuthenticated, 
  setShowLogin,
  API_URL = 'https://hult.onrender.com'
}) => {
  const [progressData, setProgressData] = useState({
    overallProgress: 0,
    courses: [],
    statistics: {
      highGrade: 0,
      mediumGrade: 0,
      lowGrade: 0,
      failing: 0,
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProgressData();
    }
  }, [isAuthenticated]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/student/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProgressData({
          overallProgress: data.overallProgress || 0,
          courses: data.courses || [],
          statistics: data.statistics || {
            highGrade: 0,
            mediumGrade: 0,
            lowGrade: 0,
            failing: 0,
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center py-12">
        <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Progress Dashboard</h3>
        <p className="text-gray-600 mb-4">Please log in to view your progress</p>
        <button 
          onClick={() => setShowLogin(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p>Loading progress data...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Progress Dashboard</h1>
        </div>
        <p className="text-gray-600">Track your course completion and performance</p>
      </div>

      {/* Overall Progress Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Overall Progress</h3>
            <p className="text-blue-100">Across all enrolled courses</p>
          </div>
          <div className="text-3xl font-bold">{progressData.overallProgress}%</div>
        </div>
        <div className="w-full bg-white/30 rounded-full h-3">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressData.overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-100">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{progressData.statistics.highGrade}</div>
              <div className="text-sm text-gray-600">Courses (A)</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{progressData.statistics.mediumGrade}</div>
              <div className="text-sm text-gray-600">Courses (B)</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-amber-100">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{progressData.statistics.lowGrade}</div>
              <div className="text-sm text-gray-600">Courses (C/D)</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-100">
              <Target className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{progressData.statistics.failing}</div>
              <div className="text-sm text-gray-600">Needs Focus</div>
            </div>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">My Courses Progress</h2>
        </div>
        
        <div className="p-4">
          {progressData.courses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No enrolled courses yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {progressData.courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(course.status)}`}>
                      {getStatusText(course.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress: {course.progress}%</span>
                      <span>Grade: {course.grade ? `${course.grade}%` : 'Not graded'}</span>
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
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Target: {course.targetGrade}%</span>
                      <span>Assignments: {course.assignments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => window.location.href = '/courses'}
          className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <BookOpen className="w-5 h-5" />
          Browse More Courses
        </button>
        
        <button 
          onClick={() => window.location.href = '/assignments'}
          className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
        >
          <Target className="w-5 h-5" />
          View Assignments
        </button>
      </div>
    </div>
  );
};

export default ProgressDashboard;