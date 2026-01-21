import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  pageName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class PageErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`PageErrorBoundary [${this.props.pageName || 'Unknown'}]:`, error, errorInfo);
  }

  private handleRefresh = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-6" dir="rtl">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" aria-hidden="true" />
            </div>
            
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">
              אירעה שגיאה בדף זה
            </h1>
            
            <p className="text-muted-foreground mb-6 text-sm">
              מתנצלים על אי הנוחות. נסו לרענן את הדף או לחזור לדף הבית.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="hero" 
                onClick={this.handleRefresh}
                className="gap-2"
              >
                <RefreshCcw className="w-4 h-4" aria-hidden="true" />
                רענן דף
              </Button>
              
              <Button 
                variant="outline" 
                onClick={this.handleGoHome}
                className="gap-2"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                דף הבית
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary;
