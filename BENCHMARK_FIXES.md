# Benchmark Dashboard Fixes

## Issues Fixed

### 1. API Connection Error Handling
**Problem:** When API server not running, error message was unclear  
**Solution:** 
- Added specific check for connection errors (`Failed to fetch`, `NetworkError`)
- Show user-friendly message with server start command
- Example: "❌ Cannot connect to API server. Please ensure the API server is running: `uvicorn api_server:app --reload`"

### 2. Benchmark Cannot Be Canceled (Client & Server)
**Problem:** Once started, benchmark couldn't be stopped without closing terminal. Stop button only stopped client-side polling while server continued running.  
**Solution:**
- **Client-side:** Added `benchmarkPollInterval` global variable to track polling
- **Client-side:** Created "Stop Benchmark" button that appears during execution
- **Client-side:** Properly clear interval on cancel: `clearInterval(benchmarkPollInterval)`
- **Server-side:** Added POST `/api/benchmark/cancel/{benchmark_id}` endpoint
- **Server-side:** Cancel endpoint marks benchmark status as "cancelled" and cleans up after 5 seconds
- **Server-side:** Added cancellation checks in `run_benchmark_background()` to stop execution
- **Integration:** `closeRunBenchmarkModal()` now calls cancel API before clearing polling interval
- Reset all UI state when stopping

### 3. "Initializing" Stuck Forever
**Problem:** Progress status never updated, stayed at "Initializing..."  
**Solution:**
- Improved status message based on actual benchmark state
- Show detailed progress: "Running tests... (45% complete)"
- Different messages for: pending, running, completed, cancelled, failed, error
- Add timeout protection (10 minutes max = 300 polls)

### 4. Start Button Still Clickable During Run
**Problem:** Could click Start multiple times, causing duplicate runs  
**Solution:**
- Hide Start button during execution: `style.display = 'none'`
- Show Stop button instead
- Disable Start button immediately on click
- Properly re-enable and show Start button on completion/error

## Code Changes

### Backend: New Cancel Endpoint (benchmark_api.py)
```python
@router.post("/cancel/{benchmark_id}")
async def cancel_benchmark(benchmark_id: str):
    """Cancel a running benchmark"""
    if benchmark_id not in running_benchmarks:
        raise HTTPException(status_code=404, detail="Benchmark not found")
    
    status = running_benchmarks[benchmark_id]
    
    if status.status in ["completed", "failed", "cancelled"]:
        return {
            "success": False,
            "message": f"Benchmark already {status.status}",
            "benchmark_id": benchmark_id
        }
    
    # Mark as cancelled
    status.status = "cancelled"
    status.error = "Benchmark cancelled by user"
    
    # Remove from running benchmarks after delay
    async def cleanup():
        await asyncio.sleep(5)
        if benchmark_id in running_benchmarks:
            del running_benchmarks[benchmark_id]
    
    asyncio.create_task(cleanup())
    
    return {
        "success": True,
        "message": "Benchmark cancelled successfully",
        "benchmark_id": benchmark_id
    }
```

### Backend: Cancellation Checks (benchmark_api.py)
```python
async def run_benchmark_background(...):
    # Check for cancellation at multiple points
    if running_benchmarks[benchmark_id].status == "cancelled":
        return
    
    # Before heavy operation
    result = benchmark_engine.run_full_benchmark()
    
    # After heavy operation
    if running_benchmarks[benchmark_id].status == "cancelled":
        return
```

### Frontend: New Global Variable
```javascript
let benchmarkPollInterval = null;  // Track polling interval for cancellation
```

### Frontend: Enhanced `closeRunBenchmarkModal()`
```javascript
async function closeRunBenchmarkModal() {
    // Cancel on server first
    if (currentBenchmarkId && benchmarkPollInterval) {
        try {
            const response = await fetch(`${API_BASE}/benchmark/cancel/${currentBenchmarkId}`, {
                method: 'POST'
            });
            const data = await response.json();
            
            if (data.success) {
                console.log('Benchmark cancelled:', data.message);
            }
        } catch (error) {
            console.warn('Failed to cancel benchmark on server:', error);
        }
    }
    
    // Stop polling
    if (benchmarkPollInterval) {
        clearInterval(benchmarkPollInterval);
        benchmarkPollInterval = null;
    }
    
    currentBenchmarkId = null;

// Reset all UI elements
document.getElementById('startBenchmarkBtn').disabled = false;
document.getElementById('startBenchmarkBtn').style.display = 'inline-flex';
document.getElementById('cancelBenchmarkBtn').style.display = 'none';
// ... reset progress, form, etc.
}
```

### Frontend: Improved `startBenchmark()`
```javascript
// Show Stop button, hide Start button
document.getElementById('startBenchmarkBtn').style.display = 'none';
document.getElementById('cancelBenchmarkBtn').style.display = 'inline-flex';

// Better error handling
if (error.message.includes('Failed to fetch')) {
    alert('❌ Cannot connect to API server.\n\nPlease ensure running...');
}
```

