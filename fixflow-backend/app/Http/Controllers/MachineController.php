<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use Illuminate\Http\Request;

class MachineController extends Controller
{
    public function index()
    {
        return response()->json(Machine::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string',
            'location' => 'required|string',
        ]);

        $machine = Machine::create($request->only('name', 'location', 'last_maintenance'));
        return response()->json($machine, 201);
    }

    public function show(Machine $machine)
    {
        return response()->json($machine);
    }

    public function update(Request $request, Machine $machine)
    {
        $machine->update($request->only('name', 'location', 'last_maintenance'));
        return response()->json($machine);
    }

    public function destroy(Machine $machine)
    {
        $machine->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // GET /api/machines/{machine}/history
    public function history(Machine $machine)
    {
        $tickets = $machine->tickets()
            ->with(['reporter', 'assignee'])
            ->latest()
            ->get()
            ->map(fn($t) => [
                'id'               => $t->id,
                'description'      => $t->description,
                'priority'         => $t->priority,
                'status'           => $t->status,
                'resolution_notes' => $t->resolution_notes,
                'reportedBy'       => $t->reporter?->name,
                'assignedTo'       => $t->assignee?->name,
                'createdAt'        => $t->created_at,
                'updatedAt'        => $t->updated_at,
            ]);

        return response()->json([
            'machine' => $machine,
            'tickets' => $tickets,
        ]);
    }

    // GET /api/machines/stats
    public function stats()
    {
        $machines = Machine::withCount([
            'tickets',
            'tickets as open_tickets_count'     => fn($q) => $q->whereIn('status', ['pending', 'in-progress']),
            'tickets as resolved_tickets_count' => fn($q) => $q->where('status', 'resolved'),
        ])->orderByDesc('open_tickets_count')->get();

        return response()->json($machines);
    }
}
