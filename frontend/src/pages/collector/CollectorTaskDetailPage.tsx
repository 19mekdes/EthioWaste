import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CollectorLayout } from '../../layouts/CollectorLayout';
import InteractiveMap from '../../components/map/InteractiveMap';
import { collectorService } from '../../services/collectorService';
import { CollectionRequest } from '../../types';
import { ArrowLeft, MapPin, Calendar, Clock, User, Phone, CheckCircle2, Play, AlertCircle, Camera } from 'lucide-react';
import { ImageUploadField } from '../../components/ui/ImageUploadField';

export const CollectorTaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<CollectionRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proofPhotos, setProofPhotos] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await collectorService.getAssignedTasks();
        const found = data.find((t: any) => t.id === id);
        setTask(found || null);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      setUpdating(true);
      await collectorService.updateTaskStatus(id, newStatus, proofPhotos);
      navigate('/collector/tasks');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update task status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <CollectorLayout title="Task Details">
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
      </CollectorLayout>
    );
  }

  if (error || !task) {
    return (
      <CollectorLayout title="Task Details">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error || 'Task not found or not assigned to you.'}</span>
          </div>
          <button
            onClick={() => navigate('/collector/tasks')}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Task List
          </button>
        </div>
      </CollectorLayout>
    );
  }

  return (
    <CollectorLayout title={`Task #${task.id.substring(0, 8)}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/collector/tasks')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collector Tasks
        </button>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {task.wasteType} Waste Collection
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">
                Estimated Volume: {task.estimatedQuantity}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-slate-700 text-emerald-400 border border-emerald-500/30">
                {task.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Customer & Location</h3>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-xs block">Pickup Address</span>
                    <span className="font-bold text-white">{task.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-xs block">Scheduled Date</span>
                    <span className="font-medium text-white">{new Date(task.preferredDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {task.citizen && (
                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/40">
                    <User className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 text-xs block">Citizen Contact</span>
                      <span className="font-bold text-white block">{task.citizen.name}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-400" /> {task.citizen.phone}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Action Controls</h3>
              <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
                {(task.status === 'ASSIGNED' || task.status === 'SCHEDULED') && (
                  <button
                    onClick={() => handleStatusChange('IN_PROGRESS')}
                    disabled={updating}
                    className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" /> Start En-Route / In Progress
                  </button>
                )}

                {task.status === 'IN_PROGRESS' && (
                  <div className="space-y-4">
                    <ImageUploadField
                      images={proofPhotos}
                      onChange={(val: any) => setProofPhotos(Array.isArray(val) ? val : [val])}
                      label="Upload Pickup Completion Proof Photo"
                      maxImages={2}
                    />

                    <button
                      onClick={() => handleStatusChange('COMPLETED')}
                      disabled={updating}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete Collection & Record
                    </button>
                  </div>
                )}

                {task.status === 'COMPLETED' && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> This task has been successfully completed.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Map Navigation</h3>
            <InteractiveMap
              height="300px"
              latitude={task.latitude}
              longitude={task.longitude}
              markers={[
                {
                  id: task.id,
                  latitude: task.latitude,
                  longitude: task.longitude,
                  title: `${task.wasteType} Pickup`,
                  description: task.address,
                }
              ]}
            />
          </div>
        </div>
      </div>
    </CollectorLayout>
  );
};
