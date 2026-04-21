<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TiketController extends Controller
{
    public function index()
    {
        return response()->json(
            Ticket::with(['machine', 'reporter', 'assignee'])->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'machine_id'  => 'required|exists:machines,id',
            'description' => 'required|string',
            'priority'    => 'required|in:low,medium,high,critical',
        ]);

        $ticket = Ticket::create([
            'machine_id'  => $request->machine_id,
            'reported_by' => $request->user()->id,
            'description' => $request->description,
            'priority'    => $request->priority,
            'status'      => 'pending',
        ]);

        Log::record(
            'created',
            "Ticket #{$ticket->id} created for machine {$ticket->machine->name} by {$request->user()->name}",
            $request->user()->id,
            $ticket->id,
            $ticket->machine_id
        );

        return response()->json($ticket->load(['machine', 'reporter']), 201);
    }

    public function show(Ticket $ticket)
    {
        return response()->json($ticket->load(['machine', 'reporter', 'assignee']));
    }

    public function update(Request $request, Ticket $ticket)
    {
        $request->validate([
            'assigned_to' => 'nullable|exists:users,id',
            'status'      => 'nullable|in:pending,in-progress,resolved',
            'priority'    => 'nullable|in:low,medium,high,critical',
            'resolution_notes' => 'nullable|string',
        ]);

        $oldStatus     = $ticket->status;
        $oldAssignedTo = $ticket->assigned_to;

        $ticket->update($request->only('status', 'assigned_to', 'priority', 'resolution_notes'));

        // Log assignment change
        if ($request->has('assigned_to') && $oldAssignedTo !== $request->assigned_to) {
            $assignee = \App\Models\User::find($request->assigned_to);
            Log::record(
                'assigned',
                "Ticket #{$ticket->id} ({$ticket->machine->name}) assigned to " . ($assignee?->name ?? 'nobody'),
                $request->user()->id,
                $ticket->id,
                $ticket->machine_id
            );
        }

        // Log status change
        if ($request->has('status') && $oldStatus !== $request->status) {
            if ($request->status === 'resolved') {
                $ticket->machine->update(['last_maintenance' => now()->toDateString()]);
            }

            Log::record(
                $request->status === 'resolved' ? 'resolved' : 'status_changed',
                "Ticket #{$ticket->id} ({$ticket->machine->name}) status changed from {$oldStatus} to {$request->status} by {$request->user()->name}",
                $request->user()->id,
                $ticket->id,
                $ticket->machine_id
            );
        }

        return response()->json($ticket->load(['machine', 'reporter', 'assignee']));
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
