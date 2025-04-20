export namespace Route {
    export interface LinksFunction {
        (): {
            rel: string;
            href: string;
            crossOrigin?: string;
        }[];
    }

    export interface MetaFunction {
        (): {
            title?: string;
            name?: string;
            content?: string;
        }[];
    }

    export interface ErrorBoundaryProps {
        error: any;
    }
} 