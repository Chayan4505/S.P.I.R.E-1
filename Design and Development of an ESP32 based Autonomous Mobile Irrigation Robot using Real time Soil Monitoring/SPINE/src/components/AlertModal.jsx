import { useEffect, useState } from "react";
import { BellRing, Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const AlertModal = ({ open, onOpenChange }) => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!open) return;
        const fetchAlerts = async () => {
            try {
                setLoading(true);
                const [alertsResponse] = await Promise.all([api.get("/alerts/"), api.patch("/alerts/read-all"),]);
                setAlerts(alertsResponse.data.alerts || []);
            } catch (error) {
                console.error("Alert fetch error:", error);
                toast.error(error.response?.data?.message || "Failed to load alerts.");
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, [open]);

    const handleDeleteAll = async () => {
        try {
            setDeleting(true);
            const res = await api.delete("/alerts/");
            setAlerts([]);
            setShowDeleteConfirm(false);
            toast.success(res.data.message || "All alerts deleted.");
        } catch (error) {
            console.error("Delete alerts error:", error);
            toast.error(error.response?.data?.message || "Failed to delete alerts.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className=" w-[calc(100%-2rem)] max-w-125 p-0 overflow-hidden">
                    <DialogHeader className=" border-b border-gray-200 px-5 py-4">
                        <div className="flex items-center justify-between mr-5">
                            <div className="flex items-center gap-3">
                                <div className=" flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                                    <BellRing size={20} className="text-red-600" />
                                </div>

                                <div>
                                    <DialogTitle className="text-base">Alerts</DialogTitle>
                                    <DialogDescription className="mt-0.5">Latest S.P.I.R.E. alerts</DialogDescription>
                                </div>
                            </div>

                            <button onClick={() => setShowDeleteConfirm(true)}
                                disabled={deleting || loading || alerts.length === 0}
                                className=" flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </DialogHeader>

                    <div className="max-h-[65vh] overflow-y-auto">
                        {loading ? (
                            <div className="flex h-48 items-center justify-center">
                                <Loader2 size={24} className=" animate-spin text-green-700" />
                            </div>
                        ) : alerts.length === 0 ? (
                            <div className=" flex h-48 flex-col items-center justify-center px-6 text-center">
                                <BellRing size={28} className="text-gray-300" />
                                <p className="mt-3 text-sm font-medium text-gray-600"> No alerts</p>
                                <p className="mt-1 text-xs text-gray-400"> There are no alerts to display.</p>
                            </div>
                        ) : (<div className="divide-y divide-gray-100">
                            {alerts.map((alert) => (
                                <div
                                    key={
                                        alert._id ||
                                        alert.createdAt
                                    }
                                    className={` px-5 py-4 transition ${alert.isRead ? "bg-white" : "bg-red-50/30"}`}>
                                    <div className="flex gap-3">
                                        <div className=" mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900">{alert.title || "Alert"}</p>
                                            <p className="mt-1 text-sm leading-5 text-gray-600">{alert.message || alert.description || ""}</p>

                                            {alert.createdAt && (
                                                <p className="mt-2 text-[11px] text-gray-400">
                                                    {new Date(alert.createdAt).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showDeleteConfirm} onOpenChange={(value) => {
                if (!deleting) {
                    setShowDeleteConfirm(value);
                }
            }}
            >

                <DialogContent className="sm:max-w-100">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Delete all alerts?</DialogTitle>
                        <DialogDescription>This will permanently remove all your alerts. This action cannot be undone.</DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-2 pt-3">
                        <Button
                            variant="outline"
                            disabled={deleting}
                            onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            disabled={deleting}
                            onClick={handleDeleteAll}>

                            {deleting ? (
                                <>
                                    <Loader2 size={15} className="mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete All"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AlertModal;