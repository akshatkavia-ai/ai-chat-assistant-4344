# AI Copilot Frontend (React)

Modern React-based frontend for the AI Copilot chat application with Ocean Professional theme styling.

## Features

- Real-time chat interface with AI assistant
- Axios-based API communication
- Ocean Professional theme with modern styling
- Responsive design with smooth animations
- Error handling and loading states
- Auto-scroll to latest messages

## Environment Variables

Create a `.env` file in the frontend root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:3001
```

This configures the backend API endpoint. The default is `http://localhost:3001` if not specified.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file if your backend runs on a different URL

## Running the Application

The application is auto-started by the preview environment on port 3000.

To run manually:
```bash
npm start
```

The app will open at http://localhost:3000

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Project Structure

```
src/
├── api/
│   └── client.js       # Axios client and API functions
├── components/
│   └── Chat.js         # Main chat component
├── theme.js            # Ocean Professional theme configuration
├── App.js              # Main app component
└── index.js            # App entry point
```

## Theme

The application uses the **Ocean Professional** theme with:
- Primary color: Blue (#2563EB)
- Secondary color: Amber (#F59E0B)
- Modern aesthetic with rounded corners and subtle shadows
- Smooth transitions and gradients

## API Integration

The frontend communicates with the FastAPI backend using Axios:
- `POST /api/chat` - Send messages and receive AI responses
- `GET /api/health` - Check backend health status

## Browser Support

Supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
