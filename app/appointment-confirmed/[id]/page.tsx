"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Clock,
  Video,
  ArrowRight,
  User,
  Phone,
  BadgeCheck,
  IndianRupee,
  XCircle,
  Star,
  UploadCloud,
  Trash2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";

/** clinicData left intact */
const clinicData: any = {
  DEHRADUN: {
    name: "Shri Mahant Indiresh Hospital, Dehradun",
    location: "Dehradun",
    hours: "10:00 AM - 2:00 PM",
  },
  ROORKEE: {
    name: "Hemant Hospital, Roorkee",
    location: "Roorkee",
    hours: "2nd & 4th Thursday • 10:00 AM - 2:00 PM",
  },
  ONLINE: {
    name: "Online Consultation — Google Meet",
    location: "Google Meet",
    hours: "10:00 AM - 2:00 PM",
  },
};

export default function AppointmentConfirmedPage() {
  const router = useRouter();
  const appointmentId = useParams()?.id;
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  // upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documents, setDocuments] = useState<any[]>([]);

  // fetch appointment
  const fetchAppointment = async () => {
    setLoading(true);
    try {
      const res = (await api.get(`/appointments/${appointmentId}`)) as any;
      if (!mountedRef.current) return;
      setAppointment(res.appointment);
      setDocuments(res.appointment?.documents || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load appointment");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    if (appointmentId) fetchAppointment();
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  // helper formatters
  const formattedDate = useMemo(() => {
    if (!appointment?.date) return "";
    return new Date(appointment.date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [appointment?.date]);

  const formatTime = (t?: string) => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    const hh = h % 12 || 12;
    const suffix = h >= 12 ? "PM" : "AM";
    return `${hh}:${m.toString().padStart(2, "0")} ${suffix}`;
  };

  // upload flow (presign + PUT)
  const uploadDocument = async (file: File) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // 1. presign
      const presignRes = (await api.post("/uploads/presign", {
        filename: file.name,
        contentType: file.type,
        size: file.size,
        appointmentId: appointmentId,
      })) as any;

      const { uploadUrl, documentId } = presignRes;
      if (!uploadUrl) throw new Error("Missing presign URL");

      // 2. upload via XHR to track progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        };

        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(xhr.statusText));
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(file);
      });

      // update UI optimistically
      setDocuments((prev) => [
        ...prev,
        {
          _id: documentId || `temp-${Date.now()}`,
          filename: file.name,
          mimeType: file.type,
          url: uploadUrl.split("?")[0],
        },
      ]);

      toast.success("Document uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // file picker
  const pickFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.pdf";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) uploadDocument(file);
    };
    input.click();
  };

  // remove document (UI + backend)
  const removeDocument = async (docId: string) => {
    if (!confirm("Delete this document? This action cannot be undone.")) return;
    try {
      // optimistic UI
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
      await api.delete(`/uploads/${docId}`);
      toast.success("Deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
      // refetch to recover
      fetchAppointment();
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg bg-gray-50">
        Loading…
      </div>
    );

  if (!appointment)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <p className="text-lg text-gray-700">Appointment not found.</p>
        <div className="mt-4 flex gap-3">
          <Button onClick={() => router.push("/")}>Go Home</Button>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>
    );

  // page data
  const patient = appointment.patientId || {};
  const isOnline = appointment.city === "ONLINE";
  const clinic = clinicData[appointment.city] || { name: appointment.city || "Clinic", location: "", hours: "" };
  const meetLink = appointment?.meet?.link;

  // status pill classes
  const statusClasses =
    appointment.status === "confirmed"
      ? "bg-green-50 text-green-800"
      : appointment.status === "cancelled"
      ? "bg-red-50 text-red-800"
      : "bg-yellow-50 text-yellow-800";

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Appointment Details</h1>
            <p className="text-sm text-gray-500 mt-0.5">Reference: <span className="font-mono text-xs text-gray-600">{appointment._id}</span></p>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <Button onClick={() => router.push("/appointments")}>All Appointments</Button>
            <Button variant="outline" onClick={() => router.push("/")}>Home</Button>
          </div>
        </div>
      </header>

      {/* Content grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content (left, spans 2 cols on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status banner */}
          <div aria-live="polite">
            {renderStatusBanner(appointment.status)}
          </div>

          {/* Patient card */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Patient</p>
                    <p className="text-lg font-medium text-gray-900">{patient.name || "—"}</p>
                    <p className="text-sm text-gray-600 mt-1">Phone: <a href={`tel:${patient.phone}`} className="text-primary">{patient.phone}</a></p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase">Gender / Age</p>
                    <p className="font-medium text-gray-800">
                      {patient.gender === "M" ? "Male" : patient.gender === "F" ? "Female" : "—"} {patient.age ? ` · ${patient.age}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Appointment details */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
              </div>

              <div className="min-w-0">
                <h2 className="text-xs text-gray-500 uppercase">Appointment</h2>
                <p className="text-lg font-medium text-gray-900 mt-1">{formattedDate}</p>

                <div className="mt-3 flex flex-wrap gap-4 items-center text-sm text-gray-600">
                  <div className="inline-flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{formatTime(appointment.startTime)} – {formatTime(appointment.endTime)}</span>
                  </div>

                  <div className="inline-flex items-center gap-2">
                    {isOnline ? <Video className="w-4 h-4 text-blue-500" /> : <MapPin className="w-4 h-4 text-red-500" />}
                    <span>{clinic.name}</span>
                  </div>

                  <div className="inline-flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Slot: 30 minutes</span>
                  </div>
                </div>

                {isOnline && meetLink && (
                  <div className="mt-4">
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-2 rounded-md"
                    >
                      <Video className="w-4 h-4" /> Join meeting
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Clinic / Location */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-500" />
                </div>
              </div>

              <div>
                <h3 className="text-xs text-gray-500 uppercase">Clinic</h3>
                <p className="text-lg font-medium text-gray-900 mt-1">{clinic.name}</p>
                <p className="text-sm text-gray-600">{clinic.location}</p>
                <p className="text-xs text-gray-500 mt-2">{clinic.hours}</p>

                <div className="mt-4 flex gap-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.name + " " + clinic.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm"
                  >
                    <MapPin className="w-4 h-4" /> Directions
                  </a>

                  {!isOnline && (
                    <a className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm" href={`tel:${appointment.patientId?.phone || ""}`}>
                      <Phone className="w-4 h-4" /> Call
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-gray-500" />
                </div>
              </div>

              <div>
                <h3 className="text-xs text-gray-500 uppercase">Payment</h3>
                <p className="text-lg font-medium text-gray-900 mt-1">₹{(appointment.payment?.amount || 0) / 100}</p>
                <p className="text-sm text-gray-600 mt-1">Status: <span className="font-semibold text-green-600">{appointment.payment?.status || "—"}</span></p>
              </div>
            </div>
          </section>

          {/* Documents */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-semibold">Uploaded Documents</h3>
              <div className="flex items-center gap-3">
                <Button onClick={pickFile} disabled={uploading} className="inline-flex items-center gap-2">
                  <UploadCloud /> Upload
                </Button>
                <Button variant="outline" onClick={() => fetchAppointment()}>
                  Refresh
                </Button>
              </div>
            </div>

            {/* Progress */}
            {uploading && (
              <div className="mb-4">
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-2">{uploadProgress}%</p>
              </div>
            )}

            {/* documents grid */}
            <AppointmentDocuments initialDocuments={documents} appointmentId={appointment._id}/>
          </section>
        </div>

        {/* Right column: actions (desktop) */}
        <aside className="hidden lg:flex lg:flex-col gap-4 sticky top-24">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase">Status</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClasses}`}>
                {String(appointment.status || "").toUpperCase()}
              </span>
              <span className="text-xs text-gray-400">{new Date(appointment.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase">Actions</p>
            <div className="mt-3 flex flex-col gap-3">
              {isOnline && meetLink && (
                <a target="_blank" rel="noreferrer" href={meetLink}>
                  <Button className="w-full">Join Meeting</Button>
                </a>
              )}

              <Button onClick={pickFile} className="w-full" variant="outline">Upload Document</Button>

              
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase">Quick Info</p>
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-gray-400" />
                <span>Slot: 30 minutes</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-gray-400" />
                <span>Fee: ₹{(appointment.payment?.amount || 0) / 100}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

/** Render status banners */
const renderStatusBanner = (status?: string) => {
  if (!status) return null;

  switch (status) {
    case "confirmed":
      return (
        <div className="bg-green-100 border border-green-300 text-green-800 rounded-xl p-4 flex gap-3 items-center">
          <CheckCircle className="w-6 h-6" />
          <p className="font-medium">Your appointment is confirmed!</p>
        </div>
      );

    case "cancelled":
      return (
        <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl p-4 flex gap-3 items-center">
          <XCircle className="w-6 h-6" />
          <p className="font-medium">This appointment has been cancelled.</p>
        </div>
      );

    case "completed":
      return (
        <div className="bg-slate-100 border border-slate-300 text-slate-800 rounded-xl p-4 flex gap-3 items-center">
          <Star className="w-6 h-6" />
          <p className="font-medium">This appointment is completed.</p>
        </div>
      );

    default:
      return null;
  }
};


type DocItem = {
  _id: string;
  filename: string;
  mimeType?: string;
  s3Key?: string;
  url?: string; // signed url for download / preview
};


function AppointmentDocuments({
  appointmentId,
  initialDocuments = [],
}: {
  appointmentId: string;
  initialDocuments?: DocItem[];
}) {
  const [documents, setDocuments] = useState<DocItem[]>(initialDocuments);
  const [uploading, setUploading] = useState<Record<string, number>>({}); // docId -> progress 0..100
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Helpers
  const isImage = (mime?: string, url?: string) =>
    !!(mime && mime.startsWith("image/")) || !!(url && /\.(jpe?g|png|webp|gif|bmp)$/i.test(url || ""));

  const isPDF = (mime?: string, url?: string) =>
    !!(mime && mime.includes("pdf")) || !!(url && /\.pdf$/i.test(url || ""));

  // Remove a document
  const removeDocument = async (docId: string) => {
    const ok = confirm("Delete this document? This action cannot be undone.");
    if (!ok) return;
    try {
      await api.delete(`/documents/${docId}`);
      setDocuments((d) => d.filter((x) => x._id !== docId));
      toast.success("Document deleted");
    } catch (err: any) {
      console.error("delete document error", err);
      toast.error(err?.message || "Failed to delete document");
    }
  };

  // After upload: request signed url and update doc
  const fetchSignedUrlAndUpdate = async (docId: string) => {
    try {
      const res = (await api.get(`/documents/${docId}/signed-url`)) as any;
      const url = res?.url;
      if (!url) return;
      setDocuments((prev) =>
        prev.map((d) => (d._id === docId ? { ...d, url } : d))
      );
    } catch (err) {
      console.error("fetch signed url", err);
    }
  };


  return (
    <section aria-labelledby="docs-heading" className="mt-6">

      {/* Horizontal scrollable previews */}
      <div className="overflow-x-auto py-2">
        <div className="flex gap-4 w-max min-w-full px-1">
          {documents.length === 0 ? (
            <div className="min-w-[280px] flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white/60 px-6 py-8">
              <div className="text-sm text-gray-500">No documents uploaded yet</div>
            </div>
          ) : (
            documents.map((doc) => {
              const url = doc.url || (doc.s3Key ? `${process.env.NEXT_PUBLIC_AWS_URL}/${doc.s3Key}` : undefined);
              const imgPreview = isImage(doc.mimeType, url);
              const pdfPreview = isPDF(doc.mimeType, url);

              return (
                <div
                  key={doc._id}
                  className="min-w-[220px] max-w-[260px] bg-white border rounded-lg p-3 shadow-sm flex flex-col"
                >
                  <div className="flex items-start overflow-x-scroll justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{doc.filename}</p>
                      <p className="text-xs text-gray-500 mt-1">{doc.mimeType?.split('/')[1].toUpperCase() || "—"}</p>
                    </div>

                    
                  </div>

                  {/* Preview area */}
                  <div className="mt-3 flex-1">
                    {imgPreview ? (
                      url ? (
                        <img
                          src={url}
                          alt={doc.filename}
                          className="w-full h-40 object-cover rounded-md border"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
                          Image preview not available
                        </div>
                      )
                    ) : pdfPreview ? (
                      url ? (
                        <div className="w-full h-40 rounded-md border overflow-hidden flex items-center justify-center bg-gray-50">
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600">
                            Open PDF
                          </a>
                        </div>
                      ) : (
                        <div className="w-full h-40 rounded-md border bg-gray-50 flex items-center justify-center text-gray-400">
                          PDF unavailable
                        </div>
                      )
                    ) : (
                      <div className="w-full h-40 rounded-md border bg-gray-50 flex items-center justify-center text-gray-400">
                        Preview not available
                      </div>
                    )}
                  </div>

                  {/* Progress / actions */}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex-1">
                      {uploading[doc._id] !== undefined ? (
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            style={{ width: `${uploading[doc._id]}%` }}
                            className="h-2 rounded-full bg-primary"
                          />
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">Uploaded</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => removeDocument(doc._id)}
                        className="inline-flex items-center gap-2 px-2 py-1 rounded-md border text-xs text-red-600 hover:bg-red-50"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
