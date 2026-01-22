import React, { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle, Clock, AlertCircle, X, Eye, Plus } from 'lucide-react';

const TutorAssignmentsView = ({ API_URL = 'https://hult.onrender.com', onBack }) => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [gradeData, setGradeData] = useState({
    score: '',
    grade: '',
    feedback: ''
  });
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/tutor/assignments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAssignments(data.assignments || []);
        
        // Fetch submissions for the first assignment if available
        if (data.assignments && data.assignments.length > 0) {
          const firstAssignmentId = data.assignments[0].id;
          setSelectedAssignmentId(firstAssignmentId);
          fetchAllSubmissions(firstAssignmentId);
        }
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSubmissions = async (assignmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/tutor/assignments/${assignmentId}/submissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmission || !gradeData.score || !gradeData.grade) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/tutor/assignments/${selectedSubmission.assignment_id}/grade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          submission_id: selectedSubmission.id,
          score: parseInt(gradeData.score),
          grade: gradeData.grade,
          feedback: gradeData.feedback
        })
      });

      if (response.ok) {
        alert('Assignment graded successfully!');
        setIsGradingModalOpen(false);
        setGradeData({ score: '', grade: '', feedback: '' });
        fetchAllSubmissions(selectedSubmission.assignment_id);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to grade assignment');
      }
    } catch (error) {
      console.error('Failed to grade assignment:', error);
      alert('Failed to grade assignment');
    }
  };

  const createTestAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/create-test-assignment`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // Refresh assignments list
        fetchAssignments();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create test assignment');
      }
    } catch (error) {
      console.error('Failed to create test assignment:', error);
      alert('Failed to create test assignment');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'graded': return 'bg-emerald-100 text-emerald-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'late': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Grade Assignments</h1>
          </div>
          <button
            onClick={createTestAssignment}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="w-4 h-4" />
            Create Test Assignment
          </button>
        </div>
        <p className="text-gray-600">Review and grade student submissions</p>
      </div>

      {/* Assignments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 mb-4">No assignments created yet</p>
          <button
            onClick={createTestAssignment}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Your First Test Assignment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Your Assignments</h2>
          {assignments.map((assignment) => (
            <div 
              key={assignment.id} 
              className={`bg-white rounded-lg shadow p-4 border ${selectedAssignmentId === assignment.id ? 'border-blue-500 border-2' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{assignment.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Course: {assignment.course_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600 mb-1">Due Date</p>
                  <p className="font-medium">{new Date(assignment.due_date).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600 mb-1">Total Submissions</p>
                  <p className="font-medium">{assignment.submissions_count}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600 mb-1">Graded</p>
                  <p className="font-medium">{assignment.graded_count}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600 mb-1">Max Score</p>
                  <p className="font-medium">{assignment.max_score}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedAssignmentId(assignment.id);
                    fetchAllSubmissions(assignment.id);
                  }}
                  className={`flex-1 py-2 rounded transition ${selectedAssignmentId === assignment.id ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {selectedAssignmentId === assignment.id ? 'Viewing Submissions' : 'View Submissions'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submissions List */}
      {selectedAssignmentId && submissions.length > 0 ? (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Submissions</h2>
            <span className="text-sm text-gray-600">
              Showing {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-3">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{submission.student_name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted: {new Date(submission.submitted_at).toLocaleString()}
                    </p>
                    {submission.late_submission && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 mt-1 text-xs bg-red-100 text-red-800 rounded">
                        <AlertCircle className="w-3 h-3" />
                        Late Submission
                      </span>
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(submission.status)}`}>
                    {submission.status === 'graded' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </span>
                </div>

                {submission.comments && (
                  <div className="mb-3 bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-700 mb-1">Student Comments:</p>
                    <p className="text-sm text-gray-600">{submission.comments}</p>
                  </div>
                )}

                {submission.files && submission.files.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-2 text-gray-700">Submitted Files:</p>
                    <div className="space-y-1">
                      {submission.files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-700">{file.filename}</span>
                          </div>
                          <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {submission.status === 'graded' ? (
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">
                        Score: {submission.score}/{submission.max_score}
                      </span>
                      <span className="font-semibold text-gray-800">Grade: {submission.grade}</span>
                    </div>
                    {submission.feedback && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
                        <p className="text-sm text-gray-700 bg-white p-2 rounded">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setGradeData({
                          score: '',
                          grade: '',
                          feedback: ''
                        });
                        setIsGradingModalOpen(true);
                      }}
                      className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                      Grade Submission
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : selectedAssignmentId && submissions.length === 0 ? (
        <div className="mt-8 text-center py-8">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No submissions yet for this assignment</p>
          <p className="text-sm text-gray-500 mt-1">Students haven't submitted their work yet</p>
        </div>
      ) : null}

      {/* Grading Modal */}
      {isGradingModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Grade Assignment</h2>
                <button 
                  onClick={() => setIsGradingModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800">Student: {selectedSubmission.student_name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Submitted: {new Date(selectedSubmission.submitted_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Max Score: {selectedSubmission.max_score}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Score (out of {selectedSubmission.max_score})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={selectedSubmission.max_score}
                    value={gradeData.score}
                    onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter score"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Letter Grade</label>
                  <select
                    value={gradeData.grade}
                    onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="">Select Grade</option>
                    <option value="A+">A+ (97-100)</option>
                    <option value="A">A (93-96)</option>
                    <option value="A-">A- (90-92)</option>
                    <option value="B+">B+ (87-89)</option>
                    <option value="B">B (83-86)</option>
                    <option value="B-">B- (80-82)</option>
                    <option value="C+">C+ (77-79)</option>
                    <option value="C">C (73-76)</option>
                    <option value="C-">C- (70-72)</option>
                    <option value="D+">D+ (67-69)</option>
                    <option value="D">D (63-66)</option>
                    <option value="D-">D- (60-62)</option>
                    <option value="F">F (Below 60)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                  <textarea
                    value={gradeData.feedback}
                    onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Provide constructive feedback to the student..."
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsGradingModalOpen(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGradeSubmission}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Submit Grade
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorAssignmentsView;