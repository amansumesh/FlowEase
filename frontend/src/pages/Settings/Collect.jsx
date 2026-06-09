import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import { KeyRound, Eye, EyeOff, Phone, Save, CheckCircle2, AlertCircle, Loader2, User, Calendar, Bell, ChevronDown } from "lucide-react";

function Collect() {
  // User Profile
  const [profile, setProfile] = useState({ name: "", email: "", profilePic: "" });

  // Settings states
  const [clientID, setClientID] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [phone, setPhone] = useState("");
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [calendarSyncEnabled, setCalendarSyncEnabled] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState("15m");

  // UI Status states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        if (response.data.success && response.data.user) {
          const u = response.data.user;
          setProfile({
            name: u.name || "User",
            email: u.email || "",
            profilePic: u.profilePic || ""
          });
          setClientID(u.clientId || "");
          setClientSecret(u.clientSecret || "");
          setPhone(u.phoneNumber || "");
          setSmsEnabled(u.smsNotificationsEnabled ?? false);
          setCalendarSyncEnabled(u.googleCalendarSyncEnabled ?? true);
          setSyncFrequency(u.syncFrequency || "15m");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        setMessage("Failed to load user settings.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: if SMS is enabled, phone number is required
    if (smsEnabled && (!phone || !/^[0-9]{10}$/.test(phone))) {
      setMessage("A valid 10-digit phone number is required when SMS reminders are enabled.");
      setMessageType("error");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      const response = await axios.post("/api/settings/google", {
        clientId: clientID,
        clientSecret: clientSecret,
        phoneNumber: smsEnabled ? phone : "", // clear phone if SMS is disabled
        smsNotificationsEnabled: smsEnabled,
        googleCalendarSyncEnabled: calendarSyncEnabled,
        syncFrequency: syncFrequency,
      });

      if (response.data.success) {
        setMessage("Settings saved successfully!");
        setMessageType("success");
      } else {
        setMessage(response.data.message || "Failed to save settings.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage(error.response?.data?.message || "Server error. Please try again.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading configurations...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-purple-500/10">
      
      {/* Dynamic Keyframes Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out forwards;
        }
      `}} />

      {/* User Profile Card Header */}
      <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-gray-100 mb-6">
        <div className="relative">
          {profile.profilePic ? (
            <img
              src={profile.profilePic}
              alt="profile"
              className="h-20 w-20 rounded-full border-4 border-purple-100 object-cover shadow-sm"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-20 w-20 rounded-full border-4 border-purple-100 bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-sm shrink-0">
              {profile.name ? profile.name[0].toUpperCase() : "U"}
            </div>
          )}
          <div className="absolute bottom-0 right-0 h-5 w-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center" title="Google Sync Active">
            <span className="h-2.5 w-2.5 bg-white rounded-full animate-ping absolute" />
            <span className="h-2 w-2 bg-white rounded-full relative" />
          </div>
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
            <span className="inline-block sm:self-center px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full w-fit mx-auto sm:mx-0">
              Google Account Connected
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
        </div>
      </div>

      {/* Status Messages */}
      {message && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl mb-6 border animate-slideDown transition-all duration-300 ${
            messageType === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {messageType === "success" ? (
            <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mt-0.5 text-rose-600 shrink-0" />
          )}
          <div>
            <p className="text-sm font-semibold">
              {messageType === "success" ? "Success" : "Error"}
            </p>
            <p className="text-xs mt-0.5 opacity-90">{message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Sync Preferences */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-purple-600" />
            <h3 className="text-md font-bold text-gray-700">Sync & Notifications</h3>
          </div>

          <div className="space-y-4">
            {/* Google Calendar Sync Switch */}
            <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-gray-50/80 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">Google Calendar Sync</span>
                <span className="text-xs text-gray-500 mt-0.5">Automatically pull and update tasks from Google Calendar.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={calendarSyncEnabled}
                  onChange={(e) => setCalendarSyncEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500/25 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500"></div>
              </label>
            </div>

            {/* SMS Reminders Switch */}
            <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-gray-50/80 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">SMS Reminders</span>
                <span className="text-xs text-gray-500 mt-0.5">Receive text messages for upcoming task deadlines.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={(e) => setSmsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500/25 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500"></div>
              </label>
            </div>

            {/* Phone Number Input (Only visible when SMS is enabled) */}
            {smsEnabled && (
              <div className="p-4 bg-purple-50/20 border border-purple-100/50 rounded-2xl animate-slideDown">
                <label className="block text-xs font-semibold text-purple-700 mb-2 flex items-center gap-1.5">
                  <Phone size={12} />
                  10-Digit Mobile Number
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Mobile Number"
                  type="tel"
                  pattern="[0-9]{10}"
                  required={smsEnabled}
                  className="w-full pl-4 pr-4 py-2.5 bg-white border border-purple-200 rounded-xl outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-gray-800 text-sm placeholder-gray-400"
                />
              </div>
            )}

            {/* Sync Frequency Select */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">Sync Frequency</span>
                <span className="text-xs text-gray-500 mt-0.5">Specify how often FlowEase auto-syncs with external accounts.</span>
              </div>
              <div className="relative min-w-[160px]">
                <select
                  value={syncFrequency}
                  onChange={(e) => setSyncFrequency(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl outline-none transition-all focus:border-purple-500 text-sm text-gray-800 appearance-none font-medium cursor-pointer shadow-sm"
                >
                  <option value="5m">Every 5 min</option>
                  <option value="15m">Every 15 min</option>
                  <option value="1h">Every hour</option>
                  <option value="24h">Every day</option>
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Google Integration */}
        <div>
          <div className="flex items-center gap-2 mb-4 pt-2 border-t border-gray-100">
            <KeyRound size={18} className="text-purple-600 mt-4" />
            <h3 className="text-md font-bold text-gray-700 mt-4">API Configuration (Optional)</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Client ID
              </label>
              <input
                value={clientID}
                onChange={(e) => setClientID(e.target.value)}
                placeholder="Enter OAuth 2.0 Client ID"
                type="text"
                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all duration-200 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-gray-800 text-sm placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Client Secret
              </label>
              <div className="relative">
                <input
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="Enter OAuth 2.0 Client Secret"
                  type={showSecret ? "text" : "password"}
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all duration-200 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-gray-800 text-sm placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl cursor-pointer shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Collect;
