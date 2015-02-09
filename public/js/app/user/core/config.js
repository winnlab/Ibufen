var config = {
	router: {
		base: '/',
		modulesContainer: '#modules',
		modules: [
			{
				name: 'main',
				path: {
					client: 'modules/main/main',
					server: ''
				}
			},
			{
				name: 'advices',
				path: {
					client: 'modules/advices/advices',
					server: ':name'
				}
			},
			{
				name: 'video',
				fake_path: ''
			}
		],
		defaultModule: 'main'
	}
};

export default config;