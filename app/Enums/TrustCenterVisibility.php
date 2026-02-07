<?php

namespace App\Enums;

enum TrustCenterVisibility: string
{
    case None = 'none';
    case Private = 'private';
    case Public = 'public';
}
