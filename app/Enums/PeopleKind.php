<?php

namespace App\Enums;

enum PeopleKind: string
{
    case Employee = 'employee';
    case Contractor = 'contractor';
    case ServiceAccount = 'service_account';
}
