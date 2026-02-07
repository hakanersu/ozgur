<?php

namespace App\Enums;

enum EvidenceState: string
{
    case Fulfilled = 'fulfilled';
    case Requested = 'requested';
}
