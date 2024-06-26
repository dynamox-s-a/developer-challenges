'use server'

export const monitorsData = async (machine_id: number, token: string) => {
	const url =
		process.env.NEXT_PUBLIC_API_BASE_URL +
		`/monitors/machine/${machine_id}`
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
		console.log('Monitors data:', data)

		return data
	} catch (error) {
		console.error('Error fetching monitors data:', error)
		throw error
	}
}
