<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Deal;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function sales(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', now()->subMonths(12)->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

        $deals = Deal::where('stage', 'closed_won')
            ->whereBetween('actual_close_date', [$startDate, $endDate])
            ->select(
                DB::raw('YEAR(actual_close_date) as year'),
                DB::raw('MONTH(actual_close_date) as month'),
                DB::raw('count(*) as deals_count'),
                DB::raw('sum(final_amount) as total_amount'),
                DB::raw('sum(commission_amount) as total_commission')
            )
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();

        $totals = [
            'total_deals' => $deals->sum('deals_count'),
            'total_amount' => $deals->sum('total_amount'),
            'total_commission' => $deals->sum('total_commission'),
            'avg_deal_amount' => $deals->avg('total_amount'),
        ];

        return response()->json([
            'data' => $deals,
            'totals' => $totals,
        ]);
    }

    public function agents(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', now()->subMonths(12)->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

        $agents = \App\Models\User::whereIn('role', ['admin', 'agent'])
            ->withCount(['properties', 'clients'])
            ->withCount(['deals as closed_deals_count' => function ($query) use ($startDate, $endDate) {
                $query->where('stage', 'closed_won')
                    ->whereBetween('actual_close_date', [$startDate, $endDate]);
            }])
            ->withSum(['deals as total_revenue' => function ($query) use ($startDate, $endDate) {
                $query->where('stage', 'closed_won')
                    ->whereBetween('actual_close_date', [$startDate, $endDate]);
            }], 'final_amount')
            ->withSum(['deals as total_commission' => function ($query) use ($startDate, $endDate) {
                $query->where('stage', 'closed_won')
                    ->whereBetween('actual_close_date', [$startDate, $endDate]);
            }], 'commission_amount')
            ->get();

        return response()->json($agents);
    }

    public function properties(Request $request): JsonResponse
    {
        $typeDistribution = Property::select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->get();

        $statusDistribution = Property::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        $priceRanges = [
            ['label' => '0 - 100k', 'min' => 0, 'max' => 100000],
            ['label' => '100k - 250k', 'min' => 100000, 'max' => 250000],
            ['label' => '250k - 500k', 'min' => 250000, 'max' => 500000],
            ['label' => '500k - 1M', 'min' => 500000, 'max' => 1000000],
            ['label' => '1M+', 'min' => 1000000, 'max' => null],
        ];

        $priceDistribution = collect($priceRanges)->map(function ($range) {
            $query = Property::where('price', '>=', $range['min']);
            if ($range['max']) {
                $query->where('price', '<', $range['max']);
            }
            return [
                'label' => $range['label'],
                'count' => $query->count(),
            ];
        });

        $topProperties = Property::withCount('deals')
            ->orderBy('deals_count', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'type_distribution' => $typeDistribution,
            'status_distribution' => $statusDistribution,
            'price_distribution' => $priceDistribution,
            'top_properties' => $topProperties,
        ]);
    }

    public function clients(Request $request): JsonResponse
    {
        $sourceDistribution = Client::select('source', DB::raw('count(*) as count'))
            ->groupBy('source')
            ->get();

        $statusDistribution = Client::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        $monthlyNewClients = Client::where('created_at', '>=', now()->subMonths(12))
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('count(*) as count')
            )
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();

        $conversionFunnel = [
            'total_leads' => Client::where('status', 'lead')->count(),
            'prospects' => Client::where('status', 'prospect')->count(),
            'active' => Client::where('status', 'active')->count(),
            'converted' => Client::where('status', 'converted')->count(),
        ];

        return response()->json([
            'source_distribution' => $sourceDistribution,
            'status_distribution' => $statusDistribution,
            'monthly_new_clients' => $monthlyNewClients,
            'conversion_funnel' => $conversionFunnel,
        ]);
    }
}
