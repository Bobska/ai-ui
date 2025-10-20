# AI Desktop UI - Debug Console Guide

## What You Should See on the Debug Page

When you open `debug.html` in your browser, you should see:

### 📊 Top Stats Cards (4 cards)
1. **Total Memories**: 36 stored entries
2. **Memory Types**: 6 categories
3. **Model Name**: llama3.1:latest
4. **Server Uptime**: 16m 17s (updates in real-time)

### 🔧 System Information Panel
Shows 6 key metrics:
- **Model Name**: llama3.1:latest
- **Model Host**: http://localhost:11434/
- **Model Status**: active
- **Server Uptime**: Running time in h/m/s format
- **Total Memories**: 36
- **API Endpoint**: http://localhost:8000

### 📈 Memory Types Breakdown
Visual breakdown with progress bars showing distribution:
- **Technical**: 18 memories (50%)
- **Conversation**: 16 memories (44%)
- **User Facts**: 2 memories (6%)
- **Preferences**: 0
- **Projects**: 0
- **Goals**: 0

### ⚙️ Debug Mode Toggle
- **Purpose**: Enables console.log() debugging in browser
- **How it works**: Saves preference to localStorage
- **To view logs**: Press F12 to open DevTools → Console tab

### 🔄 Auto-Refresh Feature
- Automatically updates every 5 seconds
- Shows "Last updated: [time]" timestamp
- Can pause/resume with the button
- Manual refresh available

## How to Use

1. **Open the page**: Simply open `debug.html` in your browser
2. **View stats**: Stats load automatically from `http://localhost:8000/api/stats`
3. **Enable debug mode**: Toggle the switch and open F12 DevTools to see console logs
4. **Pause updates**: Click "Pause Auto-Refresh" if you want to stop automatic updates

## API Endpoint

The debug page fetches data from:
```
GET http://localhost:8000/api/stats
```

Current response structure:
```json
{
  "total_memories": 36,
  "memories_by_type": {
    "user_facts": 2,
    "preferences": 0,
    "projects": 0,
    "goals": 0,
    "technical": 18,
    "conversation": 16
  },
  "model_info": {
    "name": "llama3.1:latest",
    "host": "http://localhost:11434/",
    "status": "active"
  },
  "uptime_seconds": 977.95
}
```

## Troubleshooting

**If you see "Connection Error":**
- Make sure your API server is running at `http://localhost:8000`
- Check that the `/api/stats` endpoint is accessible
- The status indicator will be red when offline

**If data looks wrong:**
- Click "Refresh Now" to manually update
- Check browser console (F12) for errors
- Verify API is returning correct data structure

## Features

✅ Real-time stats display  
✅ Auto-refresh every 5 seconds  
✅ Visual progress bars for memory types  
✅ Status indicator (green = online, red = offline)  
✅ Responsive design for mobile and desktop  
✅ Dark theme consistent with other pages  
✅ Error handling with user-friendly messages  

## Navigation

All pages have consistent navigation:
- **Chat**: Main chat interface (`index.html`)
- **Memories**: View and manage memories (`memories.html`)
- **Debug**: System stats and debugging (`debug.html`)
- **Settings**: Configuration page (`settings.html` - to be created)
