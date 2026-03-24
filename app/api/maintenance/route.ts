import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, use a database like PostgreSQL, Redis, or any persistent storage
let maintenanceMode = false;

export async function GET() {
  try {
    return NextResponse.json({
      maintenanceMode,
      message: maintenanceMode ? 'Site is in maintenance mode' : 'Site is operational'
    });
  } catch (error) {
    console.error('Error fetching maintenance mode:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance status' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { maintenanceMode: newMode } = body;

    if (typeof newMode !== 'boolean') {
      return NextResponse.json(
        { error: 'maintenanceMode must be a boolean' },
        { status: 400 }
      );
    }

    maintenanceMode = newMode;

    // In production, you'd save this to a database here
    // await db.settings.update({ where: { key: 'maintenance_mode' }, data: { value: newMode } });

    return NextResponse.json({
      maintenanceMode,
      message: `Maintenance mode ${newMode ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error('Error updating maintenance mode:', error);
    return NextResponse.json(
      { error: 'Failed to update maintenance mode' },
      { status: 500 }
    );
  }
}
