import React, { useState, useEffect } from 'react';
import { User, BookOpen, Clock, Globe, Edit2, Save, X } from 'lucide-react';

const StudentProfile = ({ onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    learning_style: '',
    preferred_subjects: [],
    skill_level: '',
    learning_goals: '',
    available_time: '',
    preferred_languages: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/student/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.profile) {
        setProfile(data.profile);
        setFormData({
          learning_style: data.profile.learning_style || '',
          preferred_subjects: data.profile.preferred_subjects || [],
          skill_level: data.profile.skill_level || '',
          learning_goals: data.profile.learning_goals || '',
          available_time: data.profile.available_time || '',
          preferred_languages: data.profile.preferred_languages || []
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        setEditing(false);
        fetchProfile();
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Student Profile</h2>
                <p className="text-blue-100 text-sm">Manage your learning preferences</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!profile || !profile.survey_completed ? (
            <div className="text-center py-8">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Profile Yet</h3>
              <p className="text-gray-600 mb-4">Complete the survey to create your learning profile</p>
              <button 
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Complete Survey
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Learning Style */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <BookOpen size={20} className="text-blue-600" />
                    Learning Style
                  </h3>
                </div>
                {editing ? (
                  <select
                    value={formData.learning_style}
                    onChange={(e) => setFormData({...formData, learning_style: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="visual">Visual</option>
                    <option value="auditory">Auditory</option>
                    <option value="kinesthetic">Kinesthetic</option>
                    <option value="reading">Reading/Writing</option>
                  </select>
                ) : (
                  <p className="text-gray-700 capitalize">{profile.learning_style}</p>
                )}
              </div>

              {/* Preferred Subjects */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Preferred Subjects</h3>
                {editing ? (
                  <input
                    type="text"
                    value={formData.preferred_subjects.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData, 
                      preferred_subjects: e.target.value.split(',').map(s => s.trim())
                    })}
                    placeholder="Math, Science, English"
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.preferred_subjects.map((subject, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {subject}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Skill Level */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Skill Level</h3>
                {editing ? (
                  <select
                    value={formData.skill_level}
                    onChange={(e) => setFormData({...formData, skill_level: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                ) : (
                  <p className="text-gray-700 capitalize">{profile.skill_level}</p>
                )}
              </div>

              {/* Learning Goals */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Learning Goals</h3>
                {editing ? (
                  <textarea
                    value={formData.learning_goals}
                    onChange={(e) => setFormData({...formData, learning_goals: e.target.value})}
                    className="w-full p-2 border rounded h-24"
                    placeholder="What do you want to achieve?"
                  />
                ) : (
                  <p className="text-gray-700">{profile.learning_goals || 'Not set'}</p>
                )}
              </div>

              {/* Available Time */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Clock size={20} className="text-blue-600" />
                  Available Time
                </h3>
                {editing ? (
                  <select
                    value={formData.available_time}
                    onChange={(e) => setFormData({...formData, available_time: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                ) : (
                  <p className="text-gray-700 capitalize">{profile.available_time}</p>
                )}
              </div>

              {/* Languages */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Globe size={20} className="text-blue-600" />
                  Preferred Languages
                </h3>
                {editing ? (
                  <input
                    type="text"
                    value={formData.preferred_languages.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferred_languages: e.target.value.split(',').map(l => l.trim())
                    })}
                    placeholder="English, Spanish"
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.preferred_languages.map((lang, idx) => (
                      <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {profile && profile.survey_completed && (
          <div className="p-6 border-t flex justify-end gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => {
                    setEditing(false);
                    // Reset form data
                    setFormData({
                      learning_style: profile.learning_style || '',
                      preferred_subjects: profile.preferred_subjects || [],
                      skill_level: profile.skill_level || '',
                      learning_goals: profile.learning_goals || '',
                      available_time: profile.available_time || '',
                      preferred_languages: profile.preferred_languages || []
                    });
                  }}
                  className="px-6 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <Save size={20} />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit2 size={20} />
                Edit Profile
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;