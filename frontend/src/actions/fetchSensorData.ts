'use server'

export const sensorData = async (machine_id: number, token: string) => {
	const url =
		process.env.NEXT_PUBLIC_API_BASE_URL +
		`/sensor/machine/${machine_id}`
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				key: 'D-lRnkhY#',
                Authorization: `Bearer ${token}`
			},
		})
		const data = await response.json()

		return data
	} catch (error) {
		console.error('Error fetching sensor data:', error)
		throw error
	}
}
