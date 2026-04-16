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

        Log::create([
            'description' => "Ticket #{$ticket->id} created for machine {$ticket->machine->name}",
            'user_id'     => $request->user()->id,
        ]);

        return response()->json($ticket->load(['machine', 'reporter']), 201);
    }

    public function update(Request $request, Ticket $ticket)
    {
        $old = $ticket->status;
        $ticket->update($request->only('status', 'assigned_to', 'priority'));

        if ($request->has('status') && $old !== $request->status) {
            Log::create([
                'description' => "Ticket #{$ticket->id} ({$ticket->machine->name}) changed from {$old} to {$request->status}",
                'user_id'     => $request->user()->id,
            ]);
        }

        return response()->json($ticket->load(['machine', 'reporter', 'assignee']));
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
