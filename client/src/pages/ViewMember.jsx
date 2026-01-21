import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;


export default function ViewMembers() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterDegree, setFilterDegree] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/members`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        setMembers(response.data);
        setFilteredMembers(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [API_URL]);

  useEffect(() => {
    let filtered = members;
    if (search) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.registernumber.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterDegree) {
      filtered = filtered.filter(member => member.degree === filterDegree);
    }
    setFilteredMembers(filtered);
  }, [search, filterDegree, members]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await axios.delete(`${API_URL}/api/members/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setMembers(members.filter(member => member._id !== id));
      } catch (err) {
        setError('Failed to delete member');
      }
    }
  };

  const degrees = [...new Set(members.map(member => member.degree))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">All Members</h2>

      {/* Search and Filter */}
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or register number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded flex-1"
        />
        <select
          value={filterDegree}
          onChange={(e) => setFilterDegree(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Degrees</option>
          {degrees.map(degree => (
            <option key={degree} value={degree}>{degree}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Register Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Degree</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <tr key={member._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={
                      member.profileImage
                        ? member.profileImage.startsWith("http")
                          ? member.profileImage
                          : `${API_URL}/${member.profileImage}`
                        : "/default-avatar.jpg"
                    }
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{member.registernumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{member.degree}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <Link
                    to={`/members/${member._id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit-member/${member._id}`}
                    className="text-green-500 hover:text-green-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

}
