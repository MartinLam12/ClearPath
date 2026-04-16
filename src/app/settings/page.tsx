"use client";

import React, { useState } from "react";
import { Card, CardTitle, CardDescription, Button, Input, Select } from "@/components/ui";
import { useUser } from "@/lib/user-context";
import { Save, User, Building2, Bell, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const { user, updateUser, initials, clearUser } = useUser();
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [businessName, setBusinessName] = useState(user.businessName);

  const handleSave = () => {
    updateUser({ name, email, businessName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    await clearUser();
    window.location.href = "/";
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
        <p className="text-surface-500 mt-1">Manage your account and preferences</p>
      </div>

      {saved && (
        <div className="bg-success-50 border border-success-500/20 text-success-700 rounded-xl p-4 text-sm font-medium animate-fade-in">
          Settings saved successfully!
        </div>
      )}

      {/* Profile */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <User className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center">
            <span className="text-xl font-bold text-brand-700">{initials || "?"}</span>
          </div>
          <p className="text-xs text-surface-400">Your initials are used as your avatar</p>
        </div>
      </Card>

      {/* Business Info */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-accent-600" />
          </div>
          <div>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Details about your business</CardDescription>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          <Select
            label="Industry"
            defaultValue="healthcare"
            options={[
              { value: "service", label: "Local Service Business" },
              { value: "agency", label: "Agency" },
              { value: "ecommerce", label: "E-Commerce" },
              { value: "healthcare", label: "Healthcare / Clinic" },
              { value: "beauty", label: "Beauty / Salon" },
              { value: "construction", label: "Construction / Contractor" },
              { value: "consulting", label: "Consulting" },
              { value: "restaurant", label: "Restaurant / Food Service" },
              { value: "retail", label: "Retail" },
              { value: "other", label: "Other" },
            ]}
          />
          <Input label="Website" type="url" placeholder="https://yourbusiness.com" />
          <Input label="Phone" type="tel" placeholder="(555) 123-4567" />
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-success-500" />
          </div>
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>How you receive updates</CardDescription>
          </div>
        </div>

        <div className="space-y-4">
          <ToggleRow
            label="Report completion emails"
            description="Get notified when your AI readiness report is ready"
            defaultChecked={true}
          />
          <ToggleRow
            label="Product updates"
            description="News about new features and improvements"
            defaultChecked={true}
          />
          <ToggleRow
            label="AI tips & insights"
            description="Periodic tips on how to implement AI in your business"
            defaultChecked={false}
          />
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-danger-500/20">
        <CardTitle className="text-danger-700">Danger Zone</CardTitle>
        <CardDescription>Irreversible actions</CardDescription>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-surface-900">Delete Account</p>
            <p className="text-xs text-surface-500">
              Permanently delete your account and all data
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>Delete Account</Button>
        </div>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} icon={<Save className="w-4 h-4" />}>
          Save Changes
        </Button>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-soft-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-danger-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-danger-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-surface-900">Delete Account</h2>
                <p className="text-sm text-surface-500">This action is permanent and cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-surface-600">
              Type <span className="font-mono font-semibold text-danger-700">DELETE</span> to confirm you want to permanently delete your account and all associated data.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-3 py-2 text-sm border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-danger-500 focus:border-transparent"
            />
            <div className="flex gap-3 justify-end pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={deleting}
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== "DELETE"}
              >
                Delete My Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-surface-800">{label}</p>
        <p className="text-xs text-surface-500">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
          checked ? "bg-brand-600" : "bg-surface-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
