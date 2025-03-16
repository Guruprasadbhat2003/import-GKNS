import React, { useState, useEffect } from 'react';

interface QuestionForm {
  question: string;
  options: string[];
  correctOption: number;
}

interface SuspiciousActivity {
  type: string;
  timestamp: string;
  questionNumber: number;
}

interface StudentLogin {
  username: string;
  timestamp: string;
  suspiciousActivities: SuspiciousActivity[];
}

export const FacultyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [loginHistory, setLoginHistory] = useState<StudentLogin[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  useEffect(() => {
    // Load student login history from local storage when component mounts
    const storedHistory = localStorage.getItem('studentLoginHistory');
    if (storedHistory) {
      setLoginHistory(JSON.parse(storedHistory));
    }
  }, []);

  const addNewQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctOption: 0 }]);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  // Format timestamp to a more readable format
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Group suspicious activities by student
  const getStudentNames = () => {
    return [...new Set(loginHistory.map(login => login.username))];
  };

  // Get activities for a specific student
  const getStudentActivities = (studentName: string) => {
    return loginHistory.filter(login => login.username === studentName);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-700 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Faculty Dashboard</h2>
        </div>
        
        <div className="mt-6">
          <button 
            onClick={() => handleSectionChange('log-report')}
            className="w-full text-left px-4 py-3 hover:bg-indigo-600"
          >
            Log Reports
          </button>

          <button 
            onClick={() => handleSectionChange('tech-requests')}
            className="w-full text-left px-4 py-3 hover:bg-indigo-600"
          >
            Technical Requests
          </button>

          <button 
            onClick={() => handleSectionChange('custom-questions')}
            className="w-full text-left px-4 py-3 hover:bg-indigo-600"
          >
            Custom Questions
          </button>

          <button 
            onClick={() => handleSectionChange('settings')}
            className="w-full text-left px-4 py-3 hover:bg-indigo-600"
          >
            Settings
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeSection === 'log-report' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Student Log Reports</h2>
            
            {loginHistory.length === 0 ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-700">No student login data available.</p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Student
                  </label>
                  <select 
                    className="w-64 border rounded p-2"
                    value={selectedStudent || ''}
                    onChange={(e) => setSelectedStudent(e.target.value || null)}
                  >
                    <option value="">All Students</option>
                    {getStudentNames().map((name, index) => (
                      <option key={index} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                {selectedStudent ? (
                  // View for a specific student
                  getStudentActivities(selectedStudent).map((login, loginIndex) => (
                    <div key={loginIndex} className="mb-6 bg-white shadow-md rounded-lg p-4">
                      <h3 className="text-lg font-semibold">
                        Login: {formatTimestamp(login.timestamp)}
                      </h3>
                      {login.suspiciousActivities && login.suspiciousActivities.length > 0 ? (
                        <div className="mt-3">
                          <h4 className="font-medium text-red-600">Suspicious Activities</h4>
                          <table className="w-full mt-2 border-collapse">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="text-left p-2 border">Type</th>
                                <th className="text-left p-2 border">Time</th>
                                <th className="text-left p-2 border">Question #</th>
                              </tr>
                            </thead>
                            <tbody>
                              {login.suspiciousActivities.map((activity, activityIndex) => (
                                <tr key={activityIndex} className={activity.type.includes('ESC') ? "bg-red-50" : ""}>
                                  <td className="p-2 border">{activity.type}</td>
                                  <td className="p-2 border">{formatTimestamp(activity.timestamp)}</td>
                                  <td className="p-2 border">{activity.questionNumber}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-green-600 mt-2">No suspicious activities detected.</p>
                      )}
                    </div>
                  ))
                ) : (
                  // Overview of all students
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getStudentNames().map((name, index) => {
                      const sessions = getStudentActivities(name);
                      const totalActivities = sessions.reduce(
                        (sum, session) => sum + (session.suspiciousActivities?.length || 0), 
                        0
                      );
                      const escKeyPresses = sessions.reduce((sum, session) => {
                        return sum + (session.suspiciousActivities?.filter(
                          act => act.type.includes('ESC')
                        ).length || 0);
                      }, 0);
                      
                      return (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg shadow ${
                            escKeyPresses > 0 ? 'bg-red-50 border border-red-200' : 'bg-white'
                          }`}
                          onClick={() => setSelectedStudent(name)}
                        >
                          <h3 className="font-bold text-lg">{name}</h3>
                          <p>Total Sessions: {sessions.length}</p>
                          <p>Last Login: {formatTimestamp(sessions[sessions.length - 1].timestamp)}</p>
                          <p className={escKeyPresses > 0 ? "text-red-600 font-semibold" : ""}>
                            Suspicious Activities: {totalActivities} (ESC key: {escKeyPresses})
                          </p>
                          <button 
                            className="mt-2 text-blue-600 hover:underline"
                            onClick={() => setSelectedStudent(name)}
                          >
                            View Details
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeSection === 'custom-questions' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Add Custom Questions</h2>
            {questions.map((q, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
                <input
                  type="text"
                  placeholder="Enter question"
                  value={q.question}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index].question = e.target.value;
                    setQuestions(updatedQuestions);
                  }}
                  className="w-full p-2 border rounded mb-2"
                />

                {q.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={q.correctOption === optIndex}
                      onChange={() => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[index].correctOption = optIndex;
                        setQuestions(updatedQuestions);
                      }}
                      className="mr-2"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${optIndex + 1}`}
                      value={option}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[index].options[optIndex] = e.target.value;
                        setQuestions(updatedQuestions);
                      }}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                ))}
              </div>
            ))}
            <button 
              onClick={addNewQuestion}
              className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
            >
              Add Another Question
            </button>
          </div>
        )}

        {activeSection === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="mb-4">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all student login data?')) {
                    localStorage.removeItem('studentLoginHistory');
                    setLoginHistory([]);
                    alert('All student login data has been cleared.');
                  }
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-4"
              >
                Clear Student Log Data
              </button>
            </div>
            <button 
              onClick={() => alert('Redirecting to login...')}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};