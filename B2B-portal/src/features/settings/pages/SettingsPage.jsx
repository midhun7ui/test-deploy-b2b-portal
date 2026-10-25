import { useState, useEffect } from "react";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";

import SettingsHeader from "../components/SettingsHeader";
import AccountPreferences from "../components/AccountPreferences";
import NotificationPreferences from "../components/NotificationPreferences";
import SecuritySettings from "../components/SecuritySettings";

import {
  initialAccountSettings,
  initialNotificationPreferences,
} from "../data/settingsMockData";
import settingsApi from "../services/settingsApi";
import { getCurrentUser, setCurrentUser } from "../../auth/authState";

export default function SettingsPage() {
  const [account, setAccount] = useState(() => {
    const cachedUser = getCurrentUser();
    if (cachedUser) {
      return {
        displayName: cachedUser.full_name || cachedUser.username || "Partner Administrator",
        email: cachedUser.email || "partner@example.com",
        phone: cachedUser.phone_number || "",
        role: cachedUser.role === "partner" ? "B2B Partner Administrator" : (cachedUser.role || "B2B Partner"),
        companyName: cachedUser.company_name || "",
      };
    }
    return { ...initialAccountSettings };
  });

  const [savedPreferences, setSavedPreferences] = useState(
    () => ({ ...initialNotificationPreferences })
  );

  const [draftPreferences, setDraftPreferences] = useState(
    () => ({ ...initialNotificationPreferences })
  );

  const [security, setSecurity] = useState({
    passwordConfigured: true,
    twoFactorConfigured: false,
    activeSessionsCount: 1,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [accountToast, setAccountToast] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        const data = await settingsApi.getSettingsOverview();
        if (isMounted && data) {
          if (data.account) {
            setAccount(data.account);
            // Synchronize with auth storage
            const currentUser = getCurrentUser() || {};
            setCurrentUser({
              ...currentUser,
              full_name: data.account.displayName || data.account.full_name,
              phone_number: data.account.phone || data.account.phone_number,
            });
          }
          if (data.preferences) {
            setSavedPreferences({ ...data.preferences });
            setDraftPreferences({ ...data.preferences });
          }
          if (data.security) {
            setSecurity(data.security);
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote settings overview, using local state:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasChanges = Object.keys(savedPreferences).some(
    (key) => savedPreferences[key] !== draftPreferences[key]
  );

  function handlePreferenceChange(key, value) {
    setDraftPreferences((current) => ({
      ...current,
      [key]: value,
    }));
    setSaveMessage("");
  }

  async function handleSavePreferences() {
    setIsSaving(true);
    setSaveMessage("");

    try {
      const updated = await settingsApi.updateNotificationPreferences(draftPreferences);
      setSavedPreferences({ ...updated });
      setDraftPreferences({ ...updated });
      setSaveMessage("Preferences saved successfully.");
      setTimeout(() => {
        setSaveMessage("");
      }, 4000);
    } catch (err) {
      console.error("Failed to persist notification preferences:", err);
      setSaveMessage("Error saving preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleResetPreferences() {
    setDraftPreferences({ ...savedPreferences });
    setSaveMessage("Unsaved changes discarded.");
    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  }

  async function handleUpdateAccount(updatedData) {
    try {
      const res = await settingsApi.updateSettings(updatedData);
      if (res.account) {
        setAccount(res.account);
        const currentUser = getCurrentUser() || {};
        setCurrentUser({
          ...currentUser,
          full_name: res.account.displayName || res.account.full_name,
          phone_number: res.account.phone || res.account.phone_number,
        });
      }
      setAccountToast("Account profile updated successfully.");
      setTimeout(() => {
        setAccountToast("");
      }, 4000);
    } catch (err) {
      console.error("Failed to update account profile:", err);
      throw err;
    }
  }

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page trips-page settings-dashboard-page">
        <DashboardTopbar />

        <div className="trips-content settings-content">
          <SettingsHeader />

          {accountToast && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                borderRadius: "8px",
                background: "#dcfce7",
                border: "1px solid #86efac",
                color: "#166534",
                fontSize: "13.5px",
                fontWeight: "500",
              }}
              role="status"
            >
              ✓ {accountToast}
            </div>
          )}

          {isLoading ? (
            <div
              style={{
                padding: "48px",
                textAlign: "center",
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
            >
              Loading account settings...
            </div>
          ) : (
            <div className="settings-layout">
              <AccountPreferences
                account={account}
                onUpdateAccount={handleUpdateAccount}
              />

              <NotificationPreferences
                preferences={draftPreferences}
                onChange={handlePreferenceChange}
                onSave={handleSavePreferences}
                onReset={handleResetPreferences}
                hasChanges={hasChanges}
                saveMessage={saveMessage}
                isSaving={isSaving}
              />

              <SecuritySettings
                security={security}
                onPasswordChanged={() => {}}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
