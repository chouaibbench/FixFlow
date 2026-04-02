import React, { useState } from 'react';
import { MapPin, Camera } from 'lucide-react';
import { Button } from './ui/Button';
import { Label } from './ui/Label';
import { RadioGroup, RadioGroupItem } from './ui/RadioGroup';

export const TicketForm = ({ machine, onSubmit, onCancel }) => {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({ description, priority });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-bold">Machine Details</Label>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-lg font-bold">{machine.name}</div>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-3 w-3" />
            {machine.location}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-bold">Describe the Issue</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's wrong with the machine?"
          className="min-h-[120px] w-full rounded-lg border border-slate-200 bg-white p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950"
          required
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-bold">Priority Level</Label>
        <RadioGroup value={priority} onValueChange={(v) => setPriority(v)} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'critical', label: 'Critical' },
          ].map((p) => (
            <div key={p.value} className="flex items-center space-x-2">
              <RadioGroupItem value={p.value} label={p.label} />
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-bold">Attach Photo (Optional)</Label>
        <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
          <Camera className="mb-2 h-8 w-8 text-slate-400" />
          <p className="text-sm text-slate-500">Tap to take a photo</p>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="destructive" className="flex-1">
          Submit Ticket
        </Button>
      </div>
    </form>
  );
};
