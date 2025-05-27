import Image from "next/image"

interface PartnershipLogoProps {
  size?: number
  className?: string
}

export function PartnershipLogo({ size = 40, className = "" }: PartnershipLogoProps) {
  const trackingLogoSize = size * 1.2 // Making the tracking logo slightly larger for better visibility

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative" style={{ width: size, height: size }}>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unnamed%20%2810%29-lfBmCiSfcbJsi0OWVCdlU1IatKR60p.png"
            alt="Wialon Logo"
            width={size}
            height={size}
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight">Wialon</span>
          <span className="text-xs text-muted-foreground leading-tight">WASL Integration</span>
        </div>
      </div>

      <div className="h-8 w-px bg-gray-300 mx-2"></div>

      <div className="flex items-center">
        <div className="relative" style={{ width: trackingLogoSize, height: trackingLogoSize }}>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tracking%20KSA%20logo.jpg-ddL63JKGDr5r4NTYYcYcYIF8VYdWqb.jpeg"
            alt="Tracking KSA Logo"
            width={trackingLogoSize}
            height={trackingLogoSize}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
