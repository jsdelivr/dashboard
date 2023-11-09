const DIRECTUS_URL = process.env.DIRECTUS_URL;
const ADMIN_ACCESS_TOKEN = process.env.ADMIN_ACCESS_TOKEN;

async function createRole () {
	const URL = `${DIRECTUS_URL}/roles?access_token=${ADMIN_ACCESS_TOKEN}`;
	const response = await fetch(URL, {
		method: 'POST',
		body: JSON.stringify({
			name: 'User',
			icon: 'sentiment_satisfied',
			description: null,
			ip_access: null,
			enforce_tfa: false,
			admin_access: false,
			app_access: true,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((response) => {
		if (!response.ok) {
			throw new Error(`Fetch request failed. Status: ${response.status}`);
		}

		return response.json();
	});
	return response.data;
}

async function createPermissions (roleId) {
	const URL = `${DIRECTUS_URL}/permissions?access_token=${ADMIN_ACCESS_TOKEN}`;
	const response = await fetch(URL, {
		method: 'POST',
		body: JSON.stringify([
			{
				collection: 'tokens',
				action: 'create',
				role: roleId,
				permissions: {
					user_created: {
						_eq: '$CURRENT_USER',
					},
				},
				fields: [ 'name', 'value', 'expire', 'origins' ],
			},
			{
				collection: 'tokens',
				action: 'read',
				role: roleId,
				permissions: {
					user_created: {
						_eq: '$CURRENT_USER',
					},
				},
				fields: [ '*' ],
			},
			{
				collection: 'tokens',
				action: 'update',
				role: roleId,
				permissions: {
					user_created: {
						_eq: '$CURRENT_USER',
					},
				},
				fields: [ 'name', 'value', 'expire', 'origins' ],
			},
			{
				collection: 'tokens',
				action: 'delete',
				role: roleId,
				permissions: {
					user_created: {
						_eq: '$CURRENT_USER',
					},
				},
				fields: [ '*' ],
			},
			{
				collection: 'directus_users',
				action: 'read',
				role: roleId,
				permissions: {
					id: {
						_eq: '$CURRENT_USER',
					},
				},
				fields: [ 'first_name', 'last_name', 'email', 'appearance', 'theme_light', 'theme_dark', 'theme_light_overrides', 'theme_dark_overrides', 'token', 'status', 'external_identifier', 'provider', 'github' ],
			},
			{
				collection: 'directus_users',
				action: 'update',
				role: roleId,
				permissions: {
					id: {
						_eq: '$CURRENT_USER',
					},
				},
				fields: [ 'token', 'last_page', 'appearance', 'theme_light', 'theme_dark', 'theme_light_overrides', 'theme_dark_overrides' ],
			},
		]),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((response) => {
		if (!response.ok) {
			throw new Error(`Fetch request failed. Status: ${response.status}`);
		}

		return response.json();
	});
	return response.data;
}

export async function up () {
	const role = await createRole();
	await createPermissions(role.id);
	console.log(`User role ${role.id} created`);
}

export async function down () {
	console.log('There is no down operation for that migration.');
}
