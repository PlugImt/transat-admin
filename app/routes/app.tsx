import { redirect } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
    const userAgent = request.headers.get('User-Agent') || '';
    
    // Detect iOS devices
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
        return redirect('https://apps.apple.com/fr/app/transat/id6602883801?l=en-GB');
    }
    
    // Detect Android devices
    if (/Android/i.test(userAgent)) {
        return redirect('https://play.google.com/store/apps/details?id=com.yohann69.transat2_0');
    }
    
    // For desktop or unknown devices, redirect to the download page
    return redirect('/download');
}

export default function App() {
    // This component will never render due to the loader redirect
    return null;
} 