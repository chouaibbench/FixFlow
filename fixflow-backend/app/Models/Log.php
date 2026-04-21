<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    protected $fillable = ['description', 'user_id', 'ticket_id', 'machine_id', 'action'];

    public static function record(string $action, string $description, int $userId, ?int $ticketId = null, ?int $machineId = null): self
    {
        return self::create([
            'action'      => $action,
            'description' => $description,
            'user_id'     => $userId,
            'ticket_id'   => $ticketId,
            'machine_id'  => $machineId,
        ]);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function machine()
    {
        return $this->belongsTo(Machine::class);
    }
}
