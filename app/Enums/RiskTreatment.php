<?php

namespace App\Enums;

enum RiskTreatment: string
{
    case Mitigated = 'mitigated';
    case Accepted = 'accepted';
    case Avoided = 'avoided';
    case Transferred = 'transferred';
}