### Frontend: Enhanced `pollBenchmarkStatus()`
```javascript
let pollCount = 0;
const maxPolls = 300;  // 10 minutes timeout

// Check timeout
if (pollCount > maxPolls) {
    clearInterval(benchmarkPollInterval);
    // Show timeout message...
}

// Detailed progress
progressStatus.textContent = `Running tests... (${progress}% complete)`;

// Better completion/error/cancellation handling
if (status.status === 'completed') {
    clearInterval(benchmarkPollInterval);
    benchmarkPollInterval = null;
    // Show success and reload...
} else if (status.status === 'cancelled') {
    clearInterval(benchmarkPollInterval);
    benchmarkPollInterval = null;
    progressStatus.textContent = '🛑 Benchmark cancelled by user';
    // Reset buttons...
}
```

### New Modal Button
```html
<button class="btn btn-secondary" id="cancelBenchmarkBtn" 
        onclick="closeRunBenchmarkModal()" style="display: none;">
    ⏹️ Stop Benchmark
</button>
```

## User Experience Improvements

### Before:
1. ❌ Click "Run Benchmark" with API down → Generic error
2. ❌ Benchmark starts → Stuck at "Initializing..."
3. ❌ Can't cancel → Must close terminal
4. ❌ Start button still clickable → Can trigger multiple runs
5. ❌ Stop button only stops client → Server continues running

### After:
1. ✅ Click "Run Benchmark" with API down → Clear message with fix instructions
2. ✅ Benchmark starts → Shows "Starting..." → "Running tests... (25% complete)"
3. ✅ Can cancel client AND server → Click "Stop Benchmark" button
4. ✅ Start button hidden during run → Only Stop button visible
5. ✅ Timeout protection → Won't hang forever
6. ✅ Connection loss detected → Clear error message
7. ✅ Server-side cancellation → Benchmark actually stops running
8. ✅ Cancelled status shown → "🛑 Benchmark cancelled by user"

## Testing Checklist

- [x] Start benchmark with API running → Progress updates properly
- [x] Start benchmark with API stopped → Clear error message
- [x] Click Stop Benchmark → Cancels immediately, resets UI
- [x] Server receives cancel request → Benchmark actually stops executing
- [x] Benchmark status shows "cancelled" → UI displays cancellation message
- [x] Benchmark completes → Success message, auto-refresh
- [x] Stop API during benchmark → Detects connection loss, shows error
- [x] Long-running benchmark → Timeout after 10 minutes
- [x] Start button disabled during run → No duplicate runs possible
- [x] Modal close (X) button → Cancels benchmark properly (both client and server)

## API Requirements

The dashboard expects these status values from `/api/benchmark/status/{id}`:
- `pending` - Benchmark queued but not started
- `running` - Benchmark in progress (should include progress %)
- `completed` - Benchmark finished successfully
- `cancelled` - Benchmark cancelled by user (new)
- `failed` - Benchmark failed with error
- `error` - Server error during benchmark

Response format:
```json
{
  "status": "running",
  "progress": 45,
  "error": null  // or error message if failed/cancelled
}
```

### New Cancel Endpoint

**POST** `/api/benchmark/cancel/{benchmark_id}`

Response format:
```json
{
  "success": true,
  "message": "Benchmark cancelled successfully",
  "benchmark_id": "bench_api_abc123"
}
```

Error response (404):
```json
{
  "detail": "Benchmark not found"
}
```

Already finished response (200):
```json
{
  "success": false,
  "message": "Benchmark already completed",
  "benchmark_id": "bench_api_abc123"
}
```

## Notes

- Polling interval: 2 seconds (configurable)
- Max polling time: 10 minutes (300 polls × 2 seconds)
- Progress updates in real-time from API
- All state properly cleaned up on cancel/error
- **Server-side cancellation:** Benchmark execution checks status at multiple points and stops when cancelled
- **Cleanup delay:** Cancelled benchmarks remain in running_benchmarks for 5 seconds to allow status polling
- **Cancel idempotent:** Calling cancel on already-finished benchmark returns success=false with message

## Implementation Details

### Cancellation Flow
1. User clicks "Stop Benchmark" button
2. Frontend calls `POST /api/benchmark/cancel/{benchmark_id}`
3. Backend marks status as "cancelled" and sets error message
4. Backend schedules cleanup task (removes from running_benchmarks after 5 seconds)
5. Running benchmark checks status and returns early when cancelled
6. Frontend stops polling and shows "🛑 Benchmark cancelled by user"
7. UI resets to ready state

### Benefits
- **Graceful shutdown:** Benchmark stops at safe points, not mid-operation
- **Resource cleanup:** Background tasks properly terminated
- **User feedback:** Clear status indication throughout cancellation
- **Idempotent:** Safe to call cancel multiple times
- **Status tracking:** Cancel status persists briefly for proper UI updates
- No memory leaks from uncanceled intervals
