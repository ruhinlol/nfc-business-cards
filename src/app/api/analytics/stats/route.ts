import { NextRequest, NextResponse } from 'next/server';
import { getBusinessStats, getOverallStats } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (businessId && businessId !== 'all') {
      const stats = getBusinessStats(businessId);
      return NextResponse.json(stats);
    } else {
      const overall = getOverallStats();
      return NextResponse.json(overall);
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
