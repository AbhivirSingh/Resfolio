import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
    width: 1,
    height: 1,
}
export const contentType = 'image/png'

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                }}
            />
        ),
        {
            ...size,
        }
    )
}
