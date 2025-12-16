// Add this new component file: components/TutorCertificatesView.jsx

import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, Heart, Users, Download, CheckCircle, Lock, Star } from 'lucide-react';

const TutorCertificatesView = ({ onClose }) => {
  const [achievements, setAchievements] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [availableAchievements, setAvailableAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('earned'); // 'earned' or 'available'

  useEffect(() => {
    fetchAchievements();
    fetchAvailableAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tutor/achievements', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAchievements(data.achievements || []);
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableAchievements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tutor/achievements/available', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAvailableAchievements(data.achievements || []);
    } catch (error) {
      console.error('Error fetching available achievements:', error);
    }
  };

  const downloadCertificate = async (certificateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tutor/certificates/${certificateId}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate');
    }
  };

  const getTierColor = (tier) => {
    const colors = {
      bronze: 'from-orange-600 to-orange-800',
      silver: 'from-gray-400 to-gray-600',
      gold: 'from-yellow-500 to-yellow-700',
      platinum: 'from-purple-500 to-purple-700'
    };
    return colors[tier] || 'from-blue-500 to-blue-700';
  };

  const getTierBadgeColor = (tier) => {
    const colors = {
      bronze: 'bg-orange-100 text-orange-800 border-orange-300',
      silver: 'bg-gray-100 text-gray-800 border-gray-300',
      gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      platinum: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return colors[tier] || 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const getTypeIcon = (type) => {
    const icons = {
      hours: TrendingUp,
      success: Star,
      volunteer: Heart
    };
    const Icon = icons[type] || Award;
    return <Icon size={24} />;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p>Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">🏆 Your Achievements</h2>
              <p className="text-purple-100">Certificates earned through excellence in teaching</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition"
            >
              ✕
            </button>
          </div>

          {/* Metrics Summary */}
          {metrics && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <TrendingUp className="mb-2" size={24} />
                <p className="text-2xl font-bold">{metrics.total_hours_taught}</p>
                <p className="text-sm text-purple-100">Hours Taught</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <Star className="mb-2" size={24} />
                <p className="text-2xl font-bold">{metrics.students_improved}</p>
                <p className="text-sm text-purple-100">Students Improved</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <Heart className="mb-2" size={24} />
                <p className="text-2xl font-bold">{metrics.pro_bono_hours}</p>
                <p className="text-sm text-purple-100">Pro Bono Hours</p>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('earned')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'earned'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Earned ({achievements.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'available'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Available ({availableAchievements.filter(a => !a.earned).length})
          </button>
        </div>

        <div className="p-6">
          {/* Earned Achievements Tab */}
          {activeTab === 'earned' && (
            <div className="space-y-4">
              {achievements.length === 0 ? (
                <div className="text-center py-12">
                  <Award size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Achievements Yet</h3>
                  <p className="text-gray-600 mb-4">Start teaching and contributing to earn your first certificate!</p>
                </div>
              ) : (
                achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`bg-gradient-to-r ${getTierColor(achievement.tier)} rounded-lg p-6 text-white shadow-lg transform hover:scale-105 transition`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                        {getTypeIcon(achievement.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">{achievement.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getTierBadgeColor(achievement.tier)}`}>
                            {achievement.tier.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-white/90 mb-3">{achievement.description}</p>
                        
                        <div className="flex flex-wrap gap-3 text-sm">
                          <div className="bg-white/20 px-3 py-1 rounded">
                            📅 Earned: {new Date(achievement.earned_at).toLocaleDateString()}
                          </div>
                          <div className="bg-white/20 px-3 py-1 rounded">
                            🎯 Value: {achievement.metric_value}
                          </div>
                          <div className="bg-white/20 px-3 py-1 rounded">
                            🆔 {achievement.certificate_id.split('-')[0]}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => downloadCertificate(achievement.certificate_id)}
                        className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition flex items-center gap-2 font-semibold"
                      >
                        <Download size={20} />
                        Download
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Available Achievements Tab */}
          {activeTab === 'available' && (
            <div className="space-y-6">
              {/* Hours Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="text-blue-600" />
                  Teaching Hours Achievements
                </h3>
                <div className="grid gap-3">
                  {availableAchievements.filter(a => a.type === 'hours').map((ach, index) => (
                    <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {ach.earned ? (
                            <CheckCircle className="text-green-500" size={24} />
                          ) : (
                            <Lock className="text-gray-400" size={24} />
                          )}
                          <h4 className="font-semibold text-gray-800">{ach.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-semibold border ${getTierBadgeColor(ach.tier)}`}>
                            {ach.tier}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          {ach.current} / {ach.target} hours
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            ach.earned ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${ach.progress}%` }}
                        ></div>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        {ach.earned ? '✅ Completed!' : `${Math.ceil(ach.target - ach.current)} hours remaining`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Star className="text-yellow-600" />
                  Student Success Achievements
                </h3>
                <div className="grid gap-3">
                  {availableAchievements.filter(a => a.type === 'success').map((ach, index) => (
                    <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {ach.earned ? (
                            <CheckCircle className="text-green-500" size={24} />
                          ) : (
                            <Lock className="text-gray-400" size={24} />
                          )}
                          <h4 className="font-semibold text-gray-800">{ach.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-semibold border ${getTierBadgeColor(ach.tier)}`}>
                            {ach.tier}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          {ach.current} / {ach.target} students
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            ach.earned ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${ach.progress}%` }}
                        ></div>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        {ach.earned ? '✅ Completed!' : `${Math.ceil(ach.target - ach.current)} students remaining`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Volunteer Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Heart className="text-red-600" />
                  Volunteer Contributions
                </h3>
                <div className="grid gap-3">
                  {availableAchievements.filter(a => a.type === 'volunteer').map((ach, index) => (
                    <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {ach.earned ? (
                            <CheckCircle className="text-green-500" size={24} />
                          ) : (
                            <Lock className="text-gray-400" size={24} />
                          )}
                          <h4 className="font-semibold text-gray-800">{ach.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-semibold border ${getTierBadgeColor(ach.tier)}`}>
                            {ach.tier}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          {ach.current} / {ach.target}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            ach.earned ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${ach.progress}%` }}
                        ></div>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        {ach.earned ? '✅ Completed!' : `${Math.ceil(ach.target - ach.current)} remaining`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorCertificatesView;