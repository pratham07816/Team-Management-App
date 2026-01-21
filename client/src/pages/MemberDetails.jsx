import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function MemberDetails() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/members/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMember(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching member details");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error: </strong> {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* ===== Profile Header ===== */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex items-center space-x-6">
            <img
              src={
                member.profileImage
                  ? member.profileImage.startsWith("http")
                    ? member.profileImage
                    : member.profileImage.startsWith("uploads/")
                      ? `http://localhost:3001/${member.profileImage}`
                      : `http://localhost:3001/uploads/${member.profileImage}`
                  : "/default-avatar.jpg"
              }
              alt={member.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />

            <div>
              <h1 className="text-3xl font-bold text-white">{member.name}</h1>
              <p className="text-blue-100">{member.degree}</p>
              <span className="inline-block mt-2 bg-white/20 px-3 py-1 rounded-full text-sm text-white">
                REG: {member.registernumber}
              </span>
            </div>
          </div>
        </div>

        {/* ===== Details Section ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">

          {/* Left Column */}
          <div className="space-y-6">
            <Section title="Personal Information">
              <InfoItem label="Email" value={member.email} />
              <InfoItem label="Phone" value={member.phone} />
              <InfoItem label="Year of Study" value={`Year ${member.year}`} />
            </Section>

            <Section title="Certifications">
              {member.certificate ? (
                member.certificate.split(", ").map((cert, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="ml-2">{cert}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No certifications listed</p>
              )}
            </Section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Section title="Internship Experience">
              <p className="text-gray-600">
                {member.internship || "No internship experience listed"}
              </p>
            </Section>

            <Section title="About Me">
              <p className="text-gray-600">
                {member.about || "No description provided"}
              </p>
            </Section>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ===== Reusable Components ===== */

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="text-gray-500">{label}:</span>
    <span className="text-gray-700 font-medium">{value || "N/A"}</span>
  </div>
);
