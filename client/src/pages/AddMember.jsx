import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddMember() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    registernumber: '',
    year: '1',
    degree: 'B.Tech',
    about: '',
    certificate: '',
    internship: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.registernumber || !profileImage) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const data = new FormData();
      data.append('profileImage', profileImage);
      
      // Append other form data
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const token = localStorage.getItem("token");

      const API_URL = process.env.REACT_APP_API_URL;

      const response = await axios.post(
        `${API_URL}/api/members`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.status === 201) {
        alert('Member added successfully!');
        navigate('/view-members');
      }
    } catch (error) {
      console.error("FULL ERROR:", error.response?.data);
      alert(JSON.stringify(error.response?.data));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Register New Team Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Photo Upload */}
        <div>
          <label className="block text-gray-700 mb-2">Professional Photo (Required)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name (Required)</label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-2 border rounded-md"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Register Number (Required)</label>
            <input
              type="text"
              name="registernumber"
              required
              className="w-full p-2 border rounded-md"
              value={formData.registernumber}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Year of Study</label>
            <select
              name="year"
              className="w-full p-2 border rounded-md"
              value={formData.year}
              onChange={handleInputChange}
            >
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Degree Program</label>
            <select
              name="degree"
              className="w-full p-2 border rounded-md"
              value={formData.degree}
              onChange={handleInputChange}
            >
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MBA">MBA</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <label className="block text-gray-700 mb-2">About You</label>
          <textarea
            name="about"
            rows="3"
            className="w-full p-2 border rounded-md"
            value={formData.about}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Certifications</label>
            <input
              type="text"
              name="certificate"
              className="w-full p-2 border rounded-md"
              value={formData.certificate}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Internship Experience</label>
            <input
              type="text"
              name="internship"
              className="w-full p-2 border rounded-md"
              value={formData.internship}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Register Member
        </button>
      </form>
    </div>
  );

}

