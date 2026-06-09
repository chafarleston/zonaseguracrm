<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'metrics' => [
                'totalProperties' => $this->metrics['total_properties'] ?? 0,
                'activeProperties' => $this->metrics['active_properties'] ?? 0,
                'totalClients' => $this->metrics['total_clients'] ?? 0,
                'activeDeals' => $this->metrics['active_deals'] ?? 0,
                'closedDeals' => $this->metrics['closed_deals'] ?? 0,
                'totalRevenue' => (float) ($this->metrics['total_revenue'] ?? 0),
                'totalCommission' => (float) ($this->metrics['total_commission'] ?? 0),
                'todayAppointments' => $this->metrics['today_appointments'] ?? 0,
                'conversionRate' => $this->metrics['conversion_rate'] ?? 0,
            ],
            'recentActivities' => $this->recent_activities ?? [],
            'upcomingAppointments' => $this->upcoming_appointments ?? [],
            'pendingTasks' => $this->pending_tasks ?? [],
            'pipelineSummary' => $this->pipeline_summary ?? [],
            'monthlyDeals' => $this->monthly_deals ?? [],
        ];
    }
}
