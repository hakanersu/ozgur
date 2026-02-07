<?php

namespace App\Enums;

enum RightsRequestState: string
{
    case Todo = 'todo';
    case InProgress = 'in_progress';
    case Done = 'done';
}
