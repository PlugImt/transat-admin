import { redirect } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
    const userAgent = request.headers.get('User-Agent') || '';
    const url = new URL(request.url);
    const source = url.searchParams.get('source');
    
    // If coming from QR code or from mobile device, redirect immediately
    const isFromQRCode = source === 'qrcode';
    
    // Detect iOS devices
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
        return redirect('https://apps.apple.com/app/apple-store/id6602883801?pt=127246943&ct=qrcode&mt=8');
    }
    
    // Detect Android devices
    if (/Android/i.test(userAgent)) {
        return redirect('https://play.google.com/store/apps/details?id=com.yohann69.transat2_0');
    }
    
    // For desktop or unknown devices, redirect to the download page
    // Pass along the source parameter if it exists
    const downloadUrl = isFromQRCode ? '/download?source=qrcode' : '/download';
    return redirect(downloadUrl);
}

export default function App() {
    // This component will never render due to the loader redirect
    return null;
} 