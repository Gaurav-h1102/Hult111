// src/components/AssignmentsScreen.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Upload,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Send,
  Filter,
  Search,
  ChevronDown,
  User,
  ChartBar
} from 'lucide-react';

const AssignmentsScreen = () => {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Statistics Project: Data Analysis',
      course: 'Business Statistics',
      courseCode: 'BUS101',
      dueDate: '2024-02-15',
      submittedDate: '2024-02-14',
      status: 'graded',
      score: 95,
      maxScore: 100,
      classAverage: 82,
      grade: 'A',
      feedback: 'Excellent analysis! Great use of regression models. Consider adding more real-world examples.',
      files: ['project_report.pdf', 'data_analysis.xlsx'],
      lateSubmission: false,
      professor: 'Dr. Johnson',
      rubric: [
        { criterion: 'Data Analysis', score: 25, max: 25 },
        { criterion: 'Methodology', score: 30, max: 30 },
        { criterion: 'Conclusions', score: 25, max: 25 },
        { criterion: 'Presentation', score: 15, max: 20 },
      ],
    },
    {
      id: 2,
      title: 'Accounting Balance Sheet',
      course: 'Financial Accounting',
      courseCode: 'ACC201',
      dueDate: '2024-02-10',
      submittedDate: '2024-02-09',
      status: 'graded',
      score: 68,
      maxScore: 100,
      classAverage: 71,
      grade: 'D+',
      feedback: 'Please review double-entry principles. Some entries don\'t balance. Office hours available Tue/Thu.',
      files: ['balance_sheet.xlsx'],
      lateSubmission: false,
      professor: 'Prof. Chen',
      rubric: [
        { criterion: 'Accuracy', score: 40, max: 50 },
        { criterion: 'Formatting', score: 18, max: 20 },
        { criterion: 'Completeness', score: 10, max: 30 },
      ],
    },
    {
      id: 3,
      title: 'Marketing Campaign Pitch',
      course: 'Marketing Management',
      courseCode: 'MKT301',
      dueDate: '2024-02-20',
      submittedDate: null,
      status: 'pending',
      score: null,
      maxScore: 100,
      classAverage: null,
      grade: null,
      feedback: null,
      files: [],
      lateSubmission: false,
      professor: 'Dr. Rodriguez',
      rubric: null,
    },
    {
      id: 4,
      title: 'Organizational Behavior Case Study',
      course: 'Organizational Behavior',
      courseCode: 'ORG401',
      dueDate: '2024-02-05',
      submittedDate: '2024-02-06',
      status: 'graded',
      score: 85,
      maxScore: 100,
      classAverage: 78,
      grade: 'B',
      feedback: 'Good analysis of team dynamics. Could explore more cultural factors.',
      files: ['case_study.docx'],
      lateSubmission: true,
      professor: 'Prof. Williams',
      rubric: [
        { criterion: 'Analysis', score: 40, max: 45 },
        { criterion: 'Theory Application', score: 30, max: 35 },
        { criterion: 'Recommendations', score: 15, max: 20 },
      ],
    },
  ]);

  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [comments, setComments] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFiles(prev => [
      ...prev,
      ...acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxSize: 10485760, // 10MB
  });

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAssignment = () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file');
      return;
    }

    alert('Assignment submitted successfully!');
    setIsSubmitModalOpen(false);
    setUploadedFiles([]);
    setComments('');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'graded': return 'bg-emerald-100 text-emerald-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'late': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'graded': return <CheckCircle className="w-4 h-4" />;
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'late': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const gradeDistribution = [
    { name: 'A', value: assignments.filter(a => a.grade && ['A', 'A+', 'A-'].includes(a.grade)).length, color: '#10b981' },
    { name: 'B', value: assignments.filter(a => a.grade && ['B', 'B+', 'B-'].includes(a.grade)).length, color: '#0ea5e9' },
    { name: 'C', value: assignments.filter(a => a.grade && ['C', 'C+', 'C-'].includes(a.grade)).length, color: '#f59e0b' },
    { name: 'D', value: assignments.filter(a => a.grade && ['D', 'D+', 'D-'].includes(a.grade)).length, color: '#f97316' },
    { name: 'F', value: assignments.filter(a => a.grade && ['F'].includes(a.grade)).length, color: '#ef4444' },
  ];

  const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#f97316', '#ef4444'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Assignments & Grades</h1>
            </div>
            <p className="text-gray-600">Submit assignments and track your grades</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-lg">
              <div className="text-sm">Overall Grade</div>
              <div className="text-2xl font-bold">82.5%</div>
            </div>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Submit New Assignment
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Courses</option>
              <option value="BUS101">Business Statistics</option>
              <option value="ACC201">Financial Accounting</option>
              <option value="MKT301">Marketing Management</option>
              <option value="ORG401">Organizational Behavior</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="late">Late</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Due Date</option>
              <option>Submission Date</option>
              <option>Grade</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Stats</label>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center bg-white p-3 rounded-lg border">
                <div className="text-lg font-bold text-blue-600">{assignments.length}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center bg-white p-3 rounded-lg border">
                <div className="text-lg font-bold text-blue-600">
                  {assignments.filter(a => a.status !== 'pending').length}
                </div>
                <div className="text-xs text-gray-600">Submitted</div>
              </div>
              <div className="text-center bg-white p-3 rounded-lg border">
                <div className="text-lg font-bold text-blue-600">
                  {assignments.filter(a => a.score).length > 0 
                    ? (assignments.filter(a => a.score).reduce((sum, a) => sum + (a.score / a.maxScore * 100), 0) / assignments.filter(a => a.score).length).toFixed(1) + '%'
                    : '-'
                  }
                </div>
                <div className="text-xs text-gray-600">Avg Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Distribution Chart */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Grade Distribution</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Your Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Avg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feedback
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{assignment.title}</div>
                      {assignment.lateSubmission && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                          Late
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                        {assignment.courseCode}
                      </span>
                      <div className="text-sm text-gray-600 mt-1">{assignment.course}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{assignment.dueDate}</div>
                    {assignment.submittedDate && (
                      <div className="text-xs text-gray-500">Submitted: {assignment.submittedDate}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                      {getStatusIcon(assignment.status)}
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {assignment.score !== null ? (
                      <div className={`text-lg font-bold ${getScoreColor(assignment.score / assignment.maxScore * 100)}`}>
                        {assignment.score}/{assignment.maxScore}
                        <div className="text-sm font-normal">
                          ({((assignment.score / assignment.maxScore) * 100).toFixed(1)}%)
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {assignment.classAverage ? (
                      <div className="text-gray-900">{assignment.classAverage}%</div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {assignment.feedback ? (
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 truncate">{assignment.feedback}</p>
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setIsDetailsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                        >
                          View full feedback
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">No feedback yet</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {assignment.status === 'pending' ? (
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setIsSubmitModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Submit
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setIsDetailsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Assignment Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Submit Assignment</h2>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Assignment
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue=""
                  >
                    <option value="">Choose an assignment...</option>
                    {assignments
                      .filter(a => a.status === 'pending')
                      .map(assignment => (
                        <option key={assignment.id} value={assignment.id}>
                          {assignment.courseCode}: {assignment.title}
                        </option>
                      ))}
                  </select>
                </div>

                {selectedAssignment && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Assignment Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Course:</span>
                        <span className="ml-2 font-medium">{selectedAssignment.course}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Due Date:</span>
                        <span className="ml-2 font-medium">{selectedAssignment.dueDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Professor:</span>
                        <span className="ml-2 font-medium">{selectedAssignment.professor}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Points:</span>
                        <span className="ml-2 font-medium">{selectedAssignment.maxScore}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Files
                  </label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-700">
                      {isDragActive ? 'Drop files here...' : 'Drag & drop files here or click to browse'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Supports: PDF, DOC, DOCX, PPT, XLS (Max: 10MB each)
                    </p>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">{file.name}</div>
                              <div className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments to Professor
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows="3"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any comments or notes about your submission..."
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="confirmation" className="mt-1" required />
                  <label htmlFor="confirmation" className="text-sm text-gray-700">
                    I confirm this is my original work and complies with academic integrity policies
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAssignment}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={uploadedFiles.length === 0}
                >
                  <Send className="w-4 h-4" />
                  Submit Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Details Modal */}
      {isDetailsModalOpen && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Assignment Details</h2>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Grade Display */}
                <div className="flex items-center gap-8">
                  <div className="bg-blue-600 text-white p-6 rounded-xl min-w-[180px] text-center">
                    <div className="text-3xl font-bold">
                      {selectedAssignment.score}/{selectedAssignment.maxScore}
                    </div>
                    <div className="text-lg opacity-90">
                      {((selectedAssignment.score / selectedAssignment.maxScore) * 100).toFixed(1)}%
                    </div>
                    {selectedAssignment.grade && (
                      <div className="mt-2 text-sm bg-white text-blue-600 px-3 py-1 rounded-full inline-block font-bold">
                        {selectedAssignment.grade}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">
                        Professor: <span className="font-semibold">{selectedAssignment.professor}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">
                        Due: <span className="font-semibold">{selectedAssignment.dueDate}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">
                        Submitted: <span className="font-semibold">{selectedAssignment.submittedDate || 'Not submitted'}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChartBar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">
                        Class Average: <span className="font-semibold">{selectedAssignment.classAverage || '-'}%</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                {selectedAssignment.feedback && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Professor's Feedback</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedAssignment.feedback}</p>
                  </div>
                )}

                {/* Rubric */}
                {selectedAssignment.rubric && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Grading Rubric</h3>
                    <div className="space-y-4">
                      {selectedAssignment.rubric.map((item, index) => {
                        const percentage = ((item.score / item.max) * 100).toFixed(1);
                        return (
                          <div key={index} className="bg-white border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">{item.criterion}</span>
                              <span className="text-gray-700">
                                {item.score}/{item.max} ({percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Files */}
                {selectedAssignment.files.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Submitted Files</h3>
                    <div className="space-y-2">
                      {selectedAssignment.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">{file}</span>
                          </div>
                          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsScreen;