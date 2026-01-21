import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-6" dir="rtl">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              אופס! משהו השתבש
            </h1>
            
            <p className="text-muted-foreground mb-6">
              אירעה שגיאה לא צפויה. אנחנו מתנצלים על אי הנוחות.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="hero" 
                onClick={this.handleRefresh}
                className="gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                רענן את הדף
              </Button>
              
              <Button 
                variant="outline" 
                onClick={this.handleGoHome}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                חזרה לדף הבית
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-right">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  פרטי השגיאה (למפתחים)
                </summary>
                <div className="mt-4 p-4 bg-muted rounded-lg text-xs text-muted-foreground overflow-auto max-h-60">
                  <p className="font-medium text-destructive mb-2">{this.state.error.message}</p>
                  <pre className="whitespace-pre-wrap">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
