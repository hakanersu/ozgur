<?php

namespace App\Enums;

enum LawfulBasis: string
{
    case LegitimateInterest = 'legitimate_interest';
    case Consent = 'consent';
    case ContractualNecessity = 'contractual_necessity';
    case LegalObligation = 'legal_obligation';
    case VitalInterests = 'vital_interests';
    case PublicTask = 'public_task';
}
