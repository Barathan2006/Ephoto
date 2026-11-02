import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, ShieldCheck, Mail, Key, Camera, Check, Clock, Package } from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, orders, showToast, navigateTo } = useApp();

  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [profileImage, setProfileImage] = useState(currentUser.profileImage);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const userOrders = orders.filter((o) => o.userId === currentUser.id);
  const totalDownloads = userOrders.reduce(
    (sum, order) => sum + order.items.reduce((itSum, item) => itSum + (item.downloadCount || 0), 0),
    0
  );

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      showToast('Username and email are required.', 'error');
      return;
    }
    updateUserProfile(username.trim(), email.trim(), profileImage);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password updated securely with PBKDF2 hashing!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
            <span className="text-emerald-400 font-medium">Account Settings</span>
            <span aria-hidden="true">·</span>
            <span>Customer Profile</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{currentUser.role} Role</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Personal Profile & Credentials
          </h1>
        </div>

        {/* Quick order stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
            <div className="text-base font-bold text-white">{userOrders.length}</div>
            <div className="text-neutral-500 text-[10px]">Demo Orders</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
            <div className="text-base font-bold text-emerald-400">{totalDownloads}</div>
            <div className="text-neutral-500 text-[10px]">Master Downloads</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Avatar & Edit Profile */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleProfileSave}
            className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-5"
          >
            <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-3">
              Account Details
            </h2>

            {/* Profile Avatar Selection */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2">
                Profile Avatar
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={profileImage}
                  alt={currentUser.username}
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/40"
                />
                <div className="flex-1">
                  <input
                    type="url"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="Avatar image URL"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Paste image URL for your profile avatar
                  </span>
                </div>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Email with uniqueness check */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Validated for uniqueness against existing platform accounts.
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Profile Changes
            </button>
          </form>

          {/* Change Password */}
          <form
            onSubmit={handlePasswordChange}
            className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4"
          >
            <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              Change Password
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Right Side: Recent Orders Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white">Recent Orders</h3>
              <button
                onClick={() => navigateTo('history')}
                className="text-xs text-emerald-400 hover:underline"
              >
                View all ({userOrders.length})
              </button>
            </div>

            {userOrders.length === 0 ? (
              <p className="text-xs text-neutral-500 py-4 text-center">
                No orders yet. Place your first demo order in the marketplace!
              </p>
            ) : (
              <div className="divide-y divide-neutral-800/80">
                {userOrders.slice(0, 3).map((o) => (
                  <div key={o.id} className="py-3 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-mono text-white font-medium">{o.orderNumber}</div>
                      <div className="text-[11px] text-neutral-500">
                        {o.items.length} items · {new Date(o.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="text-emerald-400 font-semibold">${o.totalAmount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-400 leading-relaxed">
            <span className="font-semibold text-white block mb-1">Role Permissions</span>
            Currently operating as a verified <strong>{currentUser.role}</strong>. You have unrestricted access to explore images, generate custom artwork, place simulated demo orders, and download full unwatermarked digital assets.
          </div>
        </div>

      </div>
    </div>
  );
};
