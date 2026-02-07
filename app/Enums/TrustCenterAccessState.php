<?php

namespace App\Enums;

enum TrustCenterAccessState: string
{
    case Requested = 'requested';
    case Granted = 'granted';
    case Rejected = 'rejected';
    case Revoked = 'revoked';
}
