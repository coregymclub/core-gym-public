// ✅ Test: Zoezi API UTAN deras api.js - Använder PUBLIC endpoints
export default defineEventHandler(async (event) => {
  try {
    const baseUrl = 'https://coregymclub.zoezi.se/api';

    // Test 1: Hämta personal (public endpoint, ingen auth krävs!)
    const staffResponse = await fetch(`${baseUrl}/public/staff/get/full`);
    const staff = await staffResponse.json();

    // Test 2: Hämta workouts/gruppträning (public endpoint)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const fromDate = today.toISOString().split('T')[0];
    const toDate = nextWeek.toISOString().split('T')[0];

    const workoutsResponse = await fetch(
      `${baseUrl}/public/workout/get/all?fromDate=${fromDate}&toDate=${toDate}`
    );
    const workouts = await workoutsResponse.json();

    return {
      success: true,
      message: '🎉 ZOEZI API FUNGERAR PERFEKT UTAN api.js!',
      proof: {
        zoeziCodeNeeded: '❌ NEJ - 0 KB från Zoezi',
        authentication: '✅ Public endpoints kräver ingen auth',
        bundleSize: '0 KB Zoezi-kod i din app',
        method: 'Standard fetch() - inget speciellt behövs'
      },
      data: {
        staff: {
          count: staff.length,
          sample: staff.slice(0, 3).map((s: any) => ({
            name: s.name,
            id: s.id
          }))
        },
        workouts: {
          count: workouts.workouts?.length || 0,
          dateRange: `${fromDate} till ${toDate}`,
          sample: workouts.workouts?.slice(0, 2).map((w: any) => ({
            name: w.name,
            start: w.start,
            trainer: w.staff?.name
          })) || []
        }
      },
      endpoints: {
        staff: `${baseUrl}/public/staff/get/full`,
        workouts: `${baseUrl}/public/workout/get/all?fromDate=${fromDate}&toDate=${toDate}`
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Zoezi API error',
      error: error.message
    };
  }
});
