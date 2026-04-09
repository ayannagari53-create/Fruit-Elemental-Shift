import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: '#050810' }}
        >
          <div
            className="text-center px-8 py-10 rounded-2xl max-w-sm"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div className="text-5xl mb-4">🎮</div>
            <h2 className="text-xl font-bold text-white mb-2">WebGL Required</h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              This game requires WebGL support. Please open it in a modern browser like Chrome, Firefox, or Edge.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
