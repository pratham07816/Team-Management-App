import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export default function EditMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    registernumber: '',
    year: '1',
    degree: 'B.Tech',
    about: '',
    certificate: '',
    internship: ''
  });

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/members/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        setFormData({
          name: res.data.name,
          registernumber: res.data.registernumber,
          year: res.data.year,
          degree: res.data.degree,
          about: res.data.about || '',
          certificate: res.data.certificate || '',
          internship: res.data.internship || ''
        });
      } catch (err) {
        alert('Failed to fetch member data');
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/members/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Member updated successfully!');
      navigate('/view-members');
    } catch (error) {
      console.error(error);
      alert('Failed to update member');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Team Member</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name & Register Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Register Number</label>
            <input
              type="text"
              name="registernumber"
              value={formData.registernumber}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Year & Degree */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Year of Study</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
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
              value={formData.degree}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MBA">MBA</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
        </div>

        {/* About */}
        <div>
          <label className="block text-gray-700 mb-2">About You</label>
          <textarea
            name="about"
            rows="3"
            value={formData.about}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Certificate & Internship */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Certifications</label>
            <input
              type="text"
              name="certificate"
              value={formData.certificate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Internship Experience</label>
            <input
              type="text"
              name="internship"
              value={formData.internship}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Update Member
        </button>
      </form>
    </div>
  );
}

