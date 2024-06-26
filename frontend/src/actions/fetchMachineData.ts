'use server'

export const machineDataFetch = async (user_id: string, token: string) => {
	const url =
		process.env.NEXT_PUBLIC_API_BASE_URL +
		`/machine/user/${user_id}`
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
		console.error('Error fetching machine data:', error)
		throw error
	}
}
