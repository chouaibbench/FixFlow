<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TiketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            Ticket::with(['machine', 'reporter', 'assignee'])->latest()->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
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
        return response()->json($ticket->load(['machine', 'reporter']),201);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        $ticket->update($request->only('status', 'assigned_to', 'priority'));
        return response()->json($ticket->load(['machine', 'reporter', 'assignee']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        $ticket->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
