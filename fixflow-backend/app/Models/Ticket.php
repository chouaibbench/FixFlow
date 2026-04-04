<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Machine;

class Ticket extends Model
{
    use HasFactory;

    protected $table = 'tikets';

    protected $fillable = [
        'machine_id',
        'reported_by',
        'assigned_to',
        'description',
        'priority',
        'status',
        'photo_url',
    ];

    public function machine()
    {
        return $this->belongsTo(Machine::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
