<?php

namespace App\Notifications;

use App\Models\OrganizationInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class OrganizationInvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public OrganizationInvitation $invitation) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $acceptUrl = URL::temporarySignedRoute(
            'invitations.show',
            $this->invitation->expires_at,
            ['token' => $this->invitation->token],
        );

        $organizationName = $this->invitation->organization->name;

        return (new MailMessage)
            ->subject(__('Organization Invitation'))
            ->line(__('You have been invited to join :organization.', ['organization' => $organizationName]))
            ->action(__('Accept Invitation'), $acceptUrl)
            ->line(__('This invitation will expire in 7 days.'));
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'invitation_id' => $this->invitation->id,
            'organization_id' => $this->invitation->organization_id,
        ];
    }
}
