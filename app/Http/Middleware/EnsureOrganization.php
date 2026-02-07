<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOrganization
{
    /**
     * Ensure the authenticated user belongs to the resolved organization.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $organization = $request->route('organization');

        if (! $organization) {
            abort(404);
        }

        if (! $request->user()?->belongsToOrganization($organization)) {
            abort(403);
        }

        return $next($request);
    }
}
