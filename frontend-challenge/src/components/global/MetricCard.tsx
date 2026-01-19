import { Box, Card, Typography } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'

interface MetricCardProps {
    value: string | number
    label: string
    color?: 'primary' | 'success' | 'warning' | 'info'
}

const colorMap = {
    primary: { light: '#e3f2fd', main: '#1976d2' },
    success: { light: '#e8f5e9', main: '#388e3c' },
    warning: { light: '#fff3e0', main: '#f57c00' },
    info: { light: '#e0f2f1', main: '#00897b' },
}

export default function MetricCard({
    value,
    label,
    color = 'primary',
}: MetricCardProps) {
    const Icon = EventIcon
    const colors = colorMap[color]

    return (
        <Card
            sx={{
                p: 3,
                backgroundColor: colors.light,
                border: `1px solid ${colors.main}`,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 24px rgba(0, 0, 0, 0.15)`,
                    backgroundColor: colors.main,
                    '& .metric-icon': {
                        color: '#fff',
                    },
                    '& .metric-value': {
                        color: '#fff',
                    },
                    '& .metric-label': {
                        color: 'rgba(255, 255, 255, 0.9)',
                    },
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Icon
                    className="metric-icon"
                    sx={{
                        fontSize: 32,
                        color: colors.main,
                        transition: 'color 0.3s ease',
                    }}
                />
                <Typography
                    variant="h4"
                    className="metric-value"
                    sx={{
                        fontWeight: 700,
                        color: colors.main,
                        transition: 'color 0.3s ease',
                    }}
                >
                    {value}
                </Typography>
            </Box>
            <Typography
                variant="body2"
                className="metric-label"
                sx={{
                    color: 'textSecondary',
                    fontWeight: 500,
                    transition: 'color 0.3s ease',
                }}
            >
                {label}
            </Typography>
        </Card>
    )
}
