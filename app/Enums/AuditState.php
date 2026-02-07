<?php

namespace App\Enums;

enum AuditState: string
{
    case NotStarted = 'not_started';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Rejected = 'rejected';
    case Outdated = 'outdated';
}
