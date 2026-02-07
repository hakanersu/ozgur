<?php

namespace App\Enums;

enum ControlStatus: string
{
    case NotStarted = 'not_started';
    case InProgress = 'in_progress';
    case Implemented = 'implemented';
    case NotApplicable = 'not_applicable';
}
