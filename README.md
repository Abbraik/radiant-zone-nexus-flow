# RGS MVUI - Multi-Variable User Interface

A sophisticated React-based reimplementation of the RGS (Resilient Growth Systems) MVUI interface featuring dark-mode glassmorphism design, modular architecture, and comprehensive feature flagging.

## 🚀 Features

### Core Zones
- **Think Zone**: Sprint planning with tension analysis, SRT configuration, and leverage strategy selection
- **Act Zone**: Intervention bundle creation with drag-and-drop reordering and smart role assignment  
- **Monitor Zone**: Real-time loop monitoring with TRI scores, DE-band tracking, and performance sparklines
- **Innovate + Learn Zone**: AI-powered insights feed with experiment runner and shock rehearsal tools

### Design System
- **Dark Glassmorphism**: Modern dark theme with glass-blur effects and sophisticated layering
- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Animation System**: Framer Motion powered with 200ms smooth transitions
- **Semantic Tokens**: HSL-based color system with proper contrast ratios

### Architecture
- **Feature Flags**: Gradual rollout system with `newRgsUI` toggle
- **State Management**: Zustand for UI state, React Query for server data
- **Type Safety**: Comprehensive TypeScript interfaces for all domain entities
- **Mock Data**: Development-ready fixtures with realistic data patterns

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom design tokens
- **Animation**: Framer Motion for smooth transitions
- **State**: Zustand + React Query
- **Routing**: React Router v6 with lazy loading
- **UI Components**: Radix UI primitives + custom library
- **Icons**: Lucide React (24px consistent sizing)

## 🎨 Design System

### Color Palette (HSL)
```css
/* Core Dark Theme */
--background: 220 15% 8%
--foreground: 210 20% 95%
--primary: 215 85% 55%

/* Glassmorphism Layers */
--glass-primary: 220 20% 15% / 70%
--glass-secondary: 220 15% 20% / 60%

/* Tension States */
--tension-high: 0 75% 55%
--tension-medium: 38 85% 55%
--tension-low: 142 65% 45%
```

### Typography
- **Font**: System font stack with fallbacks
- **Hierarchy**: 4 heading levels, 3 body sizes
- **Contrast**: Minimum 4.5:1 ratio for accessibility

### Spacing & Layout
- **Grid**: CSS Grid with responsive breakpoints
- **Spacing**: 8px base unit system
- **Radius**: 12px default, 16px large, 20px extra-large

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/           # Shell, Header, Sidebar, FeatureFlagProvider
│   └── ui/               # Reusable UI components
├── hooks/                # Custom hooks and data fetching
├── pages/                # Zone pages (Think, Act, Monitor, Innovate)
├── services/
│   └── mock/             # Mock data and API adapters
├── stores/               # Zustand state management
├── types/                # TypeScript type definitions
└── assets/               # Static assets and JSON fixtures
```

## 🔧 Development

### Setup
```bash
npm install
npm run dev
```

### Feature Flags
Control feature rollout via the UI store:
```typescript
// Enable new UI
updateFeatureFlag('newRgsUI', true)

// Enable CLD Studio integration  
updateFeatureFlag('cldStudio', true)
```

### Mock Data
Development uses comprehensive mock datasets:
```typescript
// Hooks automatically return mock data in development
const { data: loops } = useMockLoops()
const { data: metrics } = useMockMetrics()
```

### Component Development
All components follow the design system:
```typescript
// Use semantic color tokens
<div className="glass rounded-xl p-6 border border-border-subtle">

// Use standardized spacing
<div className="space-y-4 p-6">

// Use animation utilities  
<div className="animate-entrance hover:animate-glass-hover">
```

## 🎯 Zone Specifications

### Think Zone (`/think`)
- Sprint planning interface with progress tracking
- Tension level analysis with visual indicators
- SRT (Sprint Rhythm Time) slider configuration
- Leverage strategy selection with impact descriptions
- Advanced accordion for DE-band bounds and metadata

### Act Zone (`/act`)
- Two-panel layout: intervention picker + bundle builder
- Searchable intervention library with effort/impact badges
- Drag-and-drop bundle reordering with visual feedback
- Smart role assignment with avatar previews
- RACI matrix support in advanced mode

### Monitor Zone (`/monitor`)
- System pulse bar with clickable status filters
- Performance table with embedded sparklines
- TRI score monitoring with threshold alerts
- DE-band visualization with emoji indicators
- Export capabilities for CSV and reports

### Innovate + Learn Zone (`/innovate`)
- Two-column layout: insight feed (60%) + quick-run (40%)
- AI-generated insights with confidence scores
- Experiment runner with parameter selection
- Shock rehearsal scenarios with impact modeling
- Last-run visualization with delta metrics

## 📊 Performance

### Bundle Size Targets
- Initial bundle: < 200 KB gzipped
- Zone chunks: < 50 KB each
- Assets: < 100 KB total

### Loading Performance
- Zone switching: < 200ms
- Data fetching: < 500ms
- Animations: 60fps target

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- High contrast mode support

## 🚀 Deployment

### Build
```bash
npm run build
npm run preview
```

### Environment Variables
```bash
# Feature flag overrides
VITE_NEW_RGS_UI=true
VITE_MOCK_DATA_MODE=false
VITE_CLD_STUDIO_ENABLED=true
```

### Rollout Strategy
1. **10% Internal**: Enable `newRgsUI` for select users
2. **50% Beta**: Expand to beta user group
3. **100% Production**: Full rollout after monitoring

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests  
```bash
npm run test:e2e
```

### Visual Regression
```bash
npm run test:visual
```

## 📈 Analytics & Monitoring

### Key Metrics
- Zone transition time
- Feature adoption rates
- Error boundaries triggered
- Performance vitals

### Debugging
- Feature flag status visible in header
- Console logs for state changes
- Network request monitoring
- Error boundary reporting

## 🔄 Migration Path

### Legacy Cleanup
After stable 100% rollout:
1. Remove feature flag guards
2. Clean up legacy components
3. Update documentation
4. Archive old codebase

### Future Enhancements
- Real-time collaboration
- Advanced 3D visualizations
- Mobile app companion
- AI-powered recommendations

## 🤝 Contributing

### Development Workflow
1. Feature branches from `main`
2. PR reviews required
3. Automated testing gates
4. Staged deployment

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Component documentation

---

**Built with ❤️ by the RGS Team**