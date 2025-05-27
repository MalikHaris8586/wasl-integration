import Image from "next/image"
import Link from "next/link"

interface WialonLogoProps {
  size?: number
  showText?: boolean
  className?: string
  asLink?: boolean
}

export function WialonLogo({ size = 40, showText = true, className = "", asLink = true }: WialonLogoProps) {
  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
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
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight">Wialon</span>
          <span className="text-xs text-muted-foreground leading-tight">WASL Integration</span>
        </div>
      )}
    </div>
  )

  if (asLink) {
    return <Link href="/">{content}</Link>
  }

  return content
}
