import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, Circle, Trash2, LockKeyhole, UserRound, Loader2, Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import toast from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";

const CHANGE_PASSWORD_ENDPOINT = "/auth/change-password";
const DELETE_ACCOUNT_ENDPOINT = "/auth/delete-profile";
const MY_ROBOTS_ENDPOINT = "/robot/";
const DELETE_ROBOT_ENDPOINT = (robotId) => `/robot/${robotId}`;

const EditProfileDrawer = ({ open, onOpenChange }) => {
    const { user } = useAuth();
    const [robots, setRobots] = useState([]);
    const [loadingRobots, setLoadingRobots] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [showDeleteRobotModal, setShowDeleteRobotModal] = useState(false);
    const [selectedRobot, setSelectedRobot] = useState(null);
    const [deletingRobot, setDeletingRobot] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        if (!open) return;

        const fetchRobots = async () => {
            try {
                setLoadingRobots(true);

                const res = await api.get(MY_ROBOTS_ENDPOINT);

                setRobots(res.data.robots || []);
            } catch (error) {
                console.error("Failed to fetch robots:", error);

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load your S.P.I.R.E. robots."
                );
            } finally {
                setLoadingRobots(false);
            }
        };

        fetchRobots();
    }, [open]);

    const openPasswordModal = () => {
        onOpenChange(false);
        setTimeout(() => {
            setShowPasswordModal(true);
        }, 250);
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            toast.error("Please enter both passwords.");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters.");
            return;
        }
        try {
            setChangingPassword(true);
            const res = await api.patch(CHANGE_PASSWORD_ENDPOINT, { oldPassword, newPassword, });
            toast.success(res.data.message || "Password changed successfully.");
            setOldPassword("");
            setNewPassword("");
            setShowPasswordModal(false);
        } catch (error) {
            console.error("Change password error:", error);
            toast.error(error.response?.data?.message || "Failed to change password.");
        } finally {
            setChangingPassword(false);
        }
    };

    const openDeleteAccountModal = () => {
        onOpenChange(false);
        setTimeout(() => {
            setShowDeleteAccountModal(true);
        }, 250);
    };

    const handleDeleteAccount = async () => {
        try {
            setDeletingAccount(true);
            const res = await api.delete(DELETE_ACCOUNT_ENDPOINT);
            toast.success(res.data.message || "Account deleted successfully.");
            setShowDeleteAccountModal(false);
            window.location.href = "/";
        } catch (error) {
            console.error("Delete account error:", error);
            toast.error(error.response?.data?.message || "Failed to delete account.");
        } finally {
            setDeletingAccount(false);
        }
    };

    const openDeleteRobotModal = (robot) => {
        setSelectedRobot(robot);
        onOpenChange(false);
        setTimeout(() => {
            setShowDeleteRobotModal(true);
        }, 250);
    };

    const handleDeleteRobot = async () => {
        if (!selectedRobot) return;
        try {
            setDeletingRobot(true);
            const res = await api.delete(DELETE_ROBOT_ENDPOINT(selectedRobot.robotId));
            toast.success(res.data.message || "S.P.I.R.E. removed successfully.");
            setRobots((prev) => prev.filter((robot) => robot.robotId !== selectedRobot.robotId));
            setShowDeleteRobotModal(false);
            setSelectedRobot(null);
        } catch (error) {
            console.error("Delete robot error:", error);
            toast.error(error.response?.data?.message || "Failed to delete S.P.I.R.E.");
        } finally {
            setDeletingRobot(false);
        }
    };

    return (
        <>
            <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="left">
                <DrawerContent className="min-h-screen w-95 max-w-full rounded-none border-r border-gray-200 bg-white z-100">
                    <div className="mx-auto w-full max-w-3xl">

                        {/* Header */}
                        <DrawerHeader className="border-b border-gray-200 px-6 py-3 bg-black/5">
                            <div className="flex items-center gap-8 justify-center">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
                                    <UserRound className="h-8 w-8 text-green-700 m-2" />
                                </div>

                                <div className="max-w-2xl">
                                    <DrawerTitle className="text-xl font-semibold text-gray-900">
                                        Edit Profile
                                    </DrawerTitle>

                                    <DrawerDescription className="text-sm text-gray-500 max-w-full">
                                        Manage your account and connected S.P.I.R.E. robots.
                                    </DrawerDescription>
                                </div>
                            </div>
                        </DrawerHeader>

                        {/* Content */}
                        <div className="max-h-[calc(100vh-80px)] overflow-y-auto px-5 pb-8 sm:px-8">

                            <section className="my-2">
                                <div className="my-4 flex items-center gap-2">
                                    <LockKeyhole className="h-5 w-5 text-green-700" />

                                    <h3 className="text-base font-semibold text-zinc-900">
                                        Security
                                    </h3>
                                </div>

                                <button
                                    type="button" onClick={openPasswordModal}
                                    className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 text-left transition hover:border-green-300 hover:bg-green-50/40"
                                >
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-zinc-900">
                                                Change Password
                                            </p>

                                            <p className="mt-1 text-sm text-black/80">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-green-500">
                                        Change
                                    </span>
                                </button>
                            </section>


                            {/* My Robots */}
                            <section className="my-5">

                                <div className="my-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Bot className="h-5 w-5 text-green-700" />

                                        <h3 className="text-base font-semibold text-zinc-900">
                                            My S.P.I.R.E. Robots
                                        </h3>

                                    </div>

                                    {!loadingRobots && (
                                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                                            {robots.length}
                                        </span>
                                    )}
                                </div>


                                {/* Loading */}
                                {loadingRobots && (
                                    <div className="flex items-center justify-center rounded-2xl border border-zinc-200 py-10">
                                        <Loader2 className="h-5 w-5 animate-spin text-green-700" />

                                        <span className="ml-2 text-sm text-zinc-500">
                                            Loading robots...
                                        </span>
                                    </div>
                                )}


                                {/* No robots */}
                                {!loadingRobots && robots.length === 0 && (
                                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-10 text-center">
                                        <Bot className="mx-auto h-8 w-8 text-zinc-400" />

                                        <p className="mt-3 text-sm font-medium text-zinc-700">
                                            No robots paired
                                        </p>

                                        <p className="mt-1 text-xs text-zinc-500">
                                            Pair a S.P.I.R.E. robot to see it here.
                                        </p>
                                    </div>
                                )}


                                {/* Robot List */}
                                {!loadingRobots && robots.length > 0 && (
                                    <div className="space-y-3 overflow-y-scroll">
                                        {robots.map((robot) => (
                                            <div
                                                key={robot._id}
                                                className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300"
                                            >

                                                {/* Robot information */}
                                                <div className="flex min-w-0 items-center gap-3">

                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50">
                                                        <Bot className="h-5 w-5 text-green-700" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-zinc-900">
                                                            {robot.name || "S.P.I.R.E. Robot"}
                                                        </p>

                                                        <p className="mt-1 truncate font-mono text-xs text-zinc-500">
                                                            {robot.robotId}
                                                        </p>

                                                        <div className="mt-1 flex items-center gap-1.5">
                                                            <Circle
                                                                className={`h-2.5 w-2.5 fill-current ${robot.isOnline
                                                                    ? "text-green-500"
                                                                    : "text-zinc-400"
                                                                    }`}
                                                            />

                                                            <span
                                                                className={`text-xs font-medium ${robot.isOnline
                                                                    ? "text-green-600"
                                                                    : "text-zinc-500"
                                                                    }`}
                                                            >
                                                                {robot.isOnline ? "Online" : "Offline"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>


                                                {/* Delete */}
                                                <button
                                                    type="button" onClick={() => openDeleteRobotModal(robot)}
                                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50 hover:text-red-600"
                                                    title="Delete robot"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>


                            {/* Danger Zone */}
                            <section>
                                <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4">

                                    <h3 className="text-sm font-semibold text-red-700">
                                        Danger Zone
                                    </h3>

                                    <p className="mt-1 text-xs leading-relaxed text-red-600/80">
                                        Deleting your account permanently removes your profile,
                                        connected robots, telemetry, alerts and notifications.
                                    </p>

                                    <button
                                        type="button" onClick={openDeleteAccountModal}
                                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-red-700"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Delete Account
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            <Dialog
                open={showPasswordModal}
                onOpenChange={(value) => {
                    if (!changingPassword) {
                        setShowPasswordModal(value);
                    }
                }}
            >
                <DialogContent className="sm:max-w-105">
                    <DialogHeader>
                        <DialogTitle>
                            Change Password
                        </DialogTitle>
                        <DialogDescription>
                            Enter your current password and choose a new password.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div className="relative">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Current Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={oldPassword}
                                onChange={(e) =>
                                    setOldPassword(e.target.value)
                                }
                                placeholder="Enter current password"
                                className="
                  w-full
                  rounded-md
                  border
                  border-gray-300
                  px-3
                  py-2.5
                  text-sm
                  outline-none
                  focus:border-green-600
                  focus:ring-0
                "
                            />
                            <span
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                                className="absolute right-3 top-9 cursor-pointer text-gray-500 py-0.5"
                            >
                                {showPassword ? (
                                    <Eye size={18} />
                                ) : (
                                    <EyeOff size={18} />
                                )}
                            </span>
                        </div>
                        <div className="relative">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                placeholder="Enter new password"
                                className="
                  w-full
                  rounded-md
                  border
                  border-gray-300
                  px-3
                  py-2.5
                  text-sm
                  outline-none
                  focus:border-green-600
                  focus:ring-0
                "
                            />
                            <span
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                                className="absolute right-3 top-9 cursor-pointer text-gray-500 py-0.5"
                            >
                                {showPassword ? (
                                    <Eye size={18} />
                                ) : (
                                    <EyeOff size={18} />
                                )}
                            </span>
                            <p className="mt-1.5 text-xs text-gray-400">
                                Minimum 8 characters with uppercase, number and symbol.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            disabled={changingPassword}
                            onClick={() => setShowPasswordModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={
                                changingPassword ||
                                !oldPassword ||
                                !newPassword
                            }
                            onClick={handleChangePassword}
                            className="bg-green-700 hover:bg-green-800"
                        >
                            {changingPassword ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="mr-2 animate-spin"
                                    />
                                    Changing...
                                </>
                            ) : (
                                "Change Password"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={showDeleteRobotModal}
                onOpenChange={(value) => {
                    if (!deletingRobot) {
                        setShowDeleteRobotModal(value);
                        if (!value) {
                            setSelectedRobot(null);
                        }
                    }
                }}
            >
                <DialogContent className="sm:max-w-105">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">
                            Delete S.P.I.R.E. Robot?
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove{" "}
                            <span className="font-medium text-gray-800">
                                {selectedRobot?.name}
                            </span>
                            ? This will permanently delete the robot and its
                            associated telemetry and alerts.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            disabled={deletingRobot}
                            onClick={() => {
                                setShowDeleteRobotModal(false);
                                setSelectedRobot(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={deletingRobot}
                            onClick={handleDeleteRobot}
                        >
                            {deletingRobot ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="mr-2 animate-spin"
                                    />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Robot"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={showDeleteAccountModal}
                onOpenChange={(value) => {
                    if (!deletingAccount) {
                        setShowDeleteAccountModal(value);
                    }
                }}
            >
                <DialogContent className="sm:max-w-105">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">
                            Delete Account?
                        </DialogTitle>
                        <DialogDescription>
                            This will permanently delete your account, connected
                            S.P.I.R.E. robots, telemetry, alerts and notifications.
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                        Make sure you really want to continue before confirming.
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            disabled={deletingAccount}
                            onClick={() =>
                                setShowDeleteAccountModal(false)
                            }
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={deletingAccount}
                            onClick={handleDeleteAccount}
                        >
                            {deletingAccount ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="mr-2 animate-spin"
                                    />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Account"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EditProfileDrawer;