<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardResource;
use App\Models\Appointment;
use App\Models\Client;
use App\Models\Deal;
use App\Models\Property;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->has('user_id') ? $request->user_id : null;

        $metrics = $this->getMetrics($userId);
        $recentActivities = $this->getRecentActivities($userId);
        $upcomingAppointments = $this->getUpcomingAppointments($userId);
        $pendingTasks = $this->getPendingTasks($userId);
        $pipelineSummary = $this->getPipelineSummary($userId);
        $monthlyDeals = $this->getMonthlyDeals($userId);

        $data = (object) [
            'metrics' => $metrics,
            'recent_activities' => $recentActivities,
            'upcoming_appointments' => $upcomingAppointments,
            'pending_tasks' => $pendingTasks,
            'pipeline_summary' => $pipelineSummary,
            'monthly_deals' => $monthlyDeals,
        ];

        return response()->json(new DashboardResource($data));
    }

    private function getMetrics(?int $userId): array
    {
        $propertyQuery = Property::query();
        $clientQuery = Client::query();
        $dealQuery = Deal::query();
        $appointmentQuery = Appointment::query();

        if ($userId) {
            $propertyQuery->where('user_id', $userId);
            $clientQuery->where('user_id', $userId);
            $dealQuery->where('user_id', $userId);
            $appointmentQuery->where('user_id', $userId);
        }

        $totalProperties = $propertyQuery->count();
        $activeProperties = (clone $propertyQuery)->whereIn('status', ['venta', 'alquiler'])->count();
        $totalClients = (clone $clientQuery)->count();
        $activeDeals = (clone $dealQuery)->whereNotIn('stage', ['closed_won', 'closed_lost'])->count();
        $closedDeals = (clone $dealQuery)->where('stage', 'closed_won')->count();
        $totalRevenue = (clone $dealQuery)->where('stage', 'closed_won')->sum('final_amount');
        $totalCommission = (clone $dealQuery)->where('stage', 'closed_won')->sum('commission_amount');
        $todayAppointments = (clone $appointmentQuery)->whereDate('start_time', now())->count();

        $conversionRate = 0;
        if ($totalClients > 0) {
            $convertedClients = (clone $clientQuery)->where('status', 'converted')->count();
            $conversionRate = round(($convertedClients / $totalClients) * 100, 1);
        }

        return [
            'total_properties' => $totalProperties,
            'active_properties' => $activeProperties,
            'total_clients' => $totalClients,
            'active_deals' => $activeDeals,
            'closed_deals' => $closedDeals,
            'total_revenue' => $totalRevenue,
            'total_commission' => $totalCommission,
            'today_appointments' => $todayAppointments,
            'conversion_rate' => $conversionRate,
        ];
    }

    private function getRecentActivities(?int $userId): array
    {
        $query = \App\Models\Activity::with(['user'])
            ->orderBy('created_at', 'desc')
            ->limit(10);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->get()->toArray();
    }

    private function getUpcomingAppointments(?int $userId): array
    {
        $query = Appointment::with(['client', 'property'])
            ->where('start_time', '>=', now())
            ->whereIn('status', ['scheduled', 'confirmed'])
            ->orderBy('start_time', 'asc')
            ->limit(5);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->get()->toArray();
    }

    private function getPendingTasks(?int $userId): array
    {
        $query = Task::with(['client', 'deal'])
            ->where('status', 'pending')
            ->orderBy('due_date', 'asc')
            ->limit(5);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->get()->toArray();
    }

    private function getPipelineSummary(?int $userId): array
    {
        $query = Deal::query()
            ->whereNotIn('stage', ['closed_won', 'closed_lost']);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->select('stage', DB::raw('count(*) as count'), DB::raw('sum(offer_amount) as total_amount'))
            ->groupBy('stage')
            ->get()
            ->toArray();
    }

    private function getMonthlyDeals(?int $userId): array
    {
        $query = Deal::query()
            ->where('stage', 'closed_won')
            ->where('actual_close_date', '>=', now()->subMonths(6));

        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->select(
            DB::raw('YEAR(actual_close_date) as year'),
            DB::raw('MONTH(actual_close_date) as month'),
            DB::raw('count(*) as count'),
            DB::raw('sum(final_amount) as total_amount')
        )
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get()
            ->toArray();
    }

    public function agents(): JsonResponse
    {
        $agents = User::withCount(['properties', 'clients', 'deals'])
            ->withSum(['deals' => function ($query) {
                $query->where('stage', 'closed_won');
            }], 'final_amount')
            ->whereIn('role', ['admin', 'agent'])
            ->get();

        return response()->json($agents);
    }
}
