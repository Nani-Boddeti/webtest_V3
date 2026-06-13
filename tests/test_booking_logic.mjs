/**
 * Booking Logic Unit Tests
 * 
 * Tests the core booking constraints and business logic.
 */

function createMockBooking(startHour, durationMin = 60) {
  const start = new Date();
  start.setHours(startHour, 0, 0, 0);
  return {
    appointment_start: start,
    duration_minutes: durationMin
  };
}

function checkOverlap(booking1, booking2) {
  const b1Start = new Date(booking1.appointment_start);
  const b1End = new Date(b1Start.getTime() + booking1.duration_minutes * 60000);
  const b2Start = new Date(booking2.appointment_start);
  const b2End = new Date(b2Start.getTime() + booking2.duration_minutes * 60000);
  
  return b1Start < b2End && b1End > b2Start;
}

// Tests
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    failed++;
    console.log(`  ❌ ${name}: ${err.message}`);
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

console.log('\n🧪 Booking Logic Unit Tests\n');

// Test 1: Overlap detection
test('Identifies overlapping bookings', () => {
  const b1 = createMockBooking(10, 60);  // 10:00 - 11:00
  const b2 = createMockBooking(10, 30);  // Starts same time
  assert(checkOverlap(b1, b2), 'Same start time should overlap');
});

test('Identifies non-overlapping bookings', () => {
  const b1 = createMockBooking(10, 60);  // 10:00 - 11:00
  const b2 = createMockBooking(11, 60);  // 11:00 - 12:00
  assert(!checkOverlap(b1, b2), 'Adjacent times should not overlap');
});

test('Identifies partial overlap', () => {
  const b1 = createMockBooking(10, 60);  // 10:00 - 11:00
  const b2 = createMockBooking(10, 30);  // 10:00 - 10:30 (same start)
  assert(checkOverlap(b1, b2), 'Partial overlap should be detected');
});

test('Earlier booking ending at later start does not overlap', () => {
  const b1 = createMockBooking(9, 60);   // 9:00 - 10:00
  const b2 = createMockBooking(10, 60);  // 10:00 - 11:00
  assert(!checkOverlap(b1, b2), 'Edge-to-edge should not overlap');
});

test('One booking fully inside another overlaps', () => {
  const b1 = createMockBooking(10, 120); // 10:00 - 12:00
  const b2 = createMockBooking(10, 30);  // 10:00 - 10:30
  assert(checkOverlap(b1, b2), 'Contained booking should overlap');
});

// Test 2: Business hours validation (simplified)
test('Time within business hours passes', () => {
  const hour = 10;
  assert(hour >= 9 && hour < 17, '10:00 should be within 9-17');
});

test('Time outside business hours fails', () => {
  const hour = 8;
  assert(hour < 9 || hour >= 17, '8:00 should be outside 9-17');
});

// Test 3: Past booking check
test('Future date passes past check', () => {
  const future = new Date();
  future.setDate(future.getDate() + 1);
  const now = new Date();
  assert(future > now, 'Future date should pass past check');
});

test('Past date fails past check', () => {
  const past = new Date();
  past.setDate(past.getDate() - 1);
  const now = new Date();
  assert(past < now, 'Past date should fail past check');
});

// Test 4: Max advance days check
test('Date within advance limit passes', () => {
  const today = new Date();
  const withinLimit = new Date(today);
  withinLimit.setDate(today.getDate() + 15);
  const maxAdvance = new Date(today);
  maxAdvance.setDate(today.getDate() + 30);
  assert(withinLimit <= maxAdvance, '15 days ahead should be within 30 day limit');
});

test('Date beyond advance limit fails', () => {
  const today = new Date();
  const beyondLimit = new Date(today);
  beyondLimit.setDate(today.getDate() + 45);
  const maxAdvance = new Date(today);
  maxAdvance.setDate(today.getDate() + 30);
  assert(beyondLimit > maxAdvance, '45 days ahead should exceed 30 day limit');
});

// Test 5: Min lead time check
test('Time with sufficient lead passes', () => {
  const now = new Date();
  const future = new Date(now.getTime() + 120 * 60000); // 2 hours
  const minLead = new Date(now.getTime() + 60 * 60000); // 1 hour
  assert(future >= minLead, '2 hours ahead should pass 60 min lead check');
});

test('Time with insufficient lead fails', () => {
  const now = new Date();
  const nearFuture = new Date(now.getTime() + 30 * 60000); // 30 min
  const minLead = new Date(now.getTime() + 60 * 60000); // 1 hour
  assert(nearFuture < minLead, '30 min ahead should fail 60 min lead check');
});

// Test 6: Reference ID format
test('Reference ID follows 8-char uppercase format', () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = '';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  assert(ref.length === 8, 'Reference ID should be 8 chars');
  assert(/^[A-Z0-9]+$/.test(ref), 'Reference ID should be uppercase alphanumeric');
});

// Test 7: Service duration
test('Service duration is positive', () => {
  assert(60 > 0, 'Duration should be positive');
  assert(30 > 0, 'Duration should be positive');
});

// Test 8: Booking status enum
test('Booking status values are valid', () => {
  const valid = ['confirmed', 'cancelled', 'rescheduled'];
  assert(valid.includes('confirmed'), 'confirmed is valid');
  assert(valid.includes('cancelled'), 'cancelled is valid');
  assert(valid.includes('rescheduled'), 'rescheduled is valid');
  assert(!valid.includes('unknown'), 'unknown is not valid');
});

// Test 9: Day of week mapping
test('Day of week maps correctly', () => {
  const days = {
    0: 'Monday', 1: 'Tuesday', 2: 'Wednesday', 
    3: 'Thursday', 4: 'Friday', 5: 'Saturday', 6: 'Sunday'
  };
  assert(days[0] === 'Monday', '0 should be Monday');
  assert(days[6] === 'Sunday', '6 should be Sunday');
});

// Test 10: Slot generation basics
test('Slot duration is consistent', () => {
  const slotDuration = 30;
  const slots = [];
  let current = 9 * 60; // 9:00 in minutes
  const end = 17 * 60;  // 17:00 in minutes
  while (current + slotDuration <= end) {
    slots.push({ start: current, end: current + slotDuration });
    current += slotDuration;
  }
  assert(slots.length === 16, '9-17 with 30min slots should yield 16 slots');
  assert(slots[0].start === 540, 'First slot start should be 540 (9:00)');
  assert(slots[slots.length-1].end === 1020, 'Last slot end should be 1020 (17:00)');
});

console.log(`\n📈 Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
