<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use Illuminate\Http\Request;

class MachineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Machine::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $request->validate([
            'name'     => 'required|string',
            'location' => 'required|string',
        ]);

        $machine = Machine::create($request->only('name', 'location', 'last_maintenance'));
        return response()->json($machine, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Machine $machine)
    {
        return response()->json($machine);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Machine $machine)
    {
        $machine->update($request->only('name', 'location', 'last_maintenance'));
        return response()->json($machine);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Machine $machine)
    {
        $machine->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
