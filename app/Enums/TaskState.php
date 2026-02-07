<?php

namespace App\Enums;

enum TaskState: string
{
    case Todo = 'todo';
    case Done = 'done';
}
